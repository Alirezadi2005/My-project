import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Product } from './Product';

// this will mock entire npm package.
vi.mock('axios');

// render renders component in a fake page.
// in tests we should not contact a real backend.
// mock: crate a fake version function.
// screen let us check fake page.
// beforeEch is a test hook.
// mock the implementaion: mock do whatever we want.

describe('test suite: product component', () => {
  let product;
  let loadCart;
  let user;

  beforeEach(() => {
    product = {
      id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      image: "images/products/athletic-cotton-socks-6-pairs.jpg",
      name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
      rating: {
        stars: 4.5,
        count: 87
      },
      priceCents: 1090,
      keywords: ["socks", "sports", "apparel"]
    };

    loadCart = vi.fn();

    user = userEvent.setup();
  });

  it('displays product details correctly', () => {
    render(<Product product={product} loadCart={loadCart} />);

    expect(
      screen.getByText('Black and Gray Athletic Cotton Socks - 6 Pairs')
    ).toBeInTheDocument();

    expect(
      screen.getByText('$10.90')
    ).toBeInTheDocument();


    expect(
      screen.getByTestId('product-image')
    ).toHaveAttribute('src', 'images/products/athletic-cotton-socks-6-pairs.jpg');

    expect(
      screen.getByText('87')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('product-rating-image')
    ).toHaveAttribute('src', 'images/ratings/rating-45.png');
  });

  it('adds a product to the cart', async () => {
    render(<Product product={product} loadCart={loadCart} />);
    const addToCartButton = screen.getByTestId('add-to-cart-button');
    // it takes time to load page after clicking so user.click is asynchronous code and returns promise.
    await user.click(addToCartButton);

    expect(axios.post).toHaveBeenCalledWith(
      '/api/cart-items',
      {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1
      }
    );

    expect(loadCart).toHaveBeenCalled();
  });

  it('select product quantity correctly', async () => {
    render(<Product product={product} loadCart={loadCart} />);
    const quantitySelector = screen.getByTestId('product-quantity');
    const addToCartButton = screen.getByTestId('add-to-cart-button');

    expect(quantitySelector).toHaveValue('1');

    await user.selectOptions(quantitySelector, '3');
    expect(quantitySelector).toHaveValue('3');

    await user.click(addToCartButton);
    expect(axios.post).toHaveBeenCalledWith('/api/cart-items', {
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 3
    });

    expect(loadCart).toHaveBeenCalled();
  });
});