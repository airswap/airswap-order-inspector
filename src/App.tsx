import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import { abi } from './contracts/swapERC20ABI';
import { hexToString, zeroAddress } from 'viem';
import { CheckArgs, CheckParamsJSON, InputType } from '../types';
import { validateJson } from './utilities/validations';
import { displayErrors } from './utilities/displayErrors';
import { twMerge } from 'tailwind-merge';
import { Errors } from './components/Errors';
import { JsonForm } from './components/forms/JsonForm';
import { Header } from './components/Header';
import { UrlForm } from './components/forms/UrlForm';
import { Toggle } from './components/Toggle';
import { SwapERC20 } from '@airswap/libraries';
import { useDecompressedOrderFromUrl } from './hooks/useDecompressedOrderFromUrl';
// import { DecodedJson } from './components/DecodedJson';

function App() {
  const [inputType, setInputType] = useState<InputType>(InputType.JSON);
  const [jsonString, setJsonString] = useState<undefined | string>(undefined);
  const [urlString, setUrlString] = useState<string | undefined>(undefined);
  const [parsedJSON, setParsedJSON] = useState<
    undefined | Partial<CheckParamsJSON>
  >(undefined);
  const [swapContractAddress, setSwapContractAddress] = useState<
    string | undefined
  >(undefined);
  const [errors, setErrors] = useState<string[]>([]);
  const [renderedErrors, setRenderedErrors] = useState<ReactNode | undefined>();
  const [isEnableCheck, setIsEnableCheck] = useState(false);
  const [isNoErrors, setIsNoErrors] = useState(false);

  const decompressedOrderFromUrl = useDecompressedOrderFromUrl(urlString);

  const chainId = Number(parsedJSON?.chainId) || 1;

  let senderWallet;
  let nonce;
  let expiry;
  let signerWallet;
  let signerToken;
  let signerAmount;
  let senderToken;
  let senderAmount;
  let v;
  let r;
  let s;

  const setJsonValues = () => {
    let json;
    inputType === InputType.JSON
      ? (json = parsedJSON)
      : (json = decompressedOrderFromUrl);

    senderWallet = json?.senderWallet;
    nonce = isNaN(Number(json?.nonce))
      ? BigInt(0)
      : BigInt(Number(json?.nonce));
    expiry = isNaN(Number(json?.expiry))
      ? BigInt(0)
      : BigInt(Number(json?.expiry));
    signerWallet = json?.signerWallet;
    signerToken = json?.signerToken;
    signerAmount = isNaN(Number(json?.signerAmount))
      ? BigInt(0)
      : BigInt(Number(json?.signerAmount));
    senderToken = json?.senderToken;
    senderAmount = isNaN(Number(json?.senderAmount))
      ? BigInt(0)
      : BigInt(Number(json?.senderAmount));
    v = Number(json?.v);
    r = json?.r as `0x${string}`;
    s = json?.s as `0x${string}`;
  };
  setJsonValues();

  const checkArgs: CheckArgs = [
    (senderWallet && senderWallet) || zeroAddress,
    nonce || BigInt(0),
    expiry || BigInt(0),
    signerWallet || zeroAddress,
    signerToken || zeroAddress,
    signerAmount || BigInt(0),
    senderToken || zeroAddress,
    senderAmount || BigInt(0),
    v || 0,
    r || '0x',
    s || '0x',
  ];

  const {
    data: checkFunctionData,
    isLoading,
    // error: contractReadError,
  } = useContractRead({
    chainId,
    address: swapContractAddress as `0x${string}`,
    abi,
    functionName: 'check',
    args: checkArgs,
    enabled: isEnableCheck,
  });

  const { data: protocolFeeData, isLoading: isLoadingProtocolFee } =
    useContractRead({
      chainId,
      address: swapContractAddress as `0x${string}`,
      abi,
      functionName: 'protocolFee',
    });

  console.log(protocolFeeData);

  const handleChangeTextAreaJson = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsEnableCheck(false);
    setJsonString(e.target.value);
  };

  const handleChangeTextAreaUrl = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsEnableCheck(false);
    setUrlString(e.target.value);
  };

  const handleSubmit = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEnableCheck(true);
    setErrors([]);
    setIsNoErrors(false);

    if (inputType === InputType.JSON && !jsonString) {
      setErrors(['Input cannot be blank']);
      return;
    }
    if (inputType === InputType.URL && !decompressedOrderFromUrl) {
      setErrors([
        'Something is wrong with your URL. Try copy pasting it again',
      ]);
      return;
    }

    try {
      if (inputType === InputType.URL) {
        const jsonString = JSON.stringify(decompressedOrderFromUrl);
        const parsedJsonString = JSON.parse(jsonString);
        setParsedJSON(parsedJsonString);
      } else {
        const parsedJsonObject = jsonString && JSON.parse(jsonString);
        setParsedJSON(parsedJsonObject);
      }
    } catch (e) {
      console.error(e);
      setErrors([`Your input is not valid JSON format: ${e}`]);
    }
  };

  // performs actions after parsedJSON has been updated
  useEffect(() => {
    const isJsonValid = validateJson({
      json: parsedJSON,
      swapContractAddress: swapContractAddress,
    });

    if (isJsonValid) {
      setErrors((prevErrors) => {
        const updatedErrors = [...prevErrors, ...isJsonValid];
        const uniqueErrors = [...new Set(updatedErrors)];
        return uniqueErrors;
      });
    }

    const outputErrorsList = checkFunctionData?.[1].map((error) => {
      return hexToString(error);
    });
    // create array of human-readable errors
    const errorsList = displayErrors(outputErrorsList);

    if (errorsList && errorsList.length > 0) {
      setErrors((prevErrors) => {
        const updatedErrors = [...prevErrors, ...errorsList];
        const uniqueErrors = [...new Set(updatedErrors)];
        return uniqueErrors;
      });
    }

    if (!isJsonValid && errorsList && errorsList.length === 0) {
      setIsNoErrors(true);
    }
  }, [parsedJSON, checkFunctionData, swapContractAddress]);

  useEffect(() => {
    if (chainId) {
      const address = SwapERC20.getAddress(chainId);
      address && setSwapContractAddress(address);
    }
    if (parsedJSON) console.log(parsedJSON);
  }, [chainId, swapContractAddress, parsedJSON]);

  useEffect(() => {
    const renderErrors = () => {
      return errors?.map((error, i) => (
        <li
          key={error + i}
          className="flex max-w-full ml-2 mb-2 text-left last:mb-0"
        >
          <input type="checkbox" className="flex self-start w-4 mr-2 mt-1.5" />
          <span className="flex">{error}</span>
        </li>
      ));
    };
    const renderedErrors = renderErrors();

    setRenderedErrors(renderedErrors);
  }, [errors]);

  return (
    <div className="flex flex-col font-sans">
      <Header
        protocolFee={protocolFeeData}
        isLoadingProtocolFee={isLoadingProtocolFee}
      />
      <div
        id="container"
        className={twMerge(
          'flex flex-col md:flex-row box-border px-1 mx-auto',
          'w-full xs:w-[90%] sm:w-4/5 md:w-[95%] lg:w-[90%] xl:w-4/5',
          'text-center bg-transparent text-lightGray rounded-md'
        )}
      >
        <div
          className={twMerge(
            'md:w-full lg:w-1/2 md:pt-4 md:pb-8 md:mr-2 bg-blueDark rounded-md pb-6 px-1',
            'border border-blueGray shadow-sm shadow-grayDark'
          )}
        >
          <Toggle
            inputType={inputType}
            clickTypeJson={() => {
              setInputType(InputType.JSON);
              setIsNoErrors(false);
              setErrors([]);
            }}
            clickTypeUrl={() => {
              setInputType(InputType.URL);
              setIsNoErrors(false);
              setErrors([]);
            }}
          />

          {inputType === InputType.JSON ? (
            <JsonForm
              handleSubmit={handleSubmit}
              handleChangeTextArea={handleChangeTextAreaJson}
              isEnableCheck={isEnableCheck}
              isLoading={isLoading}
            />
          ) : (
            <UrlForm
              handleSubmit={handleSubmit}
              handleChangeTextArea={handleChangeTextAreaUrl}
              isEnableCheck={isEnableCheck}
              isLoading={isLoading}
            />
          )}
        </div>
        <div
          className={twMerge(
            'md:w-full md:pt-4 md:ml-2 md:mt-0',
            'lg:w-1/2 mt-4 pt-4 pb-8 px-1 bg-blueDark text-lightGray',
            'border border-blueGray rounded-md shadow-sm shadow-grayDark'
          )}
        >
          {/* {inputType === InputType.URL && (
            <DecodedJson decodedJson={parsedJSON} />
          )} */}
          <Errors
            isLoading={isLoading}
            errors={errors}
            isNoErrors={isNoErrors}
            renderedErrors={renderedErrors}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
