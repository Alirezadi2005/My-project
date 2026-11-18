import axios from 'axios';
import { useEffect, useState } from 'react';
import './HomePage.css';
import { Header } from '../../components/Header';
import { ProductsGrid } from './ProductsGrid';
import { useSearchParams } from 'react-router';

export function HomePage({ cart, loadCart }) {
  const [searchParams] = useSearchParams();

  const search = searchParams.get('search');
  // make axios available in console.
  window.axios = axios;
  const [products, setProducts] = useState([]);

  // axios is a cleaner way of fetch
  useEffect(() => {
    const getHomeData = async () => {
      const urlPath = search ? `/api/products?search=${search}` : '/api/products';
      const response = await axios.get(urlPath);
      
      setProducts(response.data);
    }

    getHomeData();
    // values from outside useEffect should be in dependency array.
  }, [search]);

  return (
    <>
      <title>Ecommerce Project</title>

      <link rel="icon" type="image/svg+xml" href="home-favicon.png" />

      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />
      </div>
    </>
  );
}