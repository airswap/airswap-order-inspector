import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import { abi } from './contracts/swapERC20ABI';
import { hexToString, zeroAddress } from 'viem';
import { CheckArgs, CheckParamsJSON } from '../types';
import { validateJson } from './utilities/validations';
import { swapContractAddress } from './utilities/constants';
import airswapLogo from '../src/assets/airswap-logo.svg';
import { textareaPlaceholder } from './defaults/textareaPlaceholder';
import { displayErrors } from './utilities/displayErrors';
import { twMerge } from 'tailwind-merge';

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
        <li key={error + i} className="flex max-w-full ml-2 mb-2 text-left">
          <input type="checkbox" className="flex self-start w-4 mr-2 mt-1.5" />
          <span className="flex">{error}</span>
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
      <div
        className={twMerge(
          'flex flex-row my-4 mx-auto p-2 text-2xl xs:text-3xl uppercase text-lightGray font-medium'
        )}
      >
        <img src={airswapLogo} alt="AirSwap logo" className="mr-3" />
        <h1>Server Debugger</h1>
      </div>
      <div
        id="container"
        className={twMerge(
          'flex flex-col md:flex-row box-border pb-6 px-1 mx-auto',
          'w-full xs:w-[90%] sm:w-4/5 md:w-[95%] lg:w-[90%] xl:w-4/5',
          'text-center bg-transparent text-black rounded-md'
        )}
      >
        <div className="md:w-full md:pt-4 md:pb-8 md:mr-2 bg-lightGray rounded-sm pb-6 px-1">
          <form onSubmit={handleSubmit} className="flex flex-col m-auto w-full">
            <label className="my-2 text-lg font-semibold uppercase">
              Paste server response below:
            </label>
            <textarea
              id="json"
              name="json"
              placeholder={textareaPlaceholder}
              autoComplete="off"
              onChange={handleChangeTextArea}
              className={twMerge(
                'w-full xs:w-[90%] sm:w-4/5 md:w-4/5',
                'my-2 mx-auto p-5 min-h-[325px] border-blueDark border-2 rounded-sm'
              )}
            />
            <input
              name="submit"
              type="submit"
              value={!isLoading ? 'Check errors' : 'Loading...'}
              disabled={isLoading}
              className={twMerge(
                'w-full xs:w-[90%] sm:w-4/5 md:w-4/5',
                'mt-2 mx-auto py-3 px-4 text-white bg-blueAirSwap border-darkgray border-1 rounded-sm font-medium text-lg uppercase'
              )}
            />
          </form>
        </div>

        <div
          className={twMerge(
            'md:w-full md:pt-4 md:ml-2 md:mt-0',
            'mt-4 pt-4 pb-8 px-1 bg-lightGray rounded-sm'
          )}
        >
          {!isLoading && (
            <>
              <h3 className="mt-2 mb-4 px-2 text-lg text-redAlert font-semibold uppercase">
                Errors to fix:
              </h3>
              <div
                id="errors-container"
                className={twMerge(
                  'w-full xs:w-[90%] sm:w-4/5 ',
                  'mt-2 mx-auto p-5 min-h-[325px] border-dashed border-2 border-redAlert rounded-sm text-redAlert'
                )}
              >
                {!isNoErrors ? (
                  <ul className="flex flex-col items-start w-fit m-auto p-0 list-none">
                    {renderedErrors}
                  </ul>
                ) : (
                  <h3 className="m-0 mb-1 text-blueExtraDark font-semibold uppercase">
                    🎊 No errors found! 🎊
                  </h3>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
