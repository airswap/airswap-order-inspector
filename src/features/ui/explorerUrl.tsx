import { useChainId } from 'wagmi';
import { blockExplorers } from '../../utils/blockExplorers';
import { truncateAddress } from '../../utils/truncateAddress';
import { TfiNewWindow } from 'react-icons/tfi';

export const ExplorerUrl = ({
  jsonData,
}: {
  jsonData: string | undefined | null;
}) => {
  const chainId = useChainId();
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
      {truncateAddress(jsonData)}
      <div>
        <TfiNewWindow className="ml-3" />
      </div>
    </a>
  );
};
