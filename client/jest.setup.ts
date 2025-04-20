import '@testing-library/jest-dom';

// Polyfill TextEncoder for Node test environment
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, {
  TextEncoder,
  TextDecoder,
});
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:3000', // <-- mock this as needed
  },
  writable: false,
});

