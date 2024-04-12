import { truncateAddress } from '@/utils/truncateAddress';
import { ChainSelector } from './ChainSelector';
import { blockExplorers } from '@/utils/blockExplorers';
import { useChainId } from 'wagmi';
import { TfiNewWindow } from 'react-icons/tfi';

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
}) => {
  const chainId = useChainId();
  const explorerUrl = blockExplorers[chainId || 1];
  console.log('displayErrors', displayErrors);

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
            <a
              href={`${explorerUrl}/address/${swapContract}`}
              target="_"
              className="flex flex-row items-center"
            >
              {truncateAddress(swapContract)}
              <TfiNewWindow className="ml-3" />
            </a>
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
          <div>{expiry}</div>
          <div className="text-textDark font-medium">signerWallet</div>
          <div>
            <a
              href={`${explorerUrl}/address/${signerWallet}`}
              target="_"
              className="flex flex-row items-center"
            >
              {truncateAddress(signerWallet)}
              <div>
                <TfiNewWindow className="ml-3" />
              </div>
            </a>
          </div>
          <div className="text-textDark font-medium">signerToken</div>
          <div>
            <a
              href={`${explorerUrl}/address/${signerToken}`}
              target="_"
              className="flex flex-row items-center"
            >
              {truncateAddress(signerToken)}
              <div>
                <TfiNewWindow className="ml-3" />
              </div>
            </a>
          </div>
          <div className="text-textDark font-medium">signerAmount</div>
          <div>{signerAmount}</div>
          <div className="text-textDark font-medium">senderWallet</div>
          <div>
            <a
              href={`${explorerUrl}/address/${senderWallet}`}
              target="_"
              className="flex flex-row items-center"
            >
              {truncateAddress(senderWallet)}
              <div>
                <TfiNewWindow className="ml-3" />
              </div>
            </a>
          </div>
          <div className="text-textDark font-medium">senderToken</div>
          <div>
            <a
              href={`${explorerUrl}/address/${senderToken}`}
              target="_"
              className="flex flex-row items-center"
            >
              {truncateAddress(senderToken)}
              <div>
                <TfiNewWindow className="ml-3" />
              </div>
            </a>
          </div>
          <div className="text-textDark font-medium">senderAmount</div>
          <div>{senderAmount}</div>
        </div>
      </div>
      <div className="w-1/2 px-6">
        <h2 className="font-bold">Issues</h2>
        <pre className="whitespace-pre h-full">{displayErrors}</pre>
      </div>
    </div>
  );
};
