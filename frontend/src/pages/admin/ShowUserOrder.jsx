import OrderCard from '@/components/OrderCard'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const ShowUserOrder = () => {
    const [userOrder, setUserOrder] = useState(null);
    const params = useParams();
    useEffect(() => {
    const getUserOrders = async () => {
  const accessToken = localStorage.getItem("accessToken")

  const res = await axios.get(
    `${import.meta.env.VITE_URL}/api/v1/orders/user-order/${params.userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )

  if (res.data.success) {
    setUserOrder(res.data.orders)
  }
}


  getUserOrders()
}, [])

console.log(userOrder);

  return (
    <>
    <OrderCard userOrder={userOrder}/>
    </>
  )
}

export default ShowUserOrder;