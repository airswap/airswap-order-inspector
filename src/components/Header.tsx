import { twMerge } from 'tailwind-merge';
import airswapLogo from '../../src/assets/airswap-logo.svg';

export const Header = ({
  protocolFee,
  isLoadingProtocolFee,
}: {
  protocolFee: bigint | undefined;
  isLoadingProtocolFee: boolean;
}) => {
  return (
    <div
      className={twMerge(
        'flex flex-col mx-auto my-4 md:relative md:flex-row',
        'text-2xl xs:text-3xl uppercase text-white font-medium',
        'w-full xs:w-[90%] sm:w-4/5 md:w-[95%] lg:w-[90%] xl:w-4/5'
      )}
    >
      <div
        className={twMerge(
          'flex mx-auto p-2 w-full justify-center',
          'md:col-start-2 col-span-2 justify-center overflow-auto'
        )}
      >
        <img src={airswapLogo} alt="AirSwap logo" className="mr-3" />
        <h1>Server Debugger</h1>
      </div>
      <div className="flex md:absolute md:right-0 mx-auto md:h-full md:py-2 text-sm font-light text-white uppercase">
        Protocol fee:{' '}
        {!isLoadingProtocolFee ? Number(protocolFee) || '7' : 'loading...'}
      </div>
    </div>
  );
};
