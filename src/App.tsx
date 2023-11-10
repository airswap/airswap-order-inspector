import { MouseEvent, useEffect, useState } from 'react';
import './App.css';
import { useContractRead } from 'wagmi';
import swapERC20ABI from '../swapERC20ABI.json';
import { zeroAddress } from 'viem';
import { checkParamsJSON } from '../types';

function App() {
  const [jsonString, setJsonString] = useState<undefined | string>();
  const [parsedJSON, setParsedJSON] = useState<undefined | checkParamsJSON>();
  const [errors, setErrors] = useState<undefined | string>();

  const swapContractAddress = '0x0C9b31Dc37718417608CE22bb1ba940f702BF90B';

  const { isError, error } = useContractRead({
    address: swapContractAddress,
    abi: swapERC20ABI,
    functionName: 'check',
    args: [
      parsedJSON?.senderWallet || zeroAddress,
      Number(parsedJSON?.nonce) || 0,
      Number(parsedJSON?.expiry) || 0,
      parsedJSON?.signerWallet || zeroAddress,
      parsedJSON?.signerToken || zeroAddress,
      // FIXME: program should not crash if signerAmount isn't a valid number
      (parsedJSON?.signerAmount && BigInt(parsedJSON?.signerAmount)) ||
        BigInt(0),
      parsedJSON?.senderToken || zeroAddress,
      (parsedJSON?.senderAmount && BigInt(parsedJSON?.senderAmount)) ||
        BigInt(0),
      Number(parsedJSON?.v) || 0,
      parsedJSON?.r || '0x',
      parsedJSON?.s || '0x',
    ],
    enabled: !!jsonString,
  });

  console.log('errors:', errors);

  const handleSubmit = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (jsonString) {
      const parsedJson = JSON.parse(jsonString);
      setParsedJSON(parsedJson);
    }
  };

  const textAreaPlaceholder = `Paste your JSON object here with the following format:

  {
    "nonce": "99",
    "expiry": "1566941284",
    "signerWallet": "0x73BCEb1Cd57C711feaC4224D062b0F6ff338501f",
    "signerToken": "0xdac17f958d2ee523a2206206994597c13d831ec7",
    "signerAmount": "100000000",
    "senderToken": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "senderAmount": "1000000000000000000",
    "v": "28",
    "r": "0x67e0723b0afd357d4f28523bf633dfee16e0eab2f3cbcf8ce1afd32a035d2764",
    "s": "0x1b71e6e633b3334fc88faf4ec0ca1b7611883bc0de4df7024abec07af78b97c3"
}`;

  useEffect(() => {
    if (isError) {
      error && setErrors(error.message);
    } else {
      setErrors(undefined);
    }
  }, [isError, error]);

  return (
    <>
      <h1>AirSwap Debugger:</h1>
      <div className="textarea-container">
        <form onClick={handleSubmit}>
          <label>Paste your JSON in the text area below:</label>
          <textarea
            id="json"
            name="json"
            placeholder={textAreaPlaceholder}
            autoComplete="off"
            onChange={(e) => setJsonString(e.target.value)}
          />
          <input name="submit" type="submit" value="Check for errors" />
        </form>
        {/* TODO: error handling needs to be more more robus and give clear feedback */}
        {errors && <div className="errors">{errors}</div>}
      </div>
    </>
  );
}

export default App;
