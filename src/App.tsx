import React, { ChangeEvent, useState } from 'react';
import { useValidateOrder } from './hooks/useValidateOrder';
import { Header } from './features/ui/header';
import { useAppStore } from './store/store';
import { useDomainInfo } from './hooks/useDomainInfo';
import { formatSchemaValidationErrors } from './utils/formatSchemaValidationErrors';
import { LoadingOrFailed } from './features/ui/loadingOrFailed';
import { FormattedErrors } from './features/ui/formattedErrors';
import { NoErrorDisplay } from './features/ui/noErrorDisplay';
import { JsonDataDisplay } from './features/ui/jsonDataDisplay';
import { useSetChainId } from './hooks/useSetChainId';
import { useSetProtocolFee } from './hooks/useSetProtocolFee';
import { autoResizeTextarea } from './utils/autoResizeTextarea';

function App() {
  const [orderText, setOrderText] = useState<string | undefined>(undefined);

  const { selectedChainId, protocolFeeFromJson } = useAppStore();

  let swapContract: string | undefined;
  let domainName: string | undefined;
  let domainVersion: string | undefined;
  let protocolFeeFormatted: number | undefined;

  const {
    eip712Domain,
    protocolFee,
    isLoading: isLoadingDomainInfo,
    error: errorDomainInfo,
  } = useDomainInfo({
    chainId: selectedChainId,
  });

  const {
    schemaValidationResult,
    orderErrors,
    contractCallError,
    orderParsingError,
    schemaValidationError,
    order,
    isChecking,
  } = useValidateOrder({
    orderText: orderText,
  });

  useSetChainId({ order });
  useSetProtocolFee({
    jsonProtocolFee: order?.protocolFee,
    protocolFee: protocolFee,
  });

  const formattedSchemaValidationErrors = formatSchemaValidationErrors(
    schemaValidationError
  );

  if (eip712Domain?.status === 'success') {
    swapContract = eip712Domain.result[4];
    domainName = eip712Domain.result[1];
    domainVersion = eip712Domain.result[2];
  } else if (isLoadingDomainInfo) {
    swapContract = 'loading...';
    domainName = 'loading...';
    domainVersion = 'loading...';
  } else if (errorDomainInfo) {
    swapContract = 'Contract read error';
    domainName = 'Contract read error';
    domainVersion = 'Contract read error';
  } else {
    null;
  }

  const jsonTextarea = document.getElementById('jsonTextarea');
  autoResizeTextarea(jsonTextarea as HTMLTextAreaElement);

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
    nonce = order?.nonce;
    expiry = order?.expiry;
    signerWallet = order?.signerWallet;
    signerToken = order?.signerToken;
    signerAmount = order?.signerAmount;
    senderWallet = order?.senderWallet;
    senderToken = order?.senderToken;
    senderAmount = order?.senderAmount;
  }

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setOrderText(e.target.value);
  };

  const formattedErrors = FormattedErrors({
    formattedSchemaValidationErrors,
    orderErrors,
    eip721DomainStatus: eip712Domain?.status,
    contractCallError,
  });

  const noErrorDisplay = NoErrorDisplay({
    formattedSchemaValidationErrors,
    orderErrors,
  });

  const displayErrors = formattedErrors ? formattedErrors : noErrorDisplay;

  return (
    <React.Fragment>
      <Header />
      <main className="container flex flex-col w-[849px] h-fit py-8 gap-4 border mb-6">
        <h1 className="font-bold text-[24px]">Inspect an order</h1>
        <div className="flex flex-row">
          <textarea
            id="jsonTextarea"
            value={orderText}
            onChange={handleTextChange}
            placeholder="Enter JSON or URL"
            className="w-full h-fit p-2 top-[287px] bg-transparent border"
            rows={10}
          />
        </div>
        {orderText && !orderParsingError && (
          <JsonDataDisplay
            isChecking={isChecking}
            swapContract={swapContract}
            domainName={domainName}
            domainVersion={domainVersion}
            protocolFeeFormatted={
              Number(protocolFeeFromJson) || protocolFeeFormatted
            }
            nonce={nonce}
            expiry={expiry}
            signerWallet={signerWallet}
            signerToken={signerToken}
            signerAmount={signerAmount}
            senderWallet={senderWallet}
            senderToken={senderToken}
            senderAmount={senderAmount}
            displayErrors={displayErrors}
          />
        )}
        {orderParsingError || !orderText ? (
          <LoadingOrFailed
            orderText={orderText}
            orderParsingError={orderParsingError}
            contractCallError={contractCallError}
          />
        ) : null}
      </main>
    </React.Fragment>
  );
}

export default App;
