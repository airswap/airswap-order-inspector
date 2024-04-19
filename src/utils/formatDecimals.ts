export const formatDecimals = ({
  amount,
  decimals,
}: {
  amount: string | undefined;
  decimals: number | undefined;
}) => {
  if (!amount || !decimals) {
    console.log('no amount or no decimals');
    return undefined;
  }

  return Number(amount) / 10 ** decimals;
};
