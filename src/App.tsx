import React, { useState } from 'react';
import './App.css';
import { useContractRead } from 'wagmi';
import swapAbi from '../swapAbi.json';
import { zeroAddress } from 'viem';

interface checkParamsJSON {
  nonce: string;
  expiry: string;
  signerWallet: string;
  signerToken: string;
  signerAmount: string;
  senderToken: string;
  senderAmount: string;
  v: string;
  r: string;
  s: string;
}

function App() {
  const [jsonString, setJsonString] = useState<undefined | string>();
  const [parsedJSON, setParsedJSON] = useState<undefined | checkParamsJSON>();

  const swapContractAddress = '0xb926D88D6BdD560383fCd6537bbf5Aa863470318';

  const order = {
    nonce: parsedJSON?.nonce || '',
    expiry: parsedJSON?.expiry || '',
    signerWallet: parsedJSON?.signerWallet || '',
    signerToken: parsedJSON?.signerToken || '',
    signerAmount: parsedJSON?.signerAmount || '',
    senderToken: parsedJSON?.senderToken || '',
    senderAmount: parsedJSON?.senderAmount || '',
    v: parsedJSON?.v || '',
    r: parsedJSON?.r || '',
    s: parsedJSON?.s || '',
  };

  const { data, isError } = useContractRead({
    address: swapContractAddress,
    abi: swapAbi,
    functionName: 'check',
    args: [parsedJSON?.signerWallet || zeroAddress, order],
    enabled: !!jsonString,
  });

  console.log(data, isError);

  React.useEffect(() => {
    if (jsonString) {
      const parsedJson = JSON.parse(jsonString);
      setParsedJSON(parsedJson);
    }
  }, [jsonString]);

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
        <button>Check for errors</button>
      </div>
    </>
  );
}

export default App;
