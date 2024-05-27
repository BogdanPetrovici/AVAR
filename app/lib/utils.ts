export const formatCurrency = (amount: number, currency: string) => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currencyDisplay: 'code',
    currency: currency,
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(new Date(dateStr));
};

export const getTransactionId = (transactionSortKey: string): string => {
  const rangeKeyTokens: string[] = transactionSortKey.split('#');
  return rangeKeyTokens.length == 2 ? rangeKeyTokens[1] : '-';
};

export const getTransactionKey = (transactionId: string): string => {
  return `Transaction#${transactionId}`;
};
