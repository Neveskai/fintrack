import '@testing-library/jest-dom';

if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = function structuredClone<T>(value: T): T {
    if (value === undefined) return value;
    try {
      return JSON.parse(JSON.stringify(value)) as T;
    } catch {
      return value;
    }
  };
}
