import { RippleOptions } from './ripple.types';

const defaults: Required<RippleOptions> = {
  debug: false,
  on: 'mousedown',
  opacity: 0.4,
  color: 'auto',
  multi: false,
  duration: 0.7,
  rate: (pxPerSecond: number) => pxPerSecond,
  easing: 'linear',
};

export function ripple(selector: string, _options: RippleOptions = {}) {
  const sharedOptions: Required<RippleOptions> = {
    ...defaults,
    ..._options,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const log = (...args: any[]) => {
    if (sharedOptions.debug && console && console.log) {
      console.log(...args);
    }
  };

  // Callback to create the ripple effect
  const trigger = function (
    this: HTMLElement,
    event: MouseEvent,
    sharedOptions: RippleOptions
  ) {
    let rippleElement: HTMLElement | undefined;

    // Get data-* from the element
    const dataset = Object.fromEntries(
      Object.entries(this.dataset).map(([key, value]) => {
        const _key = key as keyof RippleOptions;
        if (value && defaults[_key] !== null && defaults[_key] !== undefined) {
          if (typeof defaults[_key] === 'number') {
            return [key, parseFloat(value)];
          } else if (typeof defaults[_key] === 'boolean') {
            return [key, value === 'true'];
          }
        }
        return [key, value];
      })
    );

    const options: Required<RippleOptions> = {
      ...sharedOptions,
      ...dataset,
    };

    this.classList.add('has-ripple');

    // Create the ripple element
    if (
      options.multi ||
      (!options.multi && this.querySelectorAll('.ripple').length === 0)
    ) {
      rippleElement = document.createElement('span');
      rippleElement.classList.add('ripple');
      this.appendChild(rippleElement);

      log('Create: Ripple');

      // Set ripple size
      if (!rippleElement.clientHeight && !rippleElement.clientWidth) {
        const size = Math.max(this.offsetWidth, this.offsetHeight);
        rippleElement.style.height = `${size}px`;
        rippleElement.style.width = `${size}px`;
        log('Set: Ripple size');
      }

      // Give the user the ability to change the rate of the animation
      // based on element width
      if (options.rate && typeof options.rate == 'function') {
        // rate = pixels per second
        const rate = Math.round(rippleElement.clientWidth / options.duration);

        // new amount of pixels per second
        const filteredRate = options.rate(rate);

        // Determine the new duration for the animation
        const newDuration = rippleElement.clientWidth / filteredRate;

        // Set the new duration if it has not changed
        if (options.duration.toFixed(2) !== newDuration.toFixed(2)) {
          log('Update: Ripple Duration', {
            from: options.duration,
            to: newDuration,
          });
          options.duration = newDuration;
        }
      }

      // Set the color and opacity
      const color =
        options.color == 'auto' ? getComputedStyle(this).color : options.color;

      const css: Pick<
        CSSStyleDeclaration,
        | 'animationDuration'
        | 'animationTimingFunction'
        | 'background'
        | 'opacity'
      > = {
        animationDuration: `${options.duration.toString()}s`,
        animationTimingFunction: options.easing,
        background: color,
        opacity: options.opacity.toString(),
      };

      if (rippleElement) {
        for (const [key, value] of Object.entries(css)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rippleElement.style[key as any] = value;
        }

        log('Set: Ripple CSS', css);
      }
    }

    // Ensure we always have the ripple element
    if (!options.multi) {
      log('Set Ripple Element');
      rippleElement = this.querySelector<HTMLElement>('.ripple') ?? undefined;
    }

    if (rippleElement) {
      // Kill animation
      log('Destroy: Ripple Animation');
      rippleElement.classList.remove('ripple-animate');

      // Retrieve coordinates
      const elementRect = this.getBoundingClientRect();
      const x =
        event.pageX -
        elementRect.left -
        window.scrollX -
        rippleElement.clientWidth / 2;
      const y =
        event.pageY -
        elementRect.top -
        window.scrollY -
        rippleElement.clientHeight / 2;

      /**
       * We want to delete the ripple elements if we allow multiple so we dont sacrifice any page
       * performance. We don't do this on single ripples because once it has rendered, we only
       * need to trigger paints thereafter.
       */
      if (options.multi) {
        log('Set: Ripple animationend event');

        'animationend webkitAnimationEnd oanimationend MSAnimationEnd'
          .split(' ')
          .forEach((animationEndEvent) => {
            rippleElement &&
              rippleElement.addEventListener(
                animationEndEvent,
                () => {
                  log('Note: Ripple animation ended');
                  log('Destroy: Ripple');
                  rippleElement && this.removeChild(rippleElement);
                },
                {
                  once: true,
                }
              );
          });
      }

      // Set position and animate
      log('Set: Ripple location');
      log('Set: Ripple animation');
      rippleElement.style.top = `${y}px`;
      rippleElement.style.left = `${x}px`;
      rippleElement.classList.add('ripple-animate');
    }
  };

  document.querySelectorAll(selector).forEach((element) => {
    if (element instanceof HTMLElement) {
      element.addEventListener(sharedOptions.on, (event) =>
        trigger.call(element, event, sharedOptions)
      );
    }
  });

  return trigger;
}
