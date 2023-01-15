type KeysOfType<T, E> = {
    [K in keyof T]: T[K] extends E ? K : never;
}[keyof T];
export interface RippleOptions {
    color?: 'auto' | string;
    debug?: boolean;
    duration?: number;
    easing?: string;
    multi?: boolean;
    on?: KeysOfType<HTMLElementEventMap, MouseEvent>;
    opacity?: number;
    rate?: (rate: number) => number;
}
export {};
