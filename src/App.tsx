import { ChangeEvent, MouseEvent, useState } from 'react';
import './App.css';
import { useContractRead } from 'wagmi';
import swapERC20ABI from '../swapERC20ABI.json';
import { zeroAddress } from 'viem';
import { checkParamsJSON } from '../types';
import { validateJsonShape } from './helpers/validateJsonShape';
import { swapContractAddress, textAreaPlaceholder } from './helpers/constants';

function App() {
  const [jsonString, setJsonString] = useState<undefined | string>(undefined);
  const [parsedJSON, setParsedJSON] = useState<
    undefined | Partial<checkParamsJSON>
  >(undefined);
  const [errors, setErrors] = useState<boolean | string>(false);
  const [isError, setIsError] = useState(false);

  // const { error } = useContractRead({
  //   address: swapContractAddress,
  //   abi: swapERC20ABI,
  //   functionName: 'check',
  //   args: [
  //     parsedJSON?.senderWallet || zeroAddress,
  //     Number(parsedJSON?.nonce) || 0,
  //     Number(parsedJSON?.expiry) || 0,
  //     parsedJSON?.signerWallet || zeroAddress,
  //     parsedJSON?.signerToken || zeroAddress,
  //     (parsedJSON?.signerAmount && BigInt(parsedJSON?.signerAmount)) ||
  //       BigInt(0),
  //     parsedJSON?.senderToken || zeroAddress,
  //     (parsedJSON?.senderAmount && BigInt(parsedJSON?.senderAmount)) ||
  //       BigInt(0),
  //     Number(parsedJSON?.v) || 0,
  //     parsedJSON?.r || '0x',
  //     parsedJSON?.s || '0x',
  //   ],
  //   // enabled: false,
  //   enabled: isCheckErrors,
  // });

  const handleSubmit = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const parsedJsonString = jsonString && JSON.parse(jsonString);
      setParsedJSON(parsedJsonString);
    } catch (e) {
      console.error(e);
      console.log('console.log e:', e);
      setErrors(`Your input is not valid JSON format:\n\n${e}`);
      setIsError(true);
      return;
    }

    if (parsedJSON) {
      const isValidJsonShape = validateJsonShape(parsedJSON);
      if (!isValidJsonShape) {
        setErrors(isValidJsonShape);
        setIsError(true);
      } else {
        setErrors('Looks good! No errors! 🎊');
        setIsError(false);
      }
    }
  };

  const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(e.target.value);
  };

  return (
    <>
      <h1>AirSwap Debugger:</h1>
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
            className="errors"
            style={{
              color: !isError ? 'blue' : 'red',
              fontWeight: 'bold',
              border: !isError ? 'none' : 'solid gray 1px',
            }}
          >
            {errors}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
