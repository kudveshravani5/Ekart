import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "./skeleton";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart } from "../../redux/productSlice";

const ProductCard = ({ product = {}, loading = false }) => {
  const [cart, setLocalCart] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productImg, productName } = product;

  const price = Number(
    String(product.productPrice ?? product.Productprice ?? 0).replace(/,/g, ""),
  );

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/cart", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setLocalCart(res.data.cart); // update local state
        dispatch(setCart(res.data.cart));
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();
  }, []);

   const addToCart = async (productId) => {
    if (!accessToken) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/cart/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success("Product added to Cart");
        dispatch(setCart(res.data.cart));
        setLocalCart(res.data.cart);
      }
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Failed to add product to cart",
      );
    }
  };
   const saveForLater = async (productId) => {
  if (!accessToken) {
    toast.error("Please login first");
    navigate("/login");
    return;
  }
  try {
    const res = await axios.post(
      `http://localhost:5000/api/v1/cart/save-for-later`,
      { productId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (res.data?.success) {
      toast.success(res.data.message || "Saved for later");
      const updatedCart = res.data.cart || cart;
      dispatch(setCart(updatedCart));
      setLocalCart(updatedCart);
    } else {
      toast.error(res.data?.message || "Failed to save for later");
    }
  } catch (error) {
    if (!error.response) {
    // Network error
    toast.error("Cannot connect to server. Please try again later.");
  } else {
    toast.error(error.response?.data?.message || "Failed to save for later");
  }
}
 };

   const moveToCart = async (productId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/cart/move-to-cart`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      toast.success(res.data.message);
      dispatch(setCart(res.data.cart));
      setLocalCart(res.data.cart);
      // update state
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to move to cart");
    }
  };
   const removeSaveForLater = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/cart/save-for-later/remove`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: { productId },
        },
      );
      toast.success(res.data.message);
      dispatch(setCart(res.data.cart));
      setLocalCart(res.data.cart);
      // update state
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove");
    }
  };

  return (
    <div className="space-y-4">
      {/*Product Card*/}
      <div className="shadow-lg rounded-lg overflow-hidden h-max">
        <div className="w-full h-full aspect-square overflow-hidden">
          {loading ? (
            <Skeleton className="w-full h-full rounded-lg" />
          ) : (
            <img
              onClick={() => navigate(`/products/${product._id}`)}
              src={productImg?.[0]?.url}
              alt=""
              className="w-full h-full transition-transform duration-300 hover:scale-105 object-cover cursor-pointer"
            />
          )}
        </div>

        {loading ? (
          <div className="p-2 space-y-2 my-2">
            <Skeleton className="w-[200px] h-4" />
            <Skeleton className="w-[100px] h-4" />
            <Skeleton className="w-[150px] h-8" />
          </div>
        ) : (
          <div className="px-2 space-y-1">
            <h1 className="font-semibold h-12 line-clamp-2">{productName}</h1>
            <h2 className="font-bold">₹{price.toLocaleString()}</h2>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => addToCart(product._id)}
                className="bg-pink-600 text-white mb-3 w-full cursor-pointer hover:bg-pink-500"
              >
                <ShoppingCart />
                Add to Cart
              </Button>
              <Button
                onClick={() => saveForLater(product._id)}
                className="bg-yellow-500 text-white w-full hover:bg-yellow-400"
              >
                Save for Later
              </Button>
            </div>
          </div>
        )}
      </div>

{/* Save for Later Items — AFTER (fixed) */}
{Array.isArray(cart?.saveForLater) && cart.saveForLater.length > 0 && (
  <div className="mt-4">
    <h2 className="font-bold mb-2">Save For Later</h2>
    {cart.saveForLater.map((item) => (
      <div
        key={item.productId?._id}
        className="flex justify-between items-center p-2 border rounded mb-2"
      >
        <span>{item.productId?.productName}</span>
        <div className="space-x-2">
          <button
            onClick={() => moveToCart(item.productId?._id)}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Move to Cart
          </button>
          <button
            onClick={() => removeSaveForLater(item.productId?._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      </div>
    ))}
  </div>
)}
      {/* Save for Later Items */}
      {Array.isArray((cart?.saveForLater) &&
        cart.saveForLater.length > 0 && (
          <div className="mt-4">
            <h2 className="font-bold mb-2">Save For Later</h2>
            {cart.saveForLater.map((item) => (
              <div
                key={item.productId?._id}
                className="flex justify-between items-center p-2 border rounded mb-2"
              >
                <span>{item.productId?.productName}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => moveToCart(item.productId?._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeSaveForLater(item.productId?._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ),
      )}
    </div>
  );
};

export default ProductCard;
