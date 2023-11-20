import { InputType } from '../../types';
import { Button } from './Button';

export const Toggle = ({
  inputType,
  clickTypeJson,
  clickTypeUrl,
}: {
  inputType: InputType;
  clickTypeJson: () => void;
  clickTypeUrl: () => void;
}) => {
  return (
    <>
      <h3 className="my-2 text-md sm:text-lg font-semibold uppercase">
        Select server response type:
      </h3>
      <div className="flex flex-row w-full xs:w-[90%] sm:w-4/5 md:w-4/5 m-auto rounded-sm">
        <Button
          text="JSON"
          clickAction={clickTypeJson}
          className={`${
            inputType === InputType.JSON
              ? 'text-white bg-blueMidnightSelected'
              : 'bg-blueMidnightUnselected text-grayDark'
          } rounded-l-md`}
        />
        <Button
          text="URL"
          clickAction={clickTypeUrl}
          className={`${
            inputType === InputType.URL
              ? 'bg-blueMidnightSelected text-white'
              : 'bg-blueMidnightUnselected text-grayDark'
          } rounded-r-md`}
        />
      </div>
    </>
  );
};
