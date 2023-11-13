import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import './App.css';
import { useContractRead } from 'wagmi';
import swapERC20ABI from '../swapERC20ABI.json';
import { zeroAddress } from 'viem';
import { checkParamsJSON } from '../types';
import { validateJsonShape } from './helpers/validations';
import { swapContractAddress, textAreaPlaceholder } from './helpers/constants';
import airswapLogo from '../src/assets/airswap-logo-with-text.svg';

function App() {
  const [jsonString, setJsonString] = useState<undefined | string>(undefined);
  const [parsedJSON, setParsedJSON] = useState<
    undefined | Partial<checkParamsJSON>
  >(undefined);
  const [errors, setErrors] = useState<boolean | string | Error>(false);
  const [isError, setIsError] = useState(false);
  const [isEnableCheck, setIsEnableCheck] = useState(false);

  const { error: checkFunctionError } = useContractRead({
    address: swapContractAddress,
    abi: swapERC20ABI,
    functionName: 'check',
    args: [
      parsedJSON?.senderWallet || zeroAddress,
      Number(parsedJSON?.nonce) || 0,
      Number(parsedJSON?.expiry) || 0,
      parsedJSON?.signerWallet || zeroAddress,
      parsedJSON?.signerToken || zeroAddress,
      (parsedJSON?.signerAmount && BigInt(parsedJSON?.signerAmount)) ||
        BigInt(0),
      parsedJSON?.senderToken || zeroAddress,
      (parsedJSON?.senderAmount && BigInt(parsedJSON?.senderAmount)) ||
        BigInt(0),
      Number(parsedJSON?.v) || 0,
      parsedJSON?.r || '0x',
      parsedJSON?.s || '0x',
    ],
    enabled: isEnableCheck,
  });

  const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsEnableCheck(false);
    setJsonString(e.target.value);
  };

  const handleSubmit = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!jsonString) {
      setIsError(true);
      setErrors('Please enter valid JSON');
    }

    try {
      const parsedJsonString = jsonString && JSON.parse(jsonString);
      setParsedJSON(parsedJsonString);
    } catch (e) {
      setErrors(`Your input is not valid JSON format:\n\n${e}`);
      setIsError(true);
      return;
    }
  };

  useEffect(() => {
    if (parsedJSON) {
      const isValidJsonShape = validateJsonShape(parsedJSON);

      if (isValidJsonShape) {
        setIsEnableCheck(false);
        setErrors(isValidJsonShape);
        setIsError(true);
        return;
      } else {
        // run check function on smart contract
        setIsEnableCheck(true);
      }
    }
  }, [parsedJSON]);

  useEffect(() => {
    if (checkFunctionError && isEnableCheck) {
      setIsError(true);
      setErrors(checkFunctionError.message);
    } else if (!checkFunctionError && isEnableCheck) {
      setIsError(false);
      setErrors('No errors found! 🎊');
    }
  }, [checkFunctionError, isEnableCheck]);

  return (
    <>
      <div className="image-container">
        <img src={airswapLogo} alt="AirSwap logo" style={{ height: '3rem' }} />
      </div>
      <div className="container">
        <h1>Server Debugger:</h1>
        <div className="textarea-container">
          <form onSubmit={handleSubmit}>
            <label>Paste your JSON in the text area below:</label>
            <textarea
              id="json"
              name="json"
              placeholder={textAreaPlaceholder}
              autoComplete="off"
              onChange={handleChangeTextArea}
            />
            <input name="submit" type="submit" value="Check for errors" />
          </form>

          {errors && (
            <div
              className="errors-container"
              style={{ color: !isError ? 'blue' : 'red' }}
            >
              {typeof errors === 'string' ? errors : null}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
