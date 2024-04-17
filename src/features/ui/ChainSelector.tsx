import { useAppStore } from '@/store/store';
import { Select } from './select';
import { chainIdOptions } from '@/lib/chainIdOptions';
import { chainIdInOptions } from '@/utils/chainIdInOptions';
import { useCallback, useEffect, useState } from 'react';
import { matchNetworkNameWithId } from '@/utils/matchNetworkNamesWithId';

export const ChainSelector = () => {
  const [placeholder, setPlaceholder] = useState('Select chain id');
  const [networkName, setNetworkName] = useState<string>('');
  const { isSelectDisabled, selectedChainId, setSelectedChainId } =
    useAppStore();

  const handleSelectChange = (chain: number): void => {
    if (!isSelectDisabled) {
      setSelectedChainId(Number(chain));
    }
  };

  const isChainIdInOptions = chainIdInOptions(selectedChainId);

  const chainIdPlaceholder = useCallback(() => {
    if (!isSelectDisabled) {
      return selectedChainId.toString();
    } else if (!isChainIdInOptions) {
      return 'JSON chainId invalid';
    } else {
      return selectedChainId.toString();
    }
  }, [isSelectDisabled, isChainIdInOptions, selectedChainId]);

  const placeholderFiller = selectedChainId ? (
    `${networkName}: ${placeholder}`
  ) : (
    <span className="placeholder">Select chain id</span>
  );

  useEffect(() => {
    const updatedPlaceholder = chainIdPlaceholder();
    setPlaceholder(updatedPlaceholder);

    const networkNameMatch = matchNetworkNameWithId(placeholder);
    setNetworkName(networkNameMatch || '');
  }, [chainIdPlaceholder, placeholder]);

  return (
    <Select
      isSelectDisabled={isSelectDisabled}
      handleSelectChange={(val: string) => handleSelectChange(Number(val))}
      placeholderValue={`${networkName}: ${placeholder}`}
      placeholderFiller={placeholderFiller}
      selectOptions={chainIdOptions}
    />
  );
};
