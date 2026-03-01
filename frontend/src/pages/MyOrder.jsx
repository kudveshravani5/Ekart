import axios from "axios";
import React, { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState(null);
  
  useEffect(() => {
    const getUserOrders = async () => {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setUserOrder(res.data.orders);
      }
    };

    getUserOrders();
  }, []);
  return (
    <>
    <div className="pl-[350px] py-20"></div>
    <OrderCard userOrder={userOrder}/>
    </>
  );
};

export default MyOrder;
