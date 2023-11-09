import React, { useState } from 'react';
import './App.css';

function App() {
  const [json, setJson] = useState<undefined | string>();
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
          onChange={(e) => setJson(e.target.value)}
        />
        <button>debug</button>
      </div>
    </>
  );
}

export default App;
