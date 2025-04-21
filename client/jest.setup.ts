jest.mock("@/config", () => ({
  baseURL: "http://localhost:3000"
}));


import '@testing-library/jest-dom';

// Polyfill TextEncoder for Node test environment
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, {
  TextEncoder,
  TextDecoder,
});

