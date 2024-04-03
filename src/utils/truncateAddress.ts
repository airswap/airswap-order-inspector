export const truncateAddress = (address: string | null) => {
  if (!address) {
    return;
  } else {
    return address.slice(0, 4) + '...' + address.slice(-4);
  }
};
