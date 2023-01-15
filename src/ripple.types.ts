type KeysOfType<T, E> = {
  [K in keyof T]: T[K] extends E ? K : never;
}[keyof T];

export interface RippleOptions {
  /* Set the background color. If set to "auto", it will use the text color */
  color?: 'auto' | string;

  /* Turn Ripple.js logging on/off */
  debug?: boolean;

  /* The duration of the ripple */
  duration?: number;

  /* The CSS3 easing function of the ripple */
  easing?: string;

  /* Allow multiple ripples per element */
  multi?: boolean;

  /* The event to trigger a ripple effect */
  on?: KeysOfType<HTMLElementEventMap, MouseEvent>;

  /* The opacity of the ripple */
  opacity?: number;

  /* Filter function for modifying the speed of the ripple */
  rate?: (rate: number) => number;
}
