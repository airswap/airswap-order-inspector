import { Button } from './features/ui/button';
import React, { ChangeEvent, useState } from 'react';
import { useValidateOrder } from './hooks/useValidateOrder';
import { Header } from './features/ui/header';
import {
  SwapContractAddressStore,
  useAppStore,
  useChainStore,
  useSwapContractAddressStore,
} from './store/store';
import { useDomainInfo } from './hooks/useDomainInfo';
import { useFormatSchemaValidationErrors } from './hooks/useFormatSchemaValidationErrors';
import { LoadingOrFailed } from './features/ui/loadingOrFailed';
import { ErrorDisplay } from './features/ui/errorDisplay';
import { NoErrorDisplay } from './features/ui/noErrorDisplay';
import { JsonData } from './features/ui/jsonData';

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
    swapContract = eip712Domain.result[4];
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
    signerWallet = schemaValidationResult.data.signerWallet;
    signerToken = schemaValidationResult.data.signerToken;
    signerAmount = schemaValidationResult.data.signerAmount;
    senderWallet = schemaValidationResult.data.senderWallet;
    senderToken = schemaValidationResult.data.senderToken;
    senderAmount = schemaValidationResult.data.senderAmount;
  }

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsCheckEnabled(false);
    setOrderText(e.target.value);
    // check if URL or JSON
    if (e.target.value[0] === '{') {
      setUrlMode(false);
    } else if (e.target.value.substring(0, 4) === 'http') {
      setUrlMode(true);
    } else {
      return;
    }
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
        <div className="flex flex-row">
          <textarea
            value={orderText}
            onChange={handleTextChange}
            placeholder="Enter JSON or URL"
            className="w-full h-12 top-[287px] bg-transparent border p-2"
            rows={10}
          />
          <Button onClick={handleSubmit}>Check</Button>
        </div>
        {isCheckEnabled && !orderParsingError && (
          <JsonData
            swapContract={swapContract}
            domainName={domainName}
            domainVersion={domainVersion}
            protocolFeeFormatted={protocolFeeFormatted}
            nonce={nonce}
            expiry={expiry}
            signerWallet={signerWallet}
            signerToken={signerToken}
            signerAmount={signerAmount}
            senderWallet={senderWallet}
            senderToken={senderToken}
            senderAmount={senderAmount}
            isDisplayErrors={isDisplayErrors}
          />
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
