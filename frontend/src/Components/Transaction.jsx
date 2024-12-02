import React, { useState, useEffect } from "react";

const Transaction = () => {
  const [balance, setBalance] = useState(0); 
  const [transactions, setTransactions] = useState([]); 
  const [amount, setAmount] = useState(""); 
  const [merchantId, setMerchantId] = useState(""); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const fetchBalance = async () => {
    try {
      const response = await fetch("http://localhost:4000/wallet/balance", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch wallet balance");
      }

      const data = await response.json();
      setBalance(data.balance);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/wallet/transactions",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data.transactions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMoney = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/wallet/add-money", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add money to wallet");
      }

      const data = await response.json();
      setBalance(data.balance); 
      alert(data.message); 
      setAmount(""); 
    } catch (err) {
      alert(err.message);
    }
  };

  const deductMoney = async () => {
    if (!amount || amount <= 0 || !merchantId) {
      alert("Please enter a valid amount and merchant ID.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/wallet/deduct-money",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            merchant_id: merchantId,
            total_price: parseFloat(amount),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to deduct money");
      }

      const data = await response.json();
      setBalance(data.balance); 
      alert(data.message); 
      setAmount(""); 
      setMerchantId(""); 
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      await fetchBalance();
      await fetchTransactions();
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Wallet</h1>
      <p><strong>Current Balance:</strong> ${balance.toFixed(2)}</p>

      <div>
        <h2>Add Money</h2>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={addMoney}>Add Money</button>
      </div>

      <div>
        <h2>Deduct Money</h2>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Merchant ID"
          value={merchantId}
          onChange={(e) => setMerchantId(e.target.value)}
        />
        <button onClick={deductMoney}>Deduct Money</button>
      </div>

      <div>
        <h2>Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction._id}>
                <p>
                  <strong>Type:</strong> {transaction.type}
                </p>
                <p>
                  <strong>Amount:</strong> ${transaction.total_price.toFixed(2)}
                </p>
                <p>
                  <strong>Merchant ID:</strong> {transaction.merchant_id}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transaction;


