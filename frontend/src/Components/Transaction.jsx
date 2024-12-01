import React, { useState, useEffect } from "react";

const Transaction = () => {
  const [balance, setBalance] = useState(0); // Wallet balance
  const [transactions, setTransactions] = useState([]); // Transaction history
  const [amount, setAmount] = useState(""); // Amount for adding/deducting money
  const [merchantId, setMerchantId] = useState(""); // Merchant ID for deductions
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch wallet balance
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

  // Fetch transactions
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

  // Add money to wallet
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
      setBalance(data.balance); // Update balance
      alert(data.message); // Show success message
      setAmount(""); // Clear amount input
    } catch (err) {
      alert(err.message);
    }
  };

  // Deduct money from wallet
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
      setBalance(data.balance); // Update balance
      alert(data.message); // Show success message
      setAmount(""); // Clear amount input
      setMerchantId(""); // Clear merchant ID input
    } catch (err) {
      alert(err.message);
    }
  };

  // Fetch wallet balance and transactions on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Ensure loading state is set
      await fetchBalance();
      await fetchTransactions();
    };
    fetchData();
  }, []);

  // Render loading or error
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


