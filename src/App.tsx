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
import { Header } from './components/Heaader';
import { UrlForm } from './components/forms/UrlForm';
import { Toggle } from './components/Toggle';
import { SwapERC20 } from '@airswap/libraries';
import { FullOrderERC20 } from '@airswap/types';
import { useDecompressedOrderFromUrl } from './hooks/useDecompressedOrderFromUrl';

function App() {
  const [inputType, setInputType] = useState<InputType>(InputType.JSON);
  const [jsonString, setJsonString] = useState<undefined | string>(undefined);
  const [urlString, setUrlString] = useState<string | undefined>(undefined);
  const [decompressedOrderJsonFromUrl, setDecompressedOrderJsonFromUrl] =
    useState<FullOrderERC20 | undefined>(undefined);
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

  const senderWallet = parsedJSON?.senderWallet;
  const nonce = isNaN(Number(parsedJSON?.nonce))
    ? BigInt(0)
    : BigInt(Number(parsedJSON?.nonce));
  const expiry = isNaN(Number(parsedJSON?.expiry))
    ? BigInt(0)
    : BigInt(Number(parsedJSON?.expiry));
  const signerWallet = parsedJSON?.signerWallet;
  const signerToken = parsedJSON?.signerToken;
  const signerAmount = isNaN(Number(parsedJSON?.signerAmount))
    ? BigInt(0)
    : BigInt(Number(parsedJSON?.signerAmount));
  const senderToken = parsedJSON?.senderToken;
  const senderAmount = isNaN(Number(parsedJSON?.senderAmount))
    ? BigInt(0)
    : BigInt(Number(parsedJSON?.senderAmount));
  const v = Number(parsedJSON?.v) || 0;
  const r = (parsedJSON?.r as `0x${string}`) || `0x`;
  const s = (parsedJSON?.s as `0x${string}`) || `0x`;

  const checkArgs: CheckArgs = [
    senderWallet || zeroAddress,
    nonce,
    expiry,
    signerWallet || zeroAddress,
    signerToken || zeroAddress,
    signerAmount,
    senderToken || zeroAddress,
    senderAmount,
    v,
    r,
    s,
  ];

  const {
    data: checkFunctionData,
    isLoading,
    error: contractReadError,
  } = useContractRead({
    chainId: chainId,
    address: swapContractAddress as `0x${string}`,
    abi,
    functionName: 'check',
    args: checkArgs,
    enabled: isEnableCheck,
  });

  const handleChangeTextAreaJson = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUrlString(undefined);
    setIsEnableCheck(false);
    setJsonString(e.target.value);
  };

  const handleChangeTextAreaUrl = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(undefined);
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
    } else if (inputType === InputType.URL && !decompressedOrderFromUrl) {
      setErrors(['Input cannot be blank']);
      return;
    }

    if (inputType === InputType.URL) {
      setDecompressedOrderJsonFromUrl(decompressedOrderFromUrl);
      const decompressedOrderString = JSON.stringify(
        decompressedOrderJsonFromUrl
      );
      const parsedDecompressedOrderString = JSON.parse(decompressedOrderString);
      console.log(
        'parsedDecompressedOrderString',
        parsedDecompressedOrderString
      );
      setParsedJSON(parsedDecompressedOrderString);
      console.log('parsedJSON', parsedJSON);
    }
    try {
      if (inputType === InputType.URL) {
        setDecompressedOrderJsonFromUrl(decompressedOrderFromUrl);
        const jsonString = JSON.stringify(decompressedOrderJsonFromUrl);
        const parsedJsonString = JSON.parse(jsonString);
        setParsedJSON(parsedJsonString);
        console.log('parsedJSON', parsedJSON);
      } else {
        const parsedJsonString = jsonString && JSON.parse(jsonString);
        setParsedJSON(parsedJsonString);
      }
    } catch (e) {
      setErrors([`Your input is not valid JSON format: ${e}`]);
    }
  };

  // performs actions after parsedJSON has been updated
  useEffect(() => {
    const outputErrorsList = checkFunctionData?.[1].map((error) => {
      return hexToString(error);
    });
    console.log(outputErrorsList);

    // create array of human-readable errors
    const errorsList = displayErrors(outputErrorsList);

    console.log('errorsList', errorsList);

    if (errorsList) {
      setErrors((prevErrors) => {
        const updatedErrors = [...prevErrors, ...errorsList];
        const uniqueErrors = [...new Set(updatedErrors)];
        return uniqueErrors;
      });
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedJSON, checkFunctionData]);

  useEffect(() => {
    if (chainId) {
      const address = SwapERC20.getAddress(chainId);
      address && setSwapContractAddress(address);
      console.log('swapContractAddress', swapContractAddress);
    }
  }, [chainId, swapContractAddress]);

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

  // if input is not blank, and no errors, JSON is okay
  useEffect(() => {
    if (parsedJSON && isEnableCheck && !errors) {
      setErrors(['🎊 No errors found! 🎊']);
      setIsNoErrors(true);
    }
  }, [parsedJSON, isEnableCheck, errors]);

  return (
    <div className="flex flex-col font-sans">
      <Header />
      <div
        id="container"
        className={twMerge(
          'flex flex-col md:flex-row box-border pb-6 px-1 mx-auto',
          'w-full xs:w-[90%] sm:w-4/5 md:w-[95%] lg:w-[90%] xl:w-4/5',
          'text-center bg-transparent text-black rounded-md'
        )}
      >
        <div className="md:w-full md:pt-4 md:pb-8 md:mr-2 bg-lightGray rounded-sm pb-6 px-1">
          <Toggle
            inputType={inputType}
            clickTypeJson={() => {
              setInputType(InputType.JSON);
              setErrors([]);
            }}
            clickTypeUrl={() => {
              setInputType(InputType.URL);
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

        <Errors
          isLoading={isLoading}
          isNoErrors={isNoErrors}
          renderedErrors={renderedErrors}
        />
      </div>
    </div>
  );
}

export default App;
