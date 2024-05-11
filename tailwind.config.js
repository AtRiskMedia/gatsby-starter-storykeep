/** @type {import('tailwindcss').Config} */
module.exports = {
  //safelist: [{ pattern: /.*/ }],
  content: [
    './src/pages/**/*.{js,jsx,tsx}',
    './src/components/**/*.{js,jsx,tsx}',
    './src/shopify-components/**/*.{js,jsx,tsx}',
    './src/custom/**/*.{js,jsx,tsx}',
    './src/templates/**/*.{js,jsx,tsx}',
  ],
  safelist: [
    //variants: ['xs', 'md', 'xl'],
    {
      pattern:
        /^(w|min-w|h|min-h|basis|grow|col|auto-cols|justify-items|self|flex|shrink|grid-rows|auto-rows|justify-self|place-content|order|row|gap|content|place-items|grid-cols|grid-flow|justify|items|place-self)-/,
    },
    {
      pattern: /^\!?(rotate)-/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^(scale)-/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml)-/,
    },
    {
      pattern:
        /^text-(center|left|right|justify|start|end|xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|ellipsis|clip|wrap|nowrap|balance|pretty)$/,
    },
    {
      pattern: /^text-(inherit|current|transparent|black|white|[a-z]*-\d*)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern:
        /^bg-(bottom|center|left|left-bottom|left-top|right|right-bottom|right-top|top|repeat|no-repeat|repeat-x|repeat-y|repeat-round|repeat-space|auto|cover|contain)$/,
    },
    {
      pattern: /^(bg|text)-my[a-z]*$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^bg-(inherit|current|transparent|black|white|[a-z]*-\d*)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern:
        /^decoration-(inherit|current|transparent|black|white|[a-z]*-\d*)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^shadow-(inherit|current|transparent|black|white|[a-z]*-\d*)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^shadow-(sm|md|lg|xl|2xl|inner|none)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern:
        /^decoration-([01248]|from-front|auto|dotted|double|dashed|wavy)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^outline-([01248]|none|dashed|dotted|double|offset-\d)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^outline-(inherit|current|transparent|black|white|[a-z]*-\d*)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^ring-(\d|inset)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^ring-offset-\d$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern:
        /^ring-offset-(inherit|current|transparent|black|white|[a-z]*-\d*)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^ring-(inherit|current|transparent|black|white|[a-z]*-\d*)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^border-(-[xylrtb])?(\d|[xylrtb]|([xylrtb]-\d))$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^border-(solid|dashed|dotted|double|hidden|none)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^border-(inherit|current|transparent|black|white|[a-z]*-\d*)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^stroke-\d$/,
    },
    {
      pattern: /^underline-offset-(auto|[01248])$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^leading-([3456789]|10|none|tight|snug|normal|relaxed|loose)$/,
    },
    {
      pattern: /^stroke-(inherit|current|transparent|black|white|[a-z]*-\d*)$/,
    },
    {
      pattern: /^fill-(inherit|current|transparent|black|white|[a-z]*-\d*)$/,
    },
    {
      pattern:
        /^(ring|outline|border|underline|no-underline|overline|line-through|shadow)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern:
        /^(sr-only|not-sr-only|transition|shrink|grow|rounded|truncate|italic|not-italic|uppercase|lowercase|capitalize|normal-case|static|fixed|absolute|relative|sticky|visible|invisible|collapse|isolate)$/,
    },
    {
      pattern:
        /^(block|inline-block|inline|flex|inline-flex|table|inline-table|table-caption|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row-group|table-row|flow-root|grid|inline-grid|contents|list-item|hidden)$/,
    },
    {
      pattern:
        /^(animate|transition|duration|ease|delay|rounded|gap|pointer-events|font|leading|whitespace|break|tracking|list|indent|line-clamp|align|opacity|aspect|object|float|object|columns|clear|overflow|box|isolation|overscroll|z|inset|start|end|top|right|bottom|left)-/,
    },
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 1s ease-in',
        fadeInUp: 'fadeInUp 1s ease-in',
        fadeInRight: 'fadeInRight 1s ease-in',
        fadeInLeft: 'fadeInLeft 1s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '.25' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translate3d(0, 10px, 0)', opacity: '.25' },
          '100%': { transform: 'translate3d(0, 0, 0)', opacity: '1' },
        },
        fadeInRight: {
          '0%': { transform: 'translate3d(10px,0, 0)', opacity: '.25' },
          '100%': { transform: 'translate3d(0, 0, 0)', opacity: '1' },
        },
        fadeInLeft: {
          '0%': { transform: 'translate3d(-10px,0, 0)', opacity: '.25' },
          '100%': { transform: 'translate3d(0, 0, 0)', opacity: '1' },
        },
      },
      lineHeight: {
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
      },
      screens: {
        xs: '600px',
        md: '801px',
        xl: '1367px',
      },
      spacing: {
        r1: 'calc(var(--scale) * .25rem)',
        r2: 'calc(var(--scale) * .5rem)',
        r3: 'calc(var(--scale) * .75rem)',
        r4: 'calc(var(--scale) * 1rem)',
        r5: 'calc(var(--scale) * 1.25rem)',
        r6: 'calc(var(--scale) * 1.5rem)',
        r7: 'calc(var(--scale) * 1.75rem)',
        r8: 'calc(var(--scale) * 2rem)',
        r9: 'calc(var(--scale) * 2.25rem)',
        r10: 'calc(var(--scale) * 2.5rem)',
        r11: 'calc(var(--scale) * 2.75rem)',
        r12: 'calc(var(--scale) * 3rem)',
        r14: 'calc(var(--scale) * 3.5rem)',
        r16: 'calc(var(--scale) * 4rem)',
        r20: 'calc(var(--scale) * 5rem)',
      },
      fontFamily: {
        action: ['Font-Action', 'Georgia', 'Times New Roman', 'Times', 'serif'],
        main: [
          'Font-Main',
          'Arial',
          'Helvetica Neue',
          'Helvetica',
          'sans-serif',
        ],
      },
      fontSize: {
        rxs: 'calc(var(--scale) * 0.75rem)',
        rsm: 'calc(var(--scale) * 0.875rem)',
        rbase: 'calc(var(--scale) * 1rem)',
        rlg: 'calc(var(--scale) * 1.125rem)',
        rxl: 'calc(var(--scale) * 1.25rem)',
        r2xl: 'calc(var(--scale) * 1.5rem)',
        r3xl: 'calc(var(--scale) * 1.875rem)',
        r4xl: 'calc(var(--scale) * 2.5rem)',
        r5xl: 'calc(var(--scale) * 3rem)',
        r6xl: 'calc(var(--scale) * 3.75rem)',
        r7xl: 'calc(var(--scale) * 4.5rem)',
        r8xl: 'calc(var(--scale) * 6rem)',
        r9xl: 'calc(var(--scale) * 8rem)',
      },
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        99: '99',
      },
      colors: {
        mywhite: '#fcfcfc',
        myoffwhite: '#e3e3e3',
        myallwhite: '#ffffff',
        mylightgrey: '#a7b1b7',
        myblue: '#293f58',
        mygreen: '#c8df8c',
        myorange: '#f58333',
        mydarkgrey: '#393d34',
        myblack: '#10120d',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
