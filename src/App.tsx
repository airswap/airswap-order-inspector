import { Button } from './features/ui/button';
import React, { ChangeEvent, useState } from 'react';
import { cn } from './lib/utils';
import { useValidateOrder } from './hooks/useValidateOrder';
import { Header } from './features/ui/header';
import { Select } from './features/ui/select';
import {
  SwapContractAddressStore,
  useAppStore,
  useChainStore,
  useSwapContractAddressStore,
} from './store/store';
import { useDomainInfo } from './hooks/useDomainInfo';
import { truncateAddress } from './utils/truncateAddress';
import { useFormatSchemaValidationErrors } from './hooks/useFormatSchemaValidationErrors';
import { LoadingOrFailed } from './features/ui/loadingOrFailed';
import { ErrorDisplay } from './features/ui/errorDisplay';
import { NoErrorDisplay } from './features/ui/noErrorDisplay';

function App() {
  const [urlMode, setUrlMode] = useState<boolean>(false);
  const [orderText, setOrderText] = useState<string>('');

  const { isCheckEnabled, setIsCheckEnabled } = useAppStore();
  const { selectedChainId, setSelectedChainId } = useChainStore();
  const swapContractAddress = useSwapContractAddressStore(
    (state: SwapContractAddressStore) => state.swapContractAddress
  );

  let swapContract: string | undefined;
  let domainName: string | undefined;
  let domainVersion: string | undefined;
  let protocolFeeFormatted: number | undefined;

  console.log(swapContract);

  const { eip712Domain, protocolFee } = useDomainInfo({
    chainId: selectedChainId,
    swapContract: swapContractAddress,
  });

  const {
    schemaValidationResult,
    orderErrors,
    contractCallError,
    orderParsingError,
    schemaValidationError,
  } = useValidateOrder({
    order: orderText,
    isUrl: urlMode,
    swapContract: swapContract,
    onSetChain: (newId) => {
      if (selectedChainId !== newId) {
        setSelectedChainId(newId);
      }
    },
  });

  const formattedSchemaValidationErrors = useFormatSchemaValidationErrors(
    schemaValidationError
  );

  if (eip712Domain?.status === 'success') {
    swapContract = truncateAddress(eip712Domain.result[4]);
    domainName = eip712Domain.result[1];
    domainVersion = eip712Domain.result[2];
  } else {
    swapContract = 'Error reading contract';
    domainName = 'Error reading contract';
    domainVersion = 'Error reading contract';
  }

  if (protocolFee?.status === 'success') {
    protocolFeeFormatted = Number(protocolFee.result);
  }

  let nonce;
  let expiry;
  let signerWallet;
  let signerToken;
  let signerAmount;
  let senderWallet;
  let senderToken;
  let senderAmount;

  const validSchema = schemaValidationResult.success;

  if (validSchema) {
    nonce = schemaValidationResult.data.nonce;
    expiry = schemaValidationResult.data.expiry;
    signerWallet = truncateAddress(schemaValidationResult.data.signerWallet);
    signerToken = truncateAddress(schemaValidationResult.data.signerToken);
    signerAmount = schemaValidationResult.data.signerAmount;
    senderWallet = truncateAddress(schemaValidationResult.data.senderWallet);
    senderToken = truncateAddress(schemaValidationResult.data.senderToken);
    senderAmount = schemaValidationResult.data.senderAmount;
  }

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsCheckEnabled(false);
    setOrderText(e.target.value);
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsCheckEnabled(false);
    setOrderText(e.target.value);
  };

  const handleSubmit = () => {
    if (orderText.length > 0) {
      setIsCheckEnabled(true);
    } else {
      return;
    }
  };

  const formattedErrors = ErrorDisplay({
    formattedSchemaValidationErrors,
    orderErrors,
    eip721DomainStatus: eip712Domain?.status,
  });

  // this is used to render "No errors found" display
  const noErrorDisplay = NoErrorDisplay({
    formattedSchemaValidationErrors,
    orderErrors,
  });

  const isDisplayErrors = formattedErrors ? formattedErrors : noErrorDisplay;

  return (
    <React.Fragment>
      <Header />
      <main className="container flex flex-col w-[849px] h-fit py-8 gap-4 border">
        <h1 className="font-bold text-[24px]">Inspect an order</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setOrderText('');
              setUrlMode(false);
            }}
            className={cn({
              underline: !urlMode,
            })}
          >
            Text mode
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setOrderText('');
              setUrlMode(true);
            }}
            className={cn({
              underline: urlMode,
            })}
          >
            URL mode
          </Button>
        </div>

        {urlMode ? (
          <div className="flex flex-row">
            <input
              type="text"
              value={orderText}
              onChange={handleUrlChange}
              placeholder="Enter URL"
              className="w-full h-12 top-[287px] bg-transparent border p-2"
            />
            <Button onClick={handleSubmit}>Check</Button>
          </div>
        ) : (
          <div className="flex flex-row">
            <textarea
              value={orderText}
              onChange={handleTextChange}
              placeholder="JSON or URL"
              className="w-full h-12 top-[287px] bg-transparent border p-2"
              rows={10}
            />
            <Button onClick={handleSubmit}>Check</Button>
          </div>
        )}
        {isCheckEnabled && !orderParsingError && (
          <div className="flex flex-row py-4">
            <div className="w-1/2 h-full pr-6 border-r font-bold text-[13px]">
              <h2 className="text-[16px]">Domain</h2>
              <div className="grid grid-cols-2 gap-2 mt-2 mb-6">
                <div className="text-textDark font-medium">Chain</div>
                <div className={`${orderText.length === 0 && 'hidden'}`}>
                  <Select />
                </div>
                <div className="text-textDark font-medium">Swap contract</div>
                <div>{swapContract}</div>
                <div className="text-textDark font-medium">Domain Name</div>
                <div>{domainName}</div>
                <div className="text-textDark font-medium">Domain Version</div>
                <div>{domainVersion}</div>
                <div className="text-textDark font-medium">Protocol Fee</div>
                <div>{protocolFeeFormatted}</div>
              </div>

              <h2 className="text-[16px]">Order</h2>
              <div className="grid grid-cols-2 gap-2 my-2">
                <div className="text-textDark font-medium">Nonce</div>
                <div>{nonce}</div>
                <div className="text-textDark font-medium">Expiry</div>
                <div>{expiry}</div>
                <div className="text-textDark font-medium">signerWallet</div>
                <div>{signerWallet}</div>
                <div className="text-textDark font-medium">signerToken</div>
                <div>{signerToken}</div>
                <div className="text-textDark font-medium">signerAmount</div>
                <div>{signerAmount}</div>
                <div className="text-textDark font-medium">senderWallet</div>
                <div>{senderWallet}</div>
                <div className="text-textDark font-medium">senderToken</div>
                <div>{senderToken}</div>
                <div className="text-textDark font-medium">senderAmount</div>
                <div>{senderAmount}</div>
              </div>
            </div>
            <div className="w-1/2 px-6">
              <h2 className="font-bold">Issues</h2>
              <pre className="whitespace-pre h-full">{isDisplayErrors}</pre>
            </div>
          </div>
        )}
        {!isCheckEnabled || !!orderParsingError ? (
          <LoadingOrFailed
            isCheckEnabled={isCheckEnabled}
            orderParsingError={orderParsingError}
            contractCallError={contractCallError}
          />
        ) : null}
      </main>
    </React.Fragment>
  );
}

export default App;
