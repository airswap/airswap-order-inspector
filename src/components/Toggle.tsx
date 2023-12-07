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
      <h3 className="mt-2 mb-4 text-md sm:text-lg font-semibold uppercase">
        Select server response type:
      </h3>
      <div className="flex flex-row w-full xs:w-[90%] sm:w-4/5 md:w-full lg:w-4/5 mx-auto rounded-sm">
        <Button
          text="JSON"
          clickAction={clickTypeJson}
          className={`${
            inputType === InputType.JSON
              ? 'text-white bg-blueGray'
              : 'bg-darkGray text-grayDark border border-blueGray'
          } rounded-l-md`}
        />
        <Button
          text="URL"
          clickAction={clickTypeUrl}
          className={`${
            inputType === InputType.URL
              ? 'bg-blueGray text-white'
              : 'bg-darkGray text-grayDark border-blueGray border'
          } rounded-r-md`}
        />
      </div>
    </>
  );
};
