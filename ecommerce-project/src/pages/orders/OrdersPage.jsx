import './OrdersPage.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { OrdersGrid } from './OrdersGrid';

export function OrdersPage({ cart, loadCart }) {
  const [orders, setOrders] = useState([]);

  // the inner function in useEffect should not return anything but a cleanup function. in this case its returning a promise because of async await.
  useEffect(() => {
    const getOrdersData = async () => {
      const response = await axios.get('/api/orders?expand=products');
      setOrders(response.data);
    };

    getOrdersData();
  }, []);

  return (
    <>
      <title>Orders</title>

      <link rel="icon" type="image/svg+xml" href="orders-favicon.png" />

      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <OrdersGrid orders={orders} loadCart={loadCart} />
      </div>
    </>
  )
}