import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import './App.css';
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

  const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsEnableCheck(false);
    setErrors([]);
    setJsonString(e.target.value);
  };

  const handleSubmit = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setIsEnableCheck(true);

    // if input is blank, return
    if (!jsonString) {
      setErrors(['Input cannot be blank']);
      return;
    }

    try {
      // 1. check if JSON is a valid JSON
      const parsedJsonString = jsonString && JSON.parse(jsonString);
      setParsedJSON(parsedJsonString);

      // 2. check that all required keys are present
      const isJsonValid = validateJson(parsedJSON);

      // 3. if validation errors, set, otherwise set errors to undefined
      isJsonValid
        ? setErrors((errors) => [...errors, ...isJsonValid])
        : setErrors([]);

      // 4. check returnedErrors from smart contract
      const outputErrorsList = returnedErrors?.[1].map((error) => {
        return hexToString(error);
      });

      // create an array with human-readable errors
      const errorsList = displayErrors(outputErrorsList);
      console.log('errorsList:', errorsList);

      // add human-readable errors into errors array
      if (errorsList) {
        setErrors((errors) => [...errors, ...errorsList]);
      }
    } catch (e) {
      setErrors([`Your input is not valid JSON format: ${e}`]);
    }
  };

  const renderErrors = () => {
    return errors?.map((error) => (
      <li key={error}>
        <div className="icon-styles">
          <FaCheckCircle />
        </div>
        <span>{error}</span>
      </li>
    ));
  };

  useEffect(() => {
    if (returnedErrors) {
      const outputErrorsList = returnedErrors[1].map((error) =>
        hexToString(error)
      );
      const errorsList = displayErrors(outputErrorsList);
      setErrors((prevErrors) => [...prevErrors, ...(errorsList || [])]);
    }
  }, [returnedErrors]);

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

        {errors.length > 0 && !isLoading && (
          <div className="errors-container">
            <h3>
              Please fix the following error
              {errors.length > 1 ? 's' : null}:
            </h3>
            <ul>{renderErrors()}</ul>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
