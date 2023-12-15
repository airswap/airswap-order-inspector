import { twMerge } from 'tailwind-merge';
import React from 'react';

export const Button = React.forwardRef(
  (
    {
      text,
      clickAction,
      className,
      variant,
    }: {
      text: string;
      clickAction?: () => void;
      className?: string;
      variant: 'toggle' | 'dialog';
    },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const variants = {
      toggle:
        'flex flex-row space-x-2 w-full py-1.5 text-black text-sm font-semibold justify-center border-blueGray',
      dialog:
        'w-full mt-4 mx-auto py-3 px-4 text-white bg-blueGray border-darkgray border-1 rounded-sm font-medium text-lg uppercase',
    };

    return (
      <button
        ref={ref}
        onClick={clickAction}
        className={twMerge(variants[variant], className)}
      >
        {text}
      </button>
    );
  }
);
