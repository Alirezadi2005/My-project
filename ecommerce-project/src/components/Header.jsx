import { NavLink, useNavigate, useSearchParams } from 'react-router';
import logoWhite from '../assets/images/logo-white.png';
import mobileLogoWhite from '../assets/images/mobile-logo-white.png';
import cartIcon from '../assets/images/icons/cart-icon.png';
import searchIcon from '../assets/images/icons/search-icon.png';
import './Header.css';
import { useState } from 'react';

// Link (instead of a) dont reload page when we go to another page
export function Header({ cart }) {
  const [searchParams] = useSearchParams();

  const searchText = searchParams.get('search');

  const navigate = useNavigate();

  const [inputText, setInputText] = useState(searchText || '');

  const saveInputText = (event) => {
    setInputText(event.target.value);
  };

  const searchProduct = () => {
    () => {}
    navigate(`/?search=${inputText}`);
  }

  let totalQuantity = 0;

  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });

  return (
    <>
      <div className="header">
        <div className="left-section">
          <NavLink to="/" className="header-link">
            <img className="logo"
              src={logoWhite} />
            <img className="mobile-logo"
              src={mobileLogoWhite} />
          </NavLink>
        </div>

        <div className="middle-section">
          <input className="search-bar" type="text" placeholder="Search" value={inputText} onChange={saveInputText} />

          <button className="search-button" onClick={searchProduct} >
            <img className="search-icon" src={searchIcon} />
          </button>
        </div>

        <div className="right-section">
          <NavLink className="orders-link header-link" to="/orders">

            <span className="orders-text">Orders</span>
          </NavLink>

          <NavLink className="cart-link header-link" to="/checkout">
            <img className="cart-icon" src={cartIcon} />
            <div className="cart-quantity">{totalQuantity}</div>
            <div className="cart-text">Cart</div>
          </NavLink>
        </div>
      </div>
    </>
  )
}