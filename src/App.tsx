import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import { abi } from './contracts/swapERC20ABI';
import { hexToString, zeroAddress } from 'viem';
import { CheckArgs, CheckParamsJSON } from '../types';
import { validateJson } from './utilities/validations';
import { swapContractAddress } from './utilities/constants';
import airswapLogo from '../src/assets/airswap-logo-with-text.svg';
import { textareaPlaceholder } from './defaults/textareaPlaceholder';
import { displayErrors } from './utilities/displayErrors';
import { FaCheckCircle } from 'react-icons/fa';

function App() {
  const [jsonString, setJsonString] = useState<undefined | string>(undefined);
  const [parsedJSON, setParsedJSON] = useState<
    undefined | Partial<CheckParamsJSON>
  >(undefined);
  const [errors, setErrors] = useState<string[]>([]);
  const [renderedErrors, setRenderedErrors] = useState<ReactNode | undefined>();
  const [isEnableCheck, setIsEnableCheck] = useState(false);
  const [isNoErrors, setIsNoErrors] = useState(false);

  const senderWallet = parsedJSON?.senderWallet || zeroAddress;
  const nonce = isNaN(Number(parsedJSON?.nonce))
    ? BigInt(0)
    : BigInt(Number(parsedJSON?.nonce));
  const expiry = isNaN(Number(parsedJSON?.expiry))
    ? BigInt(0)
    : BigInt(Number(parsedJSON?.expiry));
  const signerWallet = parsedJSON?.signerWallet || zeroAddress;
  const signerToken = parsedJSON?.signerToken || zeroAddress;
  const signerAmount = isNaN(Number(parsedJSON?.signerAmount))
    ? BigInt(0)
    : BigInt(Number(parsedJSON?.signerAmount));
  const senderToken = parsedJSON?.senderToken || zeroAddress;
  const senderAmount = isNaN(Number(parsedJSON?.senderAmount))
    ? BigInt(0)
    : BigInt(Number(parsedJSON?.senderAmount));
  const v = Number(parsedJSON?.v) || 0;
  const r = (parsedJSON?.r as `0x${string}`) || `0x`;
  const s = (parsedJSON?.s as `0x${string}`) || `0x`;

  const checkArgs: CheckArgs = [
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
  ];

  const {
    data: returnedErrors,
    isLoading,
    error: contractReadError,
  } = useContractRead({
    address: swapContractAddress,
    abi,
    functionName: 'check',
    args: checkArgs,
    enabled: isEnableCheck,
  });

  console.log('contractReadError:', contractReadError);

  const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsEnableCheck(false);
    setJsonString(e.target.value);
  };

  const handleSubmit = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEnableCheck(true);
    setErrors([]);
    setIsNoErrors(false);

    if (!jsonString) {
      setErrors(['Input cannot be blank']);
      return;
    }

    try {
      const parsedJsonString = jsonString && JSON.parse(jsonString);
      setParsedJSON(parsedJsonString);
    } catch (e) {
      setErrors([`Your input is not valid JSON format: ${e}`]);
    }
  };

  // performs actions after parsedJSON has been updated
  useEffect(() => {
    // check that all required keys are present
    const isJsonValid = validateJson(parsedJSON);
    if (isJsonValid) {
      setErrors(isJsonValid);
    }

    // returnedErrors is data from smart contract
    const outputErrorsList = returnedErrors?.[1].map((error) => {
      return hexToString(error);
    });

    // create array of human-readable errors
    const errorsList = displayErrors(outputErrorsList);
    if (errorsList) {
      setErrors(errorsList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedJSON, returnedErrors]);

  useEffect(() => {
    const renderErrors = () => {
      return errors?.map((error, i) => (
        <li
          key={error + i}
          className="flex self-start max-w-full ml-2 mb-2 text-left"
        >
          <div className="flex self-start w-4 h-4 mr-1">
            <FaCheckCircle />
          </div>
          <span>{error}</span>
        </li>
      ));
    };
    const renderedErrors = renderErrors();

    setRenderedErrors(renderedErrors);
  }, [errors]);

  // if input is not blank, and there are no errors, JSON is okay
  useEffect(() => {
    if (parsedJSON && isEnableCheck && !errors) {
      setErrors(['🎊 No errors found! 🎊']);
      setIsNoErrors(true);
    }
  }, [parsedJSON, isEnableCheck, errors]);

  return (
    <div className="flex flex-col font-sans">
      <div className="h-fit p-4">
        <img src={airswapLogo} alt="AirSwap logo" className="mx-auto" />
      </div>
      <div
        id="container"
        className="flex flex-col box-border pb-6 sm:w-[80%] md:w-[80%] lg:[60%] mx-auto text-center bg-lightGray text-black rounded-md"
      >
        <h1 className="mt-4 text-2xl uppercase text-blueDark font-semibold">
          Server Debugger:
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:w-full md:w-3/4 lg:w-1/2 m-auto"
        >
          <label>Paste your server response JSON in the text area below:</label>
          <textarea
            id="json"
            name="json"
            placeholder={textareaPlaceholder}
            autoComplete="off"
            onChange={handleChangeTextArea}
            className="my-2 mx-auto p-5 sm:w-full sm:min-w-full w-[80%] min-w-[60%] max-w-[90%] min-h-[325px] border-blueDark border radius-sm"
          />
          <input
            name="submit"
            type="submit"
            value={!isLoading ? 'Check errors' : 'Loading...'}
            disabled={isLoading}
            className="mt-2 mx-auto sm:w-full md:w-[80%] lg:w-[60%] py-3 px-4 text-white bg-blueAirSwap border-darkgray border-1 radius-sm font-medium text-lg uppercase"
          />
        </form>

        {errors.length > 0 && !isLoading && (
          <div
            id="errors-container"
            className="sm:w-full md:w-[80%] lg:w-[80%] p-8 my-8 mx-auto text-redAlert whitespace-pre-line bg-white border-dashed border-2 border-redAlert rounded-md break-words"
          >
            {!isNoErrors ? (
              <>
                <h3 className="m-0 mb-1 text-blueExtraDark font-semibold uppercase">
                  Errors to fix:
                </h3>
                <ul className="flex flex-col items-start w-fit m-auto p-0 list-none">
                  {renderedErrors}
                </ul>
              </>
            ) : (
              <h3 className="m-0 mb-1 text-blueExtraDark font-semibold uppercase">
                🎊 No errors found! 🎊
              </h3>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
