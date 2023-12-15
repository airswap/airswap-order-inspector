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
      <div className="flex flex-row mx-auto rounded-sm">
        <Button
          text="JSON"
          clickAction={clickTypeJson}
          variant="toggle"
          className={`${
            inputType === InputType.JSON
              ? 'text-white bg-blueGray'
              : 'bg-darkGray text-grayDark border border-blueGray'
          } rounded-l-md`}
        />
        <Button
          text="URL"
          clickAction={clickTypeUrl}
          variant="toggle"
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
