import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tcf: {
          // Primary Palette
          navy: '#172B4D',
          ocean: '#087FC1',
          'ocean-hover': '#076ea7',
          cyan: '#10C9D4',
          orange: '#F28C28',
          yellow: '#F5C518',
          // Neutral Palette
          warmWhite: '#FCFBF8',
          cream: '#F5F2EA',
          lightGrey: '#F0F1F2',
          charcoal: '#292D32',
          muted: '#73777D',
          border: '#E8E5DE',
        },
      },
      fontFamily: {
        heading: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        editorial: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      maxWidth: {
        'content': '1240px',
      },
      boxShadow: {
        'subtle': '0 2px 10px -2px rgba(23, 43, 77, 0.05)',
        'warm': '0 10px 30px -5px rgba(23, 43, 77, 0.07)',
        'warm-hover': '0 20px 40px -10px rgba(23, 43, 77, 0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
