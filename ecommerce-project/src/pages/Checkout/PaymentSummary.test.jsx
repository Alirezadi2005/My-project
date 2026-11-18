import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { PaymentSummary } from './PaymentSummary';
import axios from 'axios';
import { useLocation } from 'react-router';


vi.mock('axios');

describe('Payment summary component', () => {
  let loadCart;
  let paymentSummary;
  let user;

  function Location() {
    const location = useLocation();
    return (
      // this contains url path.
      <div data-testid='url-path'>{location.pathname}</div>
    );
  };

  beforeEach(async () => {
    loadCart = vi.fn();

    paymentSummary = {
      "totalItems": 4, "productCostCents": 5365, "shippingCostCents": 499, "totalCostBeforeTaxCents": 5864, "taxCents": 586, "totalCostCents": 6450
    };

    user = userEvent.setup();
  });

  it('displays payment summary correctly', async () => {
    render(
      <MemoryRouter>
        <PaymentSummary loadCart={loadCart} paymentSummary={paymentSummary} /> <Location />
      </MemoryRouter>
    );

    const totalItems = screen.getByTestId('total-items');
    const productCost = screen.getByTestId('product-cost');
    const shippingCost = screen.getByTestId('shipping-cost');
    const totalCostBeforeTax = screen.getByTestId('total-cost-before-tax');
    const taxCost = screen.getByTestId('tax-cost');
    const totalCost = screen.getByTestId('total-cost');

    expect(totalItems).toHaveTextContent('4');

    expect(productCost).toHaveTextContent('$53.65');

    expect(shippingCost).toHaveTextContent('$4.99');

    expect(totalCostBeforeTax).toHaveTextContent('$58.64');

    expect(taxCost).toHaveTextContent('$5.86');

    expect(totalCost).toHaveTextContent('$64.50');

    const placeOrderButton = screen.getByTestId('place-order-button');

    await user.click(placeOrderButton);

    expect(axios.post).toHaveBeenCalledWith('/api/orders');

    expect(loadCart).toHaveBeenCalled();

    const location = screen.getByTestId('url-path');
    expect(location).toHaveTextContent('/orders');
  });
});