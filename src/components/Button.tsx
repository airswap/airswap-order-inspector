import { twMerge } from 'tailwind-merge';

export const Button = ({
  text,
  clickAction,
  className,
  variant,
}: {
  text: string;
  clickAction?: () => void;
  className?: string;
  variant: 'toggle' | 'dialog';
}) => {
  const variants = {
    toggle:
      'flex flex-row space-x-2 w-full py-1.5 text-black text-sm font-semibold justify-center border-blueGray',
    dialog:
      'w-full mt-4 mx-auto py-3 px-4 text-white bg-blueGray border-darkgray border-1 rounded-sm font-medium text-lg uppercase',
  };

  return (
    <button
      onClick={clickAction}
      className={twMerge(
        variant === 'toggle' ? variants.toggle : variants.dialog,
        className
      )}
    >
      {text}
    </button>
  );
};
