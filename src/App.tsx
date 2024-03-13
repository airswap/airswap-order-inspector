import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { useReadContract } from 'wagmi';
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
import { useJsonValues } from './hooks/useJsonValues';
import { checkSmartContractError } from './utilities/checkSmartContractError';
import { getOutputErrorsList } from './utilities/getOutputErrorsList';
import { validateInputs } from './utilities/validateInputs';
import { handleFormattedListErrors } from './utilities/handleFormattedErrorsList';

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
  // selectedChainId is used in the selector component
  const [selectedChainId, setSelectedChainId] = useState<number>(1);
  // if chainId is found in JSON, chainIdFromJson will be used and will override selectedChainId
  const [chainIdFromJson, setChainIdFromJson] = useState<
    number | string | undefined
  >();
  const [errors, setErrors] = useState<string[]>([]);
  // whenever use input changes, isEnableCheck changes to false. Gets set to true only when user submits json
  const [isEnableCheck, setIsEnableCheck] = useState(false);
  const [isNoErrors, setIsNoErrors] = useState(false);

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
  } = useReadContract({
    chainId: selectedChainId,
    abi,
    address: swapContractAddress as `0x${string}`,
    functionName: 'check',
    args: checkFunctionArgs,
    query: {
      enabled: isEnableCheck,
    },
  });

  const { data: protocolFee } = useReadContract({
    chainId: selectedChainId,
    abi,
    address: swapContractAddress as `0x${string}`,
    functionName: 'protocolFee',
  });

  const { data: eip712Domain } = useReadContract({
    chainId: selectedChainId,
    abi,
    address: swapContractAddress as `0x${string}`,
    functionName: 'eip712Domain',
    query: {
      staleTime: 86400000,
    },
  });

  const handleChangeTextAreaJson = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // state change triggers first useEffect hook
    setJsonString(e.target.value);
  };

  const handleChangeTextAreaUrl = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // state change triggers first useEffect hook
    setUrlString(e.target.value);
  };

  const handleToggle = (inputType: InputType) => {
    if (inputType === InputType.URL) {
      setInputType(InputType.JSON);
    } else {
      setInputType(InputType.URL);
      setUrlString(undefined);
    }
    setIsNoErrors(false);
    setIsEnableCheck(false);
    setErrors([]);
  };

  const handleSubmit = (e: MouseEvent<HTMLFormElement>) => {
    console.log('handleSubmit');
    e.preventDefault();
    setIsEnableCheck(true);
    setIsNoErrors(false);
    setErrors([]);
  };

  const isInputValid = useMemo(
    () =>
      validateInputs({
        isEnableCheck,
        inputType,
        jsonString,
        setErrors,
        decompressedOrderFromUrl,
      }),
    [isEnableCheck, inputType, jsonString, decompressedOrderFromUrl]
  );

  // after input changes, `handleChangeTextAreaJson` updates `jsonString`, which will trigger the following useEffect hook. This passes in chainId to Select.tsx before the user runs the main check function
  // This useEffect hook also sets `parsedJson`, which future useEffect hooks depend on
  useEffect(() => {
    if (jsonString) {
      console.log('first useEffect. jsonString detected');
      try {
        const parsedJsonObject = JSON.parse(jsonString);
        setParsedJson(parsedJsonObject);
        setChainIdFromJson(parsedJsonObject?.chainId);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    } else if (urlString) {
      console.log('first useEffect. urlString detected');
      try {
        const jsonString = JSON.stringify(decompressedOrderFromUrl);
        const parsedJsonString = JSON.parse(jsonString);
        setParsedJson(parsedJsonString);
        setChainIdFromJson(parsedJsonString?.chainId);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }, [decompressedOrderFromUrl, jsonString, urlString]);

  useEffect(() => {
    if (!isInputValid) {
      return;
    }

    if (isEnableCheck) {
      console.log('useEffect #2. isEnableCheck true, checking errors:');
      checkSmartContractError({ errorCheck, setErrors });
    }
  }, [isInputValid, isEnableCheck, errorCheck]);

  // performs actions after `handleSubmit` sets `enabledCheck` to True
  useEffect(() => {
    if (!isEnableCheck) {
      return;
    }

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
      eip712Domain,
      protocolFee,
    });

    handleFormattedListErrors({ errorsList, setErrors });

    if (!isJsonValid && errorsList && errorsList.length === 0) {
      setIsNoErrors(true);
    }
  }, [
    isEnableCheck,
    parsedJson,
    checkFunctionData,
    swapContractAddress,
    protocolFee,
    eip712Domain,
  ]);

  // programating handling of chainId
  useEffect(() => {
    const address = SwapERC20.getAddress(selectedChainId);
    if (address) {
      setSwapContractAddress(address);
    } else {
      return;
    }
  }, [selectedChainId, swapContractAddress]);

  // when JSON or URL input text changes, disable the check function
  useEffect(() => {
    setIsEnableCheck(false);
  }, [inputType, jsonString, urlString]);

  return (
    <div className="flex flex-col font-sans">
      <Header
        protocolFee={protocolFee}
        setSelectedChainId={setSelectedChainId}
        chainIdFromJson={chainIdFromJson}
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
              toggle={() => handleToggle(inputType)}
            />

            {inputType === InputType.JSON ? (
              <JsonForm
                handleSubmit={handleSubmit}
                handleChangeTextArea={handleChangeTextAreaJson}
                isEnableCheck={isEnableCheck}
                isLoading={isLoadingCheck}
              />
            ) : (
              <UrlForm
                handleSubmit={handleSubmit}
                handleChangeTextArea={handleChangeTextAreaUrl}
                isEnableCheck={isEnableCheck}
                setIsEnableCheck={setIsEnableCheck}
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
