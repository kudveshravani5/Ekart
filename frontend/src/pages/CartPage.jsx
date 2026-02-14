import CartAssistant from "../components/CartAssistant";

const CartPage = () => {
  const accessToken = localStorage.getItem("accessToken");

  return (
    <div>
      <h1>Your Cart</h1>

      {/* Your cart items here */}

      <CartAssistant token={accessToken} />
    </div>
  );
};

export default CartPage;
