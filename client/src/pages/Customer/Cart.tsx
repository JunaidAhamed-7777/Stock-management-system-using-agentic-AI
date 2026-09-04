import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loading, EmptyState, ErrorState } from "../../components/ui";

const CartPage: React.FC = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/orders/pending");
        setCartItems(response.data?.orderItems || []);
        setTotal(response.data?.totalAmount || 0);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch cart");
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item: any) => item.productId !== productId));
  };

  if (loading) {
    return <div className="p-8">Loading cart...</div>;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (cartItems.length === 0) {
    return <EmptyState
      title="Your Cart is Empty"
      description="Add products to your cart to get started."
    />;
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-medium text-gray-500 mb-4">Shopping Cart</h2>
        
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

        <div className="mt-8 pt-8 border-t">
          <div className="grid grid-cols-2 gap-4">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <button
            onClick={() => alert("Proceed to payment (not implemented for MVP)")}
            className="w-full bg-primary-600 hover:bg-primary-700 mt-4"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;