import { MouseEvent, useEffect, useState } from 'react';
import './App.css';
import { useContractRead } from 'wagmi';
import swapERC20ABI from '../swapERC20ABI.json';
import { zeroAddress } from 'viem';

interface checkParamsJSON {
  senderWallet: `0x${string}`;
  nonce: number;
  expiry: number;
  signerWallet: `0x${string}`;
  signerToken: `0x${string}`;
  signerAmount: bigint;
  senderToken: `0x${string}`;
  senderAmount: bigint;
  v: number;
  r: string;
  s: string;
}

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
        <p>
          Your JSON must contain the following data:
          <br />
          <br />
          <em> chainId, swapContract, version, and senderWallet</em>
        </p>
        <form onClick={handleSubmit}>
          <label>Paste your JSON below:</label>
          <textarea
            id="json"
            name="json"
            placeholder="paste your JSON here..."
            autoComplete="off"
            onChange={(e) => setJsonString(e.target.value)}
          />
          <input name="submit" type="submit" value="Check for errors" />
        </form>
        {errors && <div className="errors">{errors}</div>}
      </div>
    </>
  );
}

export default App;
