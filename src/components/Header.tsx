import { twMerge } from 'tailwind-merge';
import airswapLogo from '../../src/assets/airswap-logo.svg';

export const Header = () => {
  return (
    <div
      className={twMerge(
        'flex flex-row my-4 mx-auto p-2 w-full justify-center text-2xl xs:text-3xl uppercase text-white font-medium'
      )}
    >
      <img src={airswapLogo} alt="AirSwap logo" className="mr-3" />
      <h1>Server Debugger</h1>
    </div>
  );
};
