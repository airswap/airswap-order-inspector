import { twMerge } from 'tailwind-merge';

export const Button = ({
  text,
  clickAction,
  className,
}: {
  text: string;
  clickAction: () => void;
  className?: string | null;
}) => {
  return (
    <button
      onClick={clickAction}
      className={twMerge(
        'flex flex-row space-x-2 w-full py-1.5 text-black text-sm font-semibold justify-center border-blueGray',
        className
      )}
    >
      {text}
    </button>
  );
};
