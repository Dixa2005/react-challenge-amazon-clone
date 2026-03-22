import React, { useState, useEffect } from 'react';
import axios from './axios';
import './Orders.css'
import { useStateValue } from "./StateProvider";
import Order from './Order'

function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if(user) {
        axios.get(`/api/orders/${user.email}`)
        .then(response => {
            setOrders(response.data.map(orderDoc => ({
                id: orderDoc._id,
                data: {
                    amount: orderDoc.totalAmount * 100, // Make it compatible with original logic (cents)
                    created: orderDoc.createdAt ? new Date(orderDoc.createdAt).getTime() / 1000 : 0,
                    basket: orderDoc.items,
                    status: orderDoc.status // Extra tracking status feature
                }
            })));
        })
        .catch(err => console.error("Could not fetch orders", err));
    } else {
        setOrders([])
    }
  }, [user])

    return (
        <div className='orders'>
            <h1>Your Orders</h1>

            <div className='orders__order'>
                {orders?.map(order => (
                    <Order order={order} />
                ))}
            </div>
        </div>
    )
}

export default Orders
