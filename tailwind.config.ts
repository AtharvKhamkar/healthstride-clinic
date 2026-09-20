import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ========================================
      // COLORS
      // ========================================
      colors: {
        primary: {
          DEFAULT: '#003357',
          light: '#004A7B',
          dark: '#001D35',
          container: '#004A7B',
          fixed: '#D0E4FF',
          'fixed-dim': '#9CCAAF',
        },
        secondary: {
          DEFAULT: '#5B5A87',
          light: '#CCCAFE',
          dark: '#43426E',
          container: '#CCCAFE',
          fixed: '#E2DDFF',
          'fixed-dim': '#C4C2F5',
        },
        tertiary: {
          DEFAULT: '#003921',
          light: '#105233',
          dark: '#002111',
          container: '#105233',
          fixed: '#B0F1C7',
          'fixed-dim': '#95D5AC',
        },
        surface: {
          DEFAULT: '#F9F9FF',
          bright: '#F9F9FF',
          'container-lowest': '#FFFFFF',
          'container-low': '#F0F3FF',
          container: '#E7EEFF',
          'container-high': '#DEE8FF',
          'container-highest': '#D8E3FB',
          dim: '#CFDAF2',
          variant: '#D8E3FB',
          tint: '#296294',
        },
        background: '#F9F9FF',
        error: {
          DEFAULT: '#BA1A1A',
          container: '#FFDAD6',
        },
        success: {
          DEFAULT: '#105233',
          container: '#B0F1C7',
        },
        warning: {
          DEFAULT: '#F39C12',
          container: '#FEF5E7',
        },
        info: '#004A7B',
        text: {
          primary: '#111C2D',
          secondary: '#41474F',
          tertiary: '#727780',
          disabled: '#A8ABB2',
        },
        border: {
          DEFAULT: '#C1C7D1',
          light: '#F0F0F0',
          dark: '#D0D0D0',
        },
        input: {
          fill: '#F4F8FB',
          border: '#E0E8EF',
          placeholder: '#909BA1',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.7)',
          light: 'rgba(255, 255, 255, 0.6)',
        },
      },

      // ========================================
      // FONT FAMILIES
      // ========================================
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },

      // ========================================
      // FONT SIZE
      // ========================================
      fontSize: {
        'display-lg': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.02em' }],
        'headline-lg': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.01em' }],
        'headline-lg-mobile': ['1.75rem', { lineHeight: '2.25rem' }],
        'headline-md': ['1.5rem', { lineHeight: '2rem' }],
        'title-lg': ['1.25rem', { lineHeight: '1.75rem' }],
        'body-lg': ['1rem', { lineHeight: '1.5rem' }],
        'body-md': ['0.875rem', { lineHeight: '1.25rem' }],
        'label-md': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
      },

      // ========================================
      // SPACING
      // ========================================
      spacing: {
        '0.5': '0.125rem', // 2px
        '1.5': '0.25rem',  // 4px
        '2.5': '0.5rem',   // 8px
        '3.5': '0.75rem',  // 12px
      },

      // ========================================
      // BORDER RADIUS
      // ========================================
      borderRadius: {
        '4xs': '0.125rem', // 2px
        '3xs': '0.25rem',  // 4px
        '2xs': '0.5rem',   // 8px
        xs: '0.75rem',     // 12px
        sm: '1rem',        // 16px
        DEFAULT: '1rem',   // 16px
        md: '1rem',        // 16px
        lg: '1rem',        // 16px
        xl: '1.5rem',      // 24px
        full: '9999px',
      },

      // ========================================
      // BOX SHADOW
      // ========================================
      boxShadow: {
        'bento': '0 4px 20px rgba(30, 41, 59, 0.04)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'soft': '0 2px 8px rgba(30, 41, 59, 0.04)',
      },

      // ========================================
      // MAX WIDTH
      // ========================================
      maxWidth: {
        '4xl': '36rem', // 576px for forms
        'sidebar': '16rem', // 256px
      },

      // ========================================
      // ASPECT RATIO
      // ========================================
      aspectRatio: {
        'card': '200 / 260',
      },
    },
  },
  plugins: [],
};
export default config;