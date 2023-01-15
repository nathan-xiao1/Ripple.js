import type { ripple } from './ripple';

declare global {
  interface Window {
    ripple: ripple;
  }
}
