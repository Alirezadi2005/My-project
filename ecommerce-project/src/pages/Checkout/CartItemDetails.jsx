import { formatMoney } from '../../utils/money';
import axios from 'axios';
import { useState } from 'react';

export function CartItemDetails({ cartItem, loadCart }) {
  const [isUpdateQuntity, setIsUpdateQuantity] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const updateQuantity = async () => {    
    isUpdateQuntity && await axios.put(`/api/cart-items/${cartItem.productId}`, {
      quantity: Number(quantity)
    });

    await loadCart();

    if (isUpdateQuntity) {
      setIsUpdateQuantity(false);
    } else {
      setIsUpdateQuantity(true);
    }
  };

  const updateQuantityKeyDown = (event) => {
    const keyPressed = event.key;
    if (keyPressed === 'Enter') {
      updateQuantity();

    } else if (keyPressed === 'Escape') {
      setIsUpdateQuantity(false);
      setQuantity(cartItem.quantity);
    }
  };

  const setQuantityInput = (event) => {
    setQuantity(event.target.value);
  };

  const deleteCartItem = async () => {
    await axios.delete(`/api/cart-items/${cartItem.productId}`);

    await loadCart();
  };
  
  return (
    <>
      <img className="product-image"
        src={cartItem.product.image} />

      <div className="cart-item-details">
        <div className="product-name">
          {cartItem.product.name}
        </div>
        <div className="product-price">
          {formatMoney(cartItem.product.priceCents)}
        </div>
        <div className="product-quantity">
          <span>
            Quantity: {
            isUpdateQuntity ? <input className='update-quantity-input' type="text" onChange={setQuantityInput} value={quantity} onKeyDown={updateQuantityKeyDown} /> : <span className="quantity-label">{cartItem.quantity}</span>
            }       
          </span>          
          <span className="update-quantity-link link-primary" onClick={updateQuantity}>
            Update
          </span>
          <span className="delete-quantity-link link-primary" onClick={deleteCartItem}>
            Delete
          </span>
        </div>
      </div>
    </>
  )
}