import { Button } from './features/ui/button';
import React, { useState } from 'react';
import { cn } from './lib/utils';
import { useValidateOrder } from './hooks/useValidateOrder';
import { Header } from './features/ui/header';
import { Select } from './features/ui/select';
import { useChainStore } from './store/store';
import { useDomainInfo } from './hooks/useDomainInfo';
import { truncateAddress } from './utils/truncateAddress';

function App() {
  const [urlMode, setUrlMode] = useState<boolean>(false);
  const [orderText, setOrderText] = useState<string>('');

  const { selectedChainId, setSelectedChainId } = useChainStore();

  const { eip712Domain, protocolFee } = useDomainInfo(selectedChainId);

  const {
    orderErrors,
    contractCallError,
    orderParsingError,
    schemaValidationError,
  } = useValidateOrder({
    order: orderText,
    isUrl: urlMode,
    onSetChain: (newId) => {
      if (selectedChainId !== newId) setSelectedChainId(newId);
    },
  });

  let swapContract: string | undefined;
  let domainName: string | undefined;
  let domainVersion: string | undefined;
  let protocolFeeFormatted: number | undefined;

  if (eip712Domain?.status === 'success') {
    swapContract = truncateAddress(eip712Domain.result[4]);
    domainName = eip712Domain.result[1];
    domainVersion = eip712Domain.result[2];
  }
  if (protocolFee?.status === 'success') {
    protocolFeeFormatted = Number(protocolFee.result);
  }

  return (
    <React.Fragment>
      <Header />
      <main className="container flex w-[849px] h-fit flex-col gap-4 border">
        <h1 className="text-xl">Inspect an order</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setUrlMode(false)}
            className={cn({
              underline: !urlMode,
            })}
          >
            text mode
          </button>
          <button
            onClick={() => setUrlMode(true)}
            className={cn({
              underline: urlMode,
            })}
          >
            URL mode
          </button>
        </div>

        {urlMode ? (
          <div>
            <input type="text" placeholder="Enter URL" className="w-full" />
            <Button>Check</Button>
          </div>
        ) : (
          <div className="flex flex-row">
            <textarea
              value={orderText}
              onChange={(e) => setOrderText(e.target.value)}
              placeholder="JSON or URL"
              className="w-full h-12 top-[287px] bg-transparent border p-2"
              rows={10}
            />
            <Button>Check</Button>
          </div>
        )}
        <div className="flex flex-row py-4">
          <div className="w-1/2 h-full pr-6 border-r">
            <h2 className="text-xl font-bold">Domain</h2>
            <div className="grid grid-cols-2 gap-2 my-2 border">
              <div>Chain</div>
              <div>
                <Select />
              </div>
              <div>Swap contract</div>
              <div>{swapContract}</div>
              <div>Domain Name</div>
              <div>{domainName}</div>
              <div>Domain Version</div>
              <div>{domainVersion}</div>
              <div>Protocol Fee</div>
              <div>{protocolFeeFormatted}</div>
            </div>
            <h2 className="text-xl font-bold">Order</h2>
            <div className="grid grid-cols-2 gap-2 my-2 border">
              <div>Nonce</div>
              <div>1234</div>
              <div>Expiry</div>
              <div>123456</div>
              <div>signerWallet</div>
              <div>0x123..123</div>
              <div>signerToken</div>
              <div>USDT</div>
              <div>signerAmount</div>
              <div>1234.123</div>
              <div>senderWallet</div>
              <div>0x123..123</div>
              <div>senderToken</div>
              <div>USDC</div>
              <div>senderAmount</div>
              <div>4332.123</div>
            </div>
          </div>
          <div className="w-1/2 pl-6">
            <h2>Issues</h2>
            <pre className="whitespace-pre">
              {JSON.stringify(
                {
                  orderErrors,
                  contractCallError,
                  orderParsingError,
                  schemaValidationError,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

export default App;
