// jest.setup.ts
import 'jest-canvas-mock';
import 'whatwg-fetch';
import '@testing-library/jest-dom';

jest.mock('@/config', () => ({
  baseURL: 'http://localhost:3000',
}));

import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

// ─────────────────────────────────────────────────────────────────────────────
// Polyfill ResizeObserver so Recharts/<ResponsiveContainer> can mount under JSDOM
class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    // no-op
  }
  observe(target: Element) {
    // no-op
  }
  unobserve(target: Element) {
    // no-op
  }
  disconnect() {
    // no-op
  }
}
// install on window (what Recharts actually checks)
Object.defineProperty(window, 'ResizeObserver', {
  value: ResizeObserver,
  writable: true,
});

// also put it on global, in case some imports use that
;(global as any).ResizeObserver = ResizeObserver;
// ─────────────────────────────────────────────────────────────────────────────

const fakeSalesData = [
  { month: 1, monthName: 'January', total: 0 },
  { month: 2, monthName: 'February', total: 0 },
  { month: 3, monthName: 'March', total: 0 },
];

beforeAll(() => {
  jest.spyOn(global, 'fetch').mockImplementation((input) => {
    const url = typeof input === 'string' ? input : input.url;
    if (url.endsWith('/sales-data')) {
      return Promise.resolve(
        new Response(JSON.stringify(fakeSalesData), {
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
