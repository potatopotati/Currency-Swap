import React, { useState, useCallback } from 'react';


const Form = ({ currencyOptions }) => {
    const [currentsendCurrency, setcurrentsendCurrency] = useState("Select Currency");
    const [currentreceiveCurrency, setcurrentreceiveCurrency] = useState("Select Currency");
    const [Amount, setAmount] = useState(0);
    const [Exchange, setExchange] = useState(0);
    const [showAlert, setshowAlert] = useState(false);
    const [showHistory, setshowHistory] = useState(false);
    const [transactionHistory, setTransactionHistory] = useState([]);

    const Calculate = useCallback((value, sendCurrency, receiveCurrency) => {

        const sendCurrencyOption = currencyOptions.find(option => option[0] === sendCurrency);
        const receiveCurrencyOption = currencyOptions.find(option => option[0] === receiveCurrency);

        if (sendCurrencyOption && receiveCurrencyOption) {
            const sendCurrencyRate = sendCurrencyOption[1];
            const receiveCurrencyRate = receiveCurrencyOption[1];
            const exchangeAmount = (value * sendCurrencyRate) / receiveCurrencyRate;
            setExchange(exchangeAmount);
        } else {
            setExchange(0);
            console.error("Currency rate not found");
        }
    }, [currencyOptions]);

    const Amountchange = (e) => {
        const value = e.target.value;

        if (/^[0-9]*\.?[0-9]*$/.test(value)) {
            setAmount(value === "" ? 0 : value);
            Calculate(value, currentsendCurrency, currentreceiveCurrency);
            setshowAlert(false);
        } else {
            setshowAlert(true);
            e.target.value = Amount;
        }
    };

    const Swap = () => {
        const newSendCurrency = currentreceiveCurrency;
        const newReceiveCurrency = currentsendCurrency;

        setcurrentsendCurrency(newSendCurrency);
        setcurrentreceiveCurrency(newReceiveCurrency);

        Calculate(Amount, newSendCurrency, newReceiveCurrency);
    };


    const changesendCurrency = (currency) => {
        setcurrentsendCurrency(currency);
        Calculate(Amount, currency, currentreceiveCurrency);
    };

    const changereceiveCurrency = (currency) => {
        setcurrentreceiveCurrency(currency);
        Calculate(Amount, currentsendCurrency, currency);
    };

    const resetForm = () => {
        const newHistory = [
            ...transactionHistory,
            {
                sendCurrency: currentsendCurrency,
                receiveCurrency: currentreceiveCurrency,
                amount: Amount,
                exchangeAmount: Exchange,
                date: new Date().toLocaleString()
            }
        ];
        setTransactionHistory(newHistory.slice(-5));
        setcurrentsendCurrency("Select Currency");
        setcurrentreceiveCurrency("Select Currency");
        setAmount(0);
        setExchange(0);
        setshowAlert(false);
    };

    return (
        <div className='content-form overflow-auto text-white py-5 px-4 rounded-4'>
            <form>

                <h1>Swap Currency</h1>
                {showAlert && (
                    <div className="alert alert-danger" role="alert">
                        Enter numeric values
                    </div>
                )}
                <div className="d-flex flex-column py-3 justify-content-center align-items-center">

                    <div className="sendsection rounded-4 d-flex flex-column p-3 mt-3">
                        <label className='d-flex fs-5 '>Send:</label>
                        <div className='row d-flex justify-content-center align-items-center'>

                            <input className='col-6 col-sm-8 fs-3' type="text" value={Amount} onChange={Amountchange} disabled={currentsendCurrency === "Select Currency" || currentreceiveCurrency === "Select Currency"} />

                            <div className="col-6 col-sm-4 dropdown d-flex justify-content-end">

                                <button className="btn btn-light dropdown-toggle" placeholder={0} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img src={`${process.env.PUBLIC_URL}/token-icons/${currentsendCurrency}.svg`} alt={currentsendCurrency} onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/token-icons/default.png`} style={{ width: '20px', marginRight: '8px' }} />
                                    {currentsendCurrency}
                                </button>

                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    {currencyOptions.map((sendcurrency, index) => (
                                        <a className="dropdown-item" onClick={() => changesendCurrency(sendcurrency[0])} key={index} href="#">
                                            <img src={`${process.env.PUBLIC_URL}/token-icons/${sendcurrency[0]}.svg`} alt={sendcurrency[0]} onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/token-icons/default.png`} style={{ width: '20px', marginRight: '8px' }} />
                                            {sendcurrency[0]}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='pt-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" role="button" className="bi bi-arrow-down-up" viewBox="0 0 16 16" onClick={Swap}>
                            <path fillRule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5" />
                        </svg>
                    </div>

                    <div className="d-flex flex-column py-3 justify-content-center align-items-center">

                        <div className="sendsection rounded-4 d-flex flex-column p-3">
                            <label className='d-flex fs-5'>Receive:</label>
                            <div className='receivesection row d-flex justify-content-center align-items-center'>

                                <input className='col-6 col-sm-8 fs-3' type="text" placeholder={Exchange} value={Exchange} disabled />

                                <div className="col-6 col-sm-4 dropdown d-flex justify-content-end">
                                    <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={`${process.env.PUBLIC_URL}/token-icons/${currentreceiveCurrency}.svg`} alt={currentreceiveCurrency} onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/token-icons/default.png`} style={{ width: '20px', marginRight: '8px' }} />
                                        {currentreceiveCurrency}
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        {currencyOptions.map((receivecurrency, index) => (
                                            <a className="dropdown-item" onClick={() => changereceiveCurrency(receivecurrency[0])} key={index} href="#">
                                                <img src={`${process.env.PUBLIC_URL}/token-icons/${receivecurrency[0]}.svg`} alt={receivecurrency[0]} onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/token-icons/default.png`} style={{ width: '20px', marginRight: '8px' }} />
                                                {receivecurrency[0]}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='submitbtn'>
                    <button type="button" className="btn btn-light btn-lg mt-3" data-toggle="modal" data-target="#exampleModal" disabled={Amount == 0}>
                        Submit
                    </button>

                    <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                        <div className="modal-dialog modal-dialog-centered" role="document" data-backdrop="static" data-keyboard="false">
                            <div className="modal-content text-black">
                                <div className="modal-header">
                                    <h5 className="modal-title w-100 text-center" id="exampleModalLabel">Transaction Complete!</h5>
                                </div>
                                <div className="modal-body">
                                    <p>Your transaction has been completed!</p>
                                    <p>You have successfully exchanged: </p>
                                    <strong>{Amount} {currentsendCurrency} to {Exchange} {currentreceiveCurrency}</strong>
                                </div>
                                <div className="modal-footer">
                                    <p>Date: {new Date().toLocaleString()}</p>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={resetForm}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='history mt-5 d-flex flex-column'>
                    <button type="button" class="btn btn-link d-flex justify-content-end" onClick={() => setshowHistory(prev => !prev)}>{
                        (showHistory === true ? "Hide Transaction History" : "Show Transaction History")}
                    </button>
                    {showHistory && (
                        <div className="mt-4">
                            <h2 className="namehistory fs-4 mb-3"><u>Latest Transaction History:</u></h2>
                            <ul className="list-group">
                                {transactionHistory.map((transaction, index) => (
                                    <li className="list-group-item d-flex justify-content-start" key={index}>
                                        <strong>{index + 1}.</strong> &emsp; {transaction.date}: {transaction.amount} {transaction.sendCurrency} = {transaction.exchangeAmount} {transaction.receiveCurrency}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

            </form>
            <div>
            </div>
        </div>
    );
};

export default Form;
