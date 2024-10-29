import { useEffect, useState } from 'react';
import './App.css';
import Form from './components/Form';
import Navbar from './components/Navbar';


function App() {

  const [currencyOptions, setCurrencyOptions] = useState([])
  const baseCurrency = "USD"
  console.log(currencyOptions)
  useEffect(() => {
    fetch('https://interview.switcheo.com/prices.json')
      .then(response => response.json())
      .then(data => {
        const currencyPairs = data.map(item => [item.currency, item.price]);
        const uniqueMap = new Map(currencyPairs);
        const uniqueCurrencies = Array.from(uniqueMap.entries());
        const orderedCurrencies = [
          ...uniqueCurrencies.filter(([currency]) => currency === baseCurrency),
          ...uniqueCurrencies.filter(([currency]) => currency !== baseCurrency)
        ];
        setCurrencyOptions(orderedCurrencies)
      });
  }, []);

  return (
    <div className=" App d-flex flex-column justify-content-center align-items-center">
      <div className="w-100 justify-content-center align-items-center">
        <Navbar />
      </div>
      <div className="content d-flex justify-content-center align-items-center m-5">
        <Form currencyOptions={currencyOptions} />
      </div>
    </div>
  );
}

export default App;
