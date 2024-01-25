import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useContractRead, useNetwork, useSwitchNetwork } from 'wagmi';
import { abi } from './contracts/swapERC20ABI';
import { zeroAddress } from 'viem';
import { CheckFunctionArgs, ParsedJsonParams, InputType } from '../types';
import { validateJson } from './utilities/validateJson';
import { displayErrors } from './utilities/displayErrors';
import { twMerge } from 'tailwind-merge';
import { Errors } from './components/Errors';
import { JsonForm } from './components/forms/JsonForm';
import { Header } from './components/Header';
import { UrlForm } from './components/forms/UrlForm';
import { Toggle } from './components/Toggle';
import { SwapERC20 } from '@airswap/libraries';
import { useDecompressedOrderFromUrl } from './hooks/useDecompressedOrderFromUrl';
import { formatErrorsList } from './utilities/formatErrorsList';
import { useJsonValues } from './hooks/useJsonValues';
import { checkSmartContractError } from './utilities/checkSmartContractError';
import { getOutputErrorsList } from './utilities/getOutputErrorsList';

function App() {
  const [inputType, setInputType] = useState<InputType>(InputType.JSON);
  const [jsonString, setJsonString] = useState<undefined | string>(undefined);
  const [urlString, setUrlString] = useState<string | undefined>(undefined);
  const [parsedJson, setParsedJson] = useState<
    undefined | Partial<ParsedJsonParams>
  >(undefined);
  const [decompressedJson, setDecompressedJson] = useState<string | undefined>(
    undefined
  );
  const [swapContractAddress, setSwapContractAddress] = useState<
    string | undefined
  >(undefined);
  const [selectedChainId, setSelectedChainId] = useState<number | undefined>();
  const [errors, setErrors] = useState<string[]>([]);
  // whenever use input changes, isEnableCheck changes to false. Gets set to true only when user submits json
  const [isEnableCheck, setIsEnableCheck] = useState(false);
  const [isNoErrors, setIsNoErrors] = useState(false);

  const { switchNetwork } = useSwitchNetwork({
    chainId: selectedChainId || 1,
    onSettled(data, error) {
      if (error) {
        console.log('Error:', error);
      } else {
        console.log('data:', data);
      }
    },
  });
  const { chain } = useNetwork();

  const decompressedOrderFromUrl = useDecompressedOrderFromUrl(urlString);

  const {
    senderWallet,
    nonce,
    expiry,
    signerWallet,
    signerToken,
    signerAmount,
    senderToken,
    senderAmount,
    v,
    r,
    s,
  } = useJsonValues({ inputType, parsedJson, decompressedOrderFromUrl });

  const checkFunctionArgs: CheckFunctionArgs = [
    (senderWallet as `0x${string}`) || zeroAddress,
    nonce || BigInt(0),
    expiry || BigInt(0),
    (signerWallet as `0x${string}`) || zeroAddress,
    (signerToken as `0x${string}`) || zeroAddress,
    signerAmount || BigInt(0),
    (senderToken as `0x${string}`) || zeroAddress,
    senderAmount || BigInt(0),
    v || 0,
    r || '0x',
    s || '0x',
  ];

  const {
    data: checkFunctionData,
    isLoading: isLoadingCheck,
    error: errorCheck,
  } = useContractRead({
    chainId: chain?.id,
    abi,
    address: swapContractAddress as `0x${string}`,
    functionName: 'check',
    args: checkFunctionArgs,
    enabled: isEnableCheck,
  });

  const { data: protocolFee, isLoading: isLoadingProtocolFee } =
    useContractRead({
      chainId: chain?.id,
      abi,
      address: swapContractAddress as `0x${string}`,
      functionName: 'protocolFee',
    });

  const { data: domainName } = useContractRead({
    chainId: chain?.id,
    abi,
    address: swapContractAddress as `0x${string}`,
    functionName: 'DOMAIN_NAME',
  });

  const { data: domainChainId } = useContractRead({
    chainId: chain?.id,
    abi,
    address: swapContractAddress as `0x${string}`,
    functionName: 'DOMAIN_CHAIN_ID',
  });

  const { data: domainVersion } = useContractRead({
    chainId: chain?.id,
    abi,
    address: swapContractAddress as `0x${string}`,
    functionName: 'DOMAIN_VERSION',
  });

  const handleChangeTextAreaJson = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsEnableCheck(false);
    setJsonString(e.target.value);
  };

  const handleChangeTextAreaUrl = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsEnableCheck(false);
    setParsedJson(undefined);
    setUrlString(e.target.value);
  };

  // Start of smaller functions used in handleSubmit
  const handleJsonSubmission = () => {
    const parsedJsonObject = jsonString && JSON.parse(jsonString);
    setParsedJson(parsedJsonObject);
    checkSmartContractError({ errorCheck, setErrors });
  };

  const handleUrlSubmission = () => {
    const jsonString = JSON.stringify(decompressedOrderFromUrl);
    const parsedJsonString = JSON.parse(jsonString);
    setParsedJson(parsedJsonString);
  };

  const validateInputs = () => {
    if (inputType === InputType.JSON && !jsonString) {
      setErrors(['Input cannot be blank']);
      return false;
    }
    if (inputType === InputType.URL && !decompressedOrderFromUrl) {
      setErrors([
        'Something is wrong with your URL. Try copy-pasting it again',
      ]);
      return false;
    }
    return true;
  };
  // End of functions used in handleSubmit

  const handleSubmit = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setParsedJson(undefined);
    setIsEnableCheck(true);
    setErrors([]);
    setIsNoErrors(false);

    if (!validateInputs()) {
      return;
    }
    try {
      inputType === InputType.JSON
        ? handleJsonSubmission()
        : handleUrlSubmission();
    } catch (e) {
      console.error(e);
      setErrors([`Error processing URL: ${e}`]);
    }
  };

  const handleFormattedListErrors = (errorsList: string[] | undefined) => {
    const formattedErrorsList = formatErrorsList(errorsList);

    if (formattedErrorsList && formattedErrorsList.length > 0) {
      setErrors((prevErrors) => {
        const updatedErrors = [...prevErrors, ...formattedErrorsList];
        const uniqueErrors = [...new Set(updatedErrors)];
        return uniqueErrors;
      });
    }
  };

  // performs actions after parsedJSON has been updated
  useEffect(() => {
    const isJsonValid = validateJson({
      json: parsedJson,
      swapContractAddress: swapContractAddress,
    });

    if (isJsonValid) {
      setErrors((prevErrors) => {
        const updatedErrors = [...prevErrors, ...isJsonValid];
        const uniqueErrors = [...new Set(updatedErrors)];
        return uniqueErrors;
      });
    }

    const outputErrorsList = getOutputErrorsList(checkFunctionData);

    // create array of human-readable errors
    const errorsList = displayErrors({
      errorsList: outputErrorsList,
      requiredValues: {
        domainChainId,
        domainVerifyingContract: swapContractAddress,
        domainName,
        domainVersion,
        protocolFee,
      },
    });

    handleFormattedListErrors(errorsList);

    if (!isJsonValid && errorsList && errorsList.length === 0) {
      setIsNoErrors(true);
    }
  }, [
    chain,
    parsedJson,
    checkFunctionData,
    swapContractAddress,
    domainChainId,
    domainName,
    domainVersion,
    protocolFee,
    selectedChainId,
  ]);

  // programating handling of chainId
  useEffect(() => {
    switchNetwork && switchNetwork();
    const address = SwapERC20.getAddress(chain?.id || 1);
    address && setSwapContractAddress(address);
  }, [chain, swapContractAddress, switchNetwork]);

  return (
    <div className="flex flex-col font-sans">
      <Header
        protocolFee={protocolFee}
        isLoadingProtocolFee={isLoadingProtocolFee}
      />
      <div
        id="container"
        className={twMerge(
          'flex flex-col md:flex-row box-border px-1 mx-auto mb-2 xs:mb-6',
          'w-full xs:w-[90%] sm:w-4/5 md:w-[95%] lg:w-[90%] xl:w-4/5',
          'text-center bg-transparent text-lightGray rounded-md'
        )}
      >
        <div
          className={twMerge(
            'md:w-full lg:w-1/2',
            'md:pt-4 md:pb-8 md:mr-2 bg-blueDark rounded-md pb-6 px-1',
            'border border-blueGray shadow-sm shadow-grayDark'
          )}
        >
          <div className="w-full sm:w-4/5 md:w-full lg:w-[90%] m-auto">
            <Toggle
              inputType={inputType}
              clickTypeJson={() => {
                setInputType(InputType.JSON);
                setIsNoErrors(false);
                setIsEnableCheck(false);
                setErrors([]);
              }}
              clickTypeUrl={() => {
                setInputType(InputType.URL);
                setIsNoErrors(false);
                // reset the following 2 values because they affect the behavior of `decompressedJson` in Dialog.tsx
                setUrlString(undefined);
                setIsEnableCheck(false);
                setErrors([]);
              }}
            />

            {inputType === InputType.JSON ? (
              <JsonForm
                handleSubmit={handleSubmit}
                handleChangeTextArea={handleChangeTextAreaJson}
                isEnableCheck={isEnableCheck}
                isLoading={isLoadingCheck}
                // setIsEnableCheck={setIsEnableCheck}
                setSelectedChainId={setSelectedChainId}
              />
            ) : (
              <UrlForm
                handleSubmit={handleSubmit}
                handleChangeTextArea={handleChangeTextAreaUrl}
                isEnableCheck={isEnableCheck}
                isLoading={isLoadingCheck}
                parsedJson={parsedJson}
                decompressedJson={decompressedJson}
                setDecompressedJson={setDecompressedJson}
              />
            )}
          </div>
        </div>
        <div
          className={twMerge(
            'md:w-full lg:w-1/2 md:pt-4 md:ml-2 md:mt-0 mt-4 pt-4 pb-8 px-1',
            'bg-blueDark text-lightGray',
            'border border-blueGray rounded-md shadow-sm shadow-grayDark'
          )}
        >
          <Errors
            isLoading={isLoadingCheck}
            errors={errors}
            isNoErrors={isNoErrors}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
