type KeysOfType<T, E> = {
  [K in keyof T]: T[K] extends E ? K : never;
}[keyof T];

export interface Options {
  debug?: boolean;
  on?: KeysOfType<HTMLElementEventMap, MouseEvent>;
  opacity?: number;
  color?: 'auto' | string;
  multi?: boolean;
  duration?: number;
  rate?: (rate: number) => number;
  easing?: string;
}
