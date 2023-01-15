# Ripple.js

Adds Material style ripple to buttons

#### <a href="https://jakiestfu.github.com/Ripple.js/demo/">View Demo</a>

## Installation

```html
npm install ripple.js
```

## Usage

Include jQuery, the ripple.css, and ripple.js into your page. Then upon initialization, you can activate ripple as follows:

```javascript
import { ripple } from 'ripple.js';

ripple('.btn', options);
```

## Options

```javascript
interface Options {
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
```

Elements can be overridden with their own default options:

```html
<a href="#" data-duration="5" data-color="red" data-opacity="1">
  Slow Red Ripple
</a>
```

## Building

```bash
$ npm install
$ npm run build
# Or with watch mode
$ npm run build:watch
```

## Caveats

- The element selected to contain a ripple will gain the following CSS properties:
  - `position: relative`
  - `transform: translate3d(0,0,0)`

## License

MIT
