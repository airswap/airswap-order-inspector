export const truncateAddress = (address: string | undefined | null) => {
  if (!address) {
    return;
  } else {
    return address.slice(0, 5) + '...' + address.slice(-3);
  }
};
