import React, { useState, useEffect } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Items in the cart
  const [totalPrice, setTotalPrice] = useState(0); // Total cart price
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch cart from the backend
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setError(null); // Clear any previous errors
      setLoading(true); // Set loading state

      const response = await fetch("http://localhost:4000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch cart");
      }

      const data = await response.json();
      setCartItems(data.data.items || []); // Ensure cartItems is an array
      setTotalPrice(data.data.total_price || 0); // Ensure totalPrice has a default value
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add item to the cart
  const addItemToCart = async (menuItemId, quantity = 1) => {
    try {
      const response = await fetch("http://localhost:4000/cart/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menu_item_id: menuItemId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item to cart");
      }

      await fetchCart(); // Refresh cart after adding an item
    } catch (err) {
      setError(err.message);
    }
  };

  // Remove item from the cart
  const removeItemFromCart = async (menuItemId) => {
    try {
      const response = await fetch("http://localhost:4000/cart/remove", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menu_item_id: menuItemId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove item from cart");
      }

      await fetchCart(); // Refresh cart after removing an item
    } catch (err) {
      setError(err.message);
    }
  };

  // Clear the cart
  const clearCart = async () => {
    try {
      const response = await fetch("http://localhost:4000/cart/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to clear cart");
      }

      await fetchCart(); // Refresh cart after clearing
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch cart data on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Render loading, error, or cart data
  if (loading) {
    return <div>Loading your cart...</div>;
  }

  if (error) {
    return (
      <div>
        <div>Error: {error}</div>
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Start adding some items!</p>
      ) : (
        <div>
          {cartItems.map((cartItem) => (
            <div key={cartItem.menu_item_id._id} style={{ marginBottom: "1rem" }}>
              <p>
                <strong>{cartItem.menu_item_id.name}</strong>
              </p>
              <p>Price: ${Number(cartItem.menu_item_id.price || 0).toFixed(2)}</p>
              <p>Quantity: {cartItem.quantity}</p>
              <div>
                <button
                  onClick={() => addItemToCart(cartItem.menu_item_id._id, 1)}
                >
                  +
                </button>
                <button
                  onClick={() =>
                    cartItem.quantity > 1
                      ? addItemToCart(cartItem.menu_item_id._id, -1)
                      : removeItemFromCart(cartItem.menu_item_id._id)
                  }
                >
                  -
                </button>
                <button
                  onClick={() => removeItemFromCart(cartItem.menu_item_id._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <h2>Total Price: ${Number(totalPrice || 0).toFixed(2)}</h2>
        </div>
      )}
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

export default Cart;
