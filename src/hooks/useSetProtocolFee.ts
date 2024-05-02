import { useAppStore } from '@/store/store';
import { useEffect } from 'react';

type ProtocolFee =
  | {
      error: Error;
      result?: undefined;
      status: 'failure';
    }
  | {
      error?: undefined;
      result: bigint;
      status: 'success';
    }
  | undefined;

/**
 * @param jsonProtocolFee is user inputted protocolFee in JSON
 * @param protocolFee is from `useDomainInfo` hook
 */
export const useSetProtocolFee = ({
  jsonProtocolFee,
  protocolFee,
}: {
  jsonProtocolFee: number | string | undefined;
  protocolFee: ProtocolFee;
}) => {
  const { setProtocolFeeFromJson } = useAppStore();

  useEffect(() => {
    if (jsonProtocolFee) {
      setProtocolFeeFromJson(jsonProtocolFee?.toString());
    } else if (!jsonProtocolFee) {
      setProtocolFeeFromJson(protocolFee?.result?.toString());
    } else {
      null;
    }
  }, [protocolFee, setProtocolFeeFromJson, jsonProtocolFee]);
};
