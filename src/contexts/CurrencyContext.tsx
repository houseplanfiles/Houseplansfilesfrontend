"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "INR"
  | "AUD"
  | "CAD"
  | "JPY"
  | "AED"
  | "CNY"
  | "SGD";

export const availableCurrencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
] as const;

// NOTE: These are example rates. Use a real API for production.
const exchangeRates: Record<CurrencyCode, number> = {
  USD: 1.0,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.5,
  CAD: 1.37,
  JPY: 157.0,
  AED: 3.67,
  CNY: 7.25,
  SGD: 1.35,
};

interface CurrencyContextType {
  currency: CurrencyCode;
  symbol: string;
  rate: number;
  setCurrency: (currency: CurrencyCode) => void;
  availableCurrencies: typeof availableCurrencies; // This was missing
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") as CurrencyCode;
    if (availableCurrencies.some((c) => c.code === savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const currentCurrencyDetails =
    availableCurrencies.find((c) => c.code === currency) ||
    availableCurrencies[0];

  const value: CurrencyContextType = {
    currency,
    symbol: currentCurrencyDetails.symbol,
    rate: exchangeRates[currency],
    setCurrency,
    availableCurrencies, // FIX: ADDED THIS LINE
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
