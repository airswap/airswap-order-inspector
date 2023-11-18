import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import './App.css';
import { useContractRead } from 'wagmi';
import { abi } from './contracts/swapERC20ABI';
import { hexToString, zeroAddress } from 'viem';
import { CheckArgs, CheckParamsJSON } from '../types';
import { validateJsonShape } from './utilities/validations';
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
  const [errors, setErrors] = useState<
    boolean | string | (string | undefined)[]
  >(false);
  const [isError, setIsError] = useState(false);
  const [isEnableCheck, setIsEnableCheck] = useState(false);

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

  const { data: returnedErrors, isLoading } = useContractRead({
    address: swapContractAddress,
    abi,
    functionName: 'check',
    args: checkArgs,
    enabled: isEnableCheck,
  });

  const outputErrorsList = returnedErrors?.[1].map((error) => {
    return hexToString(error);
  });

  const errorsList = displayErrors(outputErrorsList);

  const readableErrors = errorsList?.map((error) => (
    <li key={error}>
      <div className="icon-styles">
        <FaCheckCircle />
      </div>
      <span>{error}</span>
    </li>
  ));

  const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsEnableCheck(false);
    setJsonString(e.target.value);
  };

  const handleSubmit = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsError(false);

    if (!jsonString) {
      setIsError(true);
      setErrors('Input cannot be blank');
      return;
    }

    try {
      const parsedJsonString = jsonString && JSON.parse(jsonString);
      setParsedJSON(parsedJsonString);
    } catch (e) {
      setErrors(`Your input is not valid JSON format:\n\n${e}`);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (parsedJSON) {
      const isValidJsonShape = validateJsonShape(parsedJSON);

      if (isValidJsonShape) {
        setIsEnableCheck(false);
        setErrors(isValidJsonShape);
        setIsError(true);
      } else {
        // run check function on smart contract
        setIsEnableCheck(true);
      }
    }
  }, [parsedJSON]);

  useEffect(() => {
    if (errorsList && errorsList.length !== 0) {
      setIsError(true);
      setErrors(errorsList);
    } else if (!errorsList?.length && isEnableCheck) {
      setIsError(false);
      setErrors('No errors found! 🎊');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorsList?.length, isEnableCheck]);

  return (
    <>
      <div className="header">
        <img src={airswapLogo} alt="AirSwap logo" />
      </div>
      <div className="container">
        <h1>Server Debugger:</h1>
        <form onSubmit={handleSubmit}>
          <label>Paste your server response JSON in the text area below:</label>
          <textarea
            id="json"
            name="json"
            placeholder={textareaPlaceholder}
            autoComplete="off"
            onChange={handleChangeTextArea}
          />
          <input
            name="submit"
            type="submit"
            value={!isLoading ? 'Check errors' : 'Loading...'}
          />
        </form>

        {errors && !isLoading && (
          <div
            className="errors-container"
            style={{ color: !isError ? 'blue' : 'red' }}
          >
            {errorsList ? (
              <>
                <h3>
                  Your JSON has the following error
                  {errorsList.length > 1 ? 's' : null}:
                </h3>
                <ul>{readableErrors}</ul>
              </>
            ) : null}
            {typeof errors === 'string' ? errors : null}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
