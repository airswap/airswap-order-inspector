import { ChainSelector } from './ChainSelector';
import { ImSpinner8 } from 'react-icons/im';
import { ExplorerUrl } from './explorerUrl';
import { useTokenData } from '@/hooks/useTokenData';
import { Address } from 'viem';
import { formatDecimals } from '@/utils/formatDecimals';
import { useFormatExpiry } from '@/hooks/useFormatExpiry';

export const JsonDataDisplay = ({
  swapContract,
  domainName,
  domainVersion,
  protocolFeeFormatted,
  nonce,
  expiry,
  signerWallet,
  signerToken,
  signerAmount,
  senderWallet,
  senderToken,
  senderAmount,
  displayErrors,
  isChecking,
}: {
  swapContract: string | undefined;
  domainName: string | undefined;
  domainVersion: string | undefined;
  protocolFeeFormatted: number | undefined;
  nonce: number | undefined;
  expiry: number | undefined;
  signerWallet: string | undefined;
  signerToken: string | undefined;
  signerAmount: string | undefined;
  senderWallet: string | undefined | null;
  senderToken: string | undefined;
  senderAmount: string | undefined;
  displayErrors: JSX.Element | JSX.Element[] | undefined;
  isChecking: boolean;
}) => {
  const signerTokenData = useTokenData(signerToken as Address);
  const senderTokenData = useTokenData(senderToken as Address);
  const signerTokenSymbol = signerTokenData.symbol;
  const senderTokenSymbol = senderTokenData.symbol;

  const signerAmountFormatted = formatDecimals({
    amount: signerAmount,
    decimals: signerTokenData.decimals,
  });

  const senderAmountFormatted = formatDecimals({
    amount: senderAmount,
    decimals: senderTokenData.decimals,
  });

  return (
    <div className="flex flex-row py-4">
      <div className="w-1/2 h-full pr-6 border-r font-bold text-[13px]">
        <h2 className="text-[16px]">Domain</h2>
        <div className="grid grid-cols-2 gap-2 mt-2 mb-6">
          <div className="text-textDark font-medium">Chain</div>
          <div>
            <ChainSelector />
          </div>
          <div className="text-textDark font-medium">Swap contract</div>
          <div>
            <ExplorerUrl jsonData={swapContract} />
          </div>
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
          <div>
            {useFormatExpiry(expiry)} {`(${expiry})`}
          </div>
          <div className="text-textDark font-medium">signerWallet</div>
          <div>
            <ExplorerUrl jsonData={signerWallet} />
          </div>
          <div className="text-textDark font-medium">signerToken</div>
          <div>
            <ExplorerUrl jsonData={signerToken} symbol={signerTokenSymbol} />
          </div>
          <div className="text-textDark font-medium">signerAmount</div>
          <div>{signerAmountFormatted}</div>
          <div className="text-textDark font-medium">senderWallet</div>
          <div>
            <ExplorerUrl jsonData={senderWallet} />
          </div>
          <div className="text-textDark font-medium">senderToken</div>
          <div className="flex flex-row">
            <ExplorerUrl jsonData={senderToken} symbol={senderTokenSymbol} />
          </div>
          <div className="text-textDark font-medium">senderAmount</div>
          <div>{senderAmountFormatted}</div>
        </div>
      </div>
      <div className="w-1/2 px-6">
        <h2 className="font-bold">Issues</h2>
        {isChecking ? (
          <div className="w-full h-full grid place-items-center">
            <div className="flex flex-col gap-2 items-center">
              <ImSpinner8 className="animate-spin" size={24} />
              <p className="font-light text-white/80 text-sm">
                Checking for issues...
              </p>
            </div>
          </div>
        ) : (
          <pre className="whitespace-pre h-full">{displayErrors}</pre>
        )}
      </div>
    </div>
  );
};
