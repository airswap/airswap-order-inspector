import { truncateAddress } from '@/utils/truncateAddress';
import { Select } from './select';

export const JsonData = ({
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
  isDisplayErrors,
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
  isDisplayErrors: JSX.Element | JSX.Element[] | undefined;
}) => {
  return (
    <div className="flex flex-row py-4">
      <div className="w-1/2 h-full pr-6 border-r font-bold text-[13px]">
        <h2 className="text-[16px]">Domain</h2>
        <div className="grid grid-cols-2 gap-2 mt-2 mb-6">
          <div className="text-textDark font-medium">Chain</div>
          <div>
            <Select />
          </div>
          <div className="text-textDark font-medium">Swap contract</div>
          <div>{truncateAddress(swapContract)}</div>
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
          <div>{truncateAddress(signerWallet)}</div>
          <div className="text-textDark font-medium">signerToken</div>
          <div>{truncateAddress(signerToken)}</div>
          <div className="text-textDark font-medium">signerAmount</div>
          <div>{signerAmount}</div>
          <div className="text-textDark font-medium">senderWallet</div>
          <div>{truncateAddress(senderWallet)}</div>
          <div className="text-textDark font-medium">senderToken</div>
          <div>{truncateAddress(senderToken)}</div>
          <div className="text-textDark font-medium">senderAmount</div>
          <div>{senderAmount}</div>
        </div>
      </div>
      <div className="w-1/2 px-6">
        <h2 className="font-bold">Issues</h2>
        <pre className="whitespace-pre h-full">{isDisplayErrors}</pre>
      </div>
    </div>
  );
};
