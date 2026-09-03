import React, { useEffect, useState } from "react";
import axios from "axios";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/api/orders/pending");
        setCartItems(response.data?.orderItems || []);
        setTotal(response.data?.totalAmount || 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item: any) => item.productId !== productId));
  };

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-medium text-gray-500 mb-4">Shopping Cart</h2>
        
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {cartItems.map((item: any) => (
              <div key={item.productId} className="p-4 border rounded">
                <h4>{item.productName}</h4>
                <p>${item.price}</p>
                <p>Qty: {item.quantity}</p>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="mt-2 text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 pt-8 border-t">
          <div className="grid grid-cols-2 gap-4">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <Button
            onClick={() => alert("Proceed to payment (not implemented for MVP)")}
            className="w-full bg-primary-600 hover:bg-primary-700 mt-4"
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;