// jest.setup.ts
import 'jest-canvas-mock';
import 'whatwg-fetch';
import '@testing-library/jest-dom';

jest.mock('@/config', () => ({
  baseURL: 'http://localhost:3000',
}));

import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

// polyfill ResizeObserver (needed by Recharts’ ResponsiveContainer)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

// mock out window.alert so tests that trigger an alert won’t blow up
window.alert = jest.fn();

// sample data for your charts
const fakeSalesData = [
  { month: 1, monthName: 'January', total: 0 },
  { month: 2, monthName: 'February', total: 0 },
  { month: 3, monthName: 'March', total: 0 },
];

beforeAll(() => {
  jest.spyOn(global, 'fetch').mockImplementation((input) => {
    const url = typeof input === 'string' ? input : input.url;

    // your sales-data endpoint
    if (url.endsWith('/sales-data')) {
      return Promise.resolve(
        new Response(JSON.stringify(fakeSalesData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // EditProductPage’s initial load: GET /product/:id
    if (/\/product\/\d+$/.test(url)) {
      const productPayload = {
        product_id: 123,
        product_name: 'Updated Painting',
        description: 'Updated description',
        price: 500,
        image_url: '/placeholder-image.jpg',
        username: 'seller123',
        width: 80,
        height: 100,
        weight: 10,
        tags: ['example'],
        stock_count: 5,
        delivery_method: 'Delivery',
      };
      return Promise.resolve(
        new Response(JSON.stringify(productPayload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // EditProductPage’s save: POST (or PUT) /editproduct/:id
    if (/\/editproduct\/\d+$/.test(url)) {
      return Promise.resolve(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    return Promise.reject(new Error(`Unhandled fetch call to ${url}`));
  });
});

afterAll(() => {
  (global.fetch as jest.Mock).mockRestore();
});
