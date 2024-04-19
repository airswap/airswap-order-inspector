import { useAppStore } from '@/store/store';
import { TfiNewWindow } from 'react-icons/tfi';
import { blockExplorers } from '../../utils/blockExplorers';
import { truncateAddress } from '../../utils/truncateAddress';

export const ExplorerUrl = ({
  jsonData,
  symbol,
}: {
  jsonData: string | undefined | null;
  symbol?: string | undefined;
}) => {
  const chainId = useAppStore((store) => store.selectedChainId);
  const explorerUrl = blockExplorers[chainId || 1];

  if (!jsonData) {
    return;
  }

  return (
    <a
      href={`${explorerUrl}/address/${jsonData}`}
      target="_"
      className="flex flex-row items-center"
    >
      {truncateAddress(jsonData)} {`${symbol ? ' (' + symbol + ')' : ''}`}
      <div>
        <TfiNewWindow className="ml-3" />
      </div>
    </a>
  );
};
