import React, { useState, useEffect } from "react";
import axios from "axios";

const ExchangeRates = () => {
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/currencies/")
      .then((response) => setCurrencies(response.data))
      .catch((error) => console.error("Error fetching currencies:", error));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Exchange Rates
      </h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Currency</th>
            <th className="text-left">Code</th>
            <th className="text-left">Exchange Rate (USD)</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map((currency) => (
            <tr key={currency.code}>
              <td>{currency.name}</td>
              <td>{currency.code}</td>
              <td>{currency.exchangeRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExchangeRates;