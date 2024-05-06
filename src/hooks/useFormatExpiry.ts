import { formatDistanceToNow } from 'date-fns';

export const useFormatExpiry = (
  expiry: number | undefined
): string | undefined => {
  if (!expiry) {
    return undefined;
  }

  const expiryDate = new Date(expiry * 1000);
  const distance = formatDistanceToNow(expiryDate, { addSuffix: true });

  return distance;
};
