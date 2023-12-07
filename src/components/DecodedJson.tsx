import { CheckParamsJSON } from '../../types';

export const DecodedJson = ({
  decodedJson,
}: {
  decodedJson: Partial<CheckParamsJSON> | undefined;
}) => {
  if (!decodedJson) {
    return;
  }

  const formatJson = (json: Partial<CheckParamsJSON>) =>
    JSON.stringify(json, null, 2);

  const formattedJson = formatJson(decodedJson);

  return <div className="text-xs">{formattedJson}</div>;
};
