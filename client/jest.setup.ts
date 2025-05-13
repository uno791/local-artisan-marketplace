// jest.setup.ts
import 'jest-canvas-mock';      // for any <canvas> usage
import 'whatwg-fetch';          // bring `fetch` into the Jest environment
import '@testing-library/jest-dom';

// mock out your config import so no real network calls to other endpoints happen
jest.mock('@/config', () => ({
  baseURL: 'http://localhost:3000',
}));

// polyfill TextEncoder/Decoder
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

// a bare‐bones ResizeObserver stub for any components that use it
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

// ── CHART.JS & REACT-CHARTJS-2 STUBS ──────────────────────────────────────────
// these ensure your <Bar> / <Line> / etc. render without touching real canvas
jest.mock('react-chartjs-2', () => ({
  Bar: () => null,
  Line: () => null,
  Pie: () => null,
  Doughnut: () => null,
  // add any other chart types you use…
}));

// prevent Chart.js from trying to register real controllers/platforms
jest.mock('chart.js', () => {
  const actual = jest.requireActual('chart.js');
  return {
    __esModule: true,
    ...actual,
    Chart: class {
      constructor() {}
      // stub out whatever methods tests might hit
      update() {}
      destroy() {}
    },
    // if you directly call registerables
    register: () => {},
  };
});

// ── HTML2CANVAS & JSPDF STUBS ────────────────────────────────────────────────
// prevents “getContext not implemented” and “jsPDF requires canvas” errors
jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({
      toDataURL: () => 'data:image/png;base64,stub',
    })
  ),
}));

jest.mock('jspdf', () => ({
  __esModule: true,
  jsPDF: jest.fn(() => ({
    addImage: jest.fn(),
    save: jest.fn(),
  })),
}));

// ── your existing sales‐data fetch spy ───────────────────────────────────────
const fakeSalesData = [
  { month: 1, monthName: 'January', total: 0 },
  { month: 2, monthName: 'February', total: 0 },
  { month: 3, monthName: 'March', total: 0 },
];

beforeAll(() => {
  jest
    .spyOn(global, 'fetch')
    .mockImplementation((input) => {
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
