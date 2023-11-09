import { useState } from 'react';
import './App.css';
import { useContractRead } from 'wagmi';
import swapAbi from '../swapAbi.json';
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
  v: string;
  r: string;
  s: string;
}

function App() {
  const [jsonString, setJsonString] = useState<undefined | string>();
  const [parsedJSON, setParsedJSON] = useState<undefined | checkParamsJSON>();

  const swapContractAddress = '0xb926D88D6BdD560383fCd6537bbf5Aa863470318';

  const order = {
    senderWallet: parsedJSON?.senderWallet || zeroAddress,
    nonce: Number(parsedJSON?.nonce) || 0,
    expiry: Number(parsedJSON?.expiry) || 0,
    signerWallet: parsedJSON?.signerWallet || zeroAddress,
    signerToken: parsedJSON?.signerToken || zeroAddress,
    signerAmount: BigInt(Number(parsedJSON?.signerAmount)) || BigInt(0),
    senderToken: parsedJSON?.senderToken || zeroAddress,
    senderAmount: BigInt(Number(parsedJSON?.senderAmount)) || BigInt(0),
    v: parsedJSON?.v || '0',
    r: parsedJSON?.r || '0x',
    s: parsedJSON?.s || '0x',
  };

  const { data, isError, error } = useContractRead({
    address: swapContractAddress,
    abi: swapAbi,
    functionName: 'check',
    args: [parsedJSON?.senderWallet || zeroAddress, order],
    enabled: !!jsonString,
  });

  console.log('errors:', error);

  const handleCheckForErrors = () => {
    console.log('submit');
    // if object is shaped correctly, then enable useContractRead:
    if (jsonString) {
      const parsedJson = JSON.parse(jsonString);
      setParsedJSON(parsedJson);
      console.log(parsedJSON);
    }
  };

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

        <label>Paste your JSON below:</label>
        <textarea
          id="json"
          name="json"
          placeholder="paste your JSON here..."
          autoComplete="off"
          onChange={(e) => setJsonString(e.target.value)}
        />
        <button onClick={handleCheckForErrors}>Check for errors</button>
      </div>
    </>
  );
}

export default App;
