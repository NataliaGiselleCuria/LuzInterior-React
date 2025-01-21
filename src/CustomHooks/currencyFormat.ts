import { useMemo } from "react";

const useCurrencyFormat = (currency: string = 'ARS', locale: string = 'es-AR') => {
  return useMemo(() => {
    return (value: number) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    };
  }, [currency, locale]);
};

export default useCurrencyFormat;