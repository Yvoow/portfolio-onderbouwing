import forms from '@tailwindcss/forms'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'google': 'rgba(9, 30, 66, 0.08) 0px 0px 0px 1px, 0 2px 4px rgb(0 0 0 / 20%), 0 -1px 0px rgb(0 0 0 / 2%)',
        'google-focussed': '0 1px 2px rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%)',
        'google-up': '0 -2px 4px rgb(0 0 0 / 20%), 0 -1px 0px rgb(0 0 0 / 2%)',
        'bordered': 'rgba(9, 30, 66, 0.05) 0px 0px 0px 1px, rgba(9, 30, 66, 0.07) 0px 2px 4px 1px',
        'card': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'card-hover': '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
        'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },

      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          "Segoe UI",
          'Roboto'
        ],
        serif: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          "Segoe UI",
          'Roboto'
        ],
        mono: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          "Segoe UI",
          'Roboto'
        ],
        display: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          "Segoe UI",
          'Roboto'
        ],
        body: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          "Segoe UI",
          'Roboto'
        ],
      },

      colors: {
        // Modern dark theme
        'main-dark': '#121826',
        'secondary-dark': '#1F2937',
        'tertiary-dark': '#374151',
        'text-dark': '#F9FAFB',
        'text-dark-secondary': '#E5E7EB',
        'text-dark-tertiary': '#9CA3AF',

        // Modern light theme
        'main-light': '#F9FAFB',
        'secondary-light': '#F3F4F6',
        'tertiary-light': '#E5E7EB',
        'text-light': '#111827',
        'text-light-secondary': '#4B5563',
        'text-light-tertiary': '#9CA3AF',

        // Brand colors
        'primary': '#3B82F6',
        'primary-dark': '#2563EB',
        'primary-light': '#60A5FA',
        'accent': '#8B5CF6',
        'accent-dark': '#7C3AED',
        'accent-light': '#A78BFA',
        'success': '#10B981',
        'warning': '#F59E0B',
        'danger': '#EF4444',
        'info': '#3B82F6',
      },

      animation: {
        'spin': 'spin 1.5s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },

      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },

      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [forms]
}

