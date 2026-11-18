import './TrackingPage.css';
import { Header } from '../components/Header';
import { Link, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';


export function TrackingPage({ cart }) {
  const { orderId, productId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      const response = await axios.get(`/api/orders/${orderId}?expand=products`);
      setOrder(response.data);
    };

    fetchTrackingData();
  }, [orderId]);

  if (!order) {
    return null;
  }

  const orderProduct = order.products.find((product) => {
    return productId === product.productId;
  });

  const totalDeliveryTimeMs = orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;
  const timePassedMs = dayjs().valueOf() - order.orderTimeMs;
  let deliveryTimePercent = (timePassedMs / totalDeliveryTimeMs) * 100;
  if (deliveryTimePercent > 100) {
    deliveryTimePercent = 100;
  }

  console.log(totalDeliveryTimeMs)

  const isPreparing = deliveryTimePercent < 33;
  const isShipped = deliveryTimePercent >= 33 && deliveryTimePercent < 100;
  const isDelivered = deliveryTimePercent === 100;

  return (
    <>
      <title>Tracking</title>

      <link rel="icon" type="image/svg+xml" href="tracking-favicon.png" />

      <Header cart={cart} />

      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">
            {deliveryTimePercent >= 100 ? 'Delivered On ' : 'Arriving on '}{dayjs(orderProduct.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
          </div>

          <div className="product-info">
            {orderProduct.product.name}
          </div>

          <div className="product-info">
            Quantity: {orderProduct.quantity}
          </div>

          <img className="product-image" src={orderProduct.product.image} />

          <div className="progress-labels-container">
            <div className={`progress-label ${isPreparing && 'current-status'}`} >
              Preparing
            </div>
            <div className={`progress-label ${isShipped && 'current-status'}`}>
              Shipped
            </div>
            <div className={`progress-label ${isDelivered && 'current-status'}`}>
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{width: `${deliveryTimePercent}%`}}></div>
          </div>
        </div>
      </div>
    </>
  )
}