import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Product } from './Product';
import { HomePage } from './HomePage';

vi.mock('axios');

describe('Home page component', () => {
  let loadCart;
  let user;

  beforeEach(() => {
    loadCart = vi.fn();

    user = userEvent.setup();

    axios.get.mockImplementation(async (urlPath) => {
      if (urlPath === '/api/products') {
        return {
          data: [
            {
              id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
              image: "images/products/athletic-cotton-socks-6-pairs.jpg",
              name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
              rating: {
                stars: 4.5,
                count: 87
              },
              priceCents: 1090,
              keywords: ["socks", "sports", "apparel"]
            },
            {
              id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
              image: "images/products/intermediate-composite-basketball.jpg",
              name: "Intermediate Size Basketball",
              rating: {
                stars: 4,
                count: 127
              },
              priceCents: 2095,
              keywords: ["sports", "basketballs"]
            }
          ]
        }
      }
    });
  });

  it('displays the products correctly', async () => {
    render(
      <MemoryRouter>
        <HomePage cart={[]} loadCart={loadCart} />
      </MemoryRouter>
    );

    // find is for asynchronous code, it will wait to find elements.
    const productContainers = await screen.findAllByTestId('product-container');

    expect(productContainers.length).toBe(2);

    expect(
      // within search in a specific element.
      within(productContainers[0])
        .getByText('Black and Gray Athletic Cotton Socks - 6 Pairs')
    ).toBeInTheDocument();

    expect(
      within(productContainers[1])
        .getByText('Intermediate Size Basketball')
    ).toBeInTheDocument();
  });

  it('Add to cart button works', async () => {
    render(
      <MemoryRouter>
        <HomePage loadCart={loadCart} cart={[]} />
      </MemoryRouter>
    );

    const productContainers = await screen.findAllByTestId('product-container');

    const addToCartButton1 = await within(productContainers[0]).findByTestId('add-to-cart-button');
    const quantitySelector1 = await within(productContainers[0]).findByTestId('product-quantity');
    await user.selectOptions(quantitySelector1, '2');
    await user.click(addToCartButton1);

    const addToCartButton2 = await within(productContainers[1]).findByTestId('add-to-cart-button');
    const quantitySelector2 = await within(productContainers[1]).findByTestId('product-quantity');
    await user.selectOptions(quantitySelector2, '3');
    await user.click(addToCartButton2);

    expect(loadCart).toHaveBeenCalledTimes(2);

    expect(axios.post).toHaveBeenCalledTimes(2);

    expect(axios.post).toHaveBeenNthCalledWith(1, '/api/cart-items', {
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2
    });

    expect(axios.post).toHaveBeenNthCalledWith(2, '/api/cart-items', {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 3
    });
  });
});