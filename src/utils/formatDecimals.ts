export const formatDecimals = ({
  amount,
  decimals,
}: {
  amount: string | undefined;
  decimals: number | undefined;
}) => {
  if (!amount || !decimals) {
    return undefined;
  } else {
    return Number(amount) / 10 ** decimals;
  }
};
