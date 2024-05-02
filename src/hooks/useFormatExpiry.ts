import { format } from 'date-fns';

export const useFormatExpiry = (expiry: number | undefined) => {
  if (!expiry) {
    return undefined;
  } else {
    const expiryDate = new Date(expiry * 1000);
    const formattedDate = format(expiryDate, 'dd/MM/yyyy');

    return formattedDate;
  }
};
