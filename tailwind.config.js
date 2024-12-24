/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",

    // "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
  	extend: {
  		fillAvailable: {
  			width: 'webkit-fill-available',
  			height: 'webkit-fill-available'
  		},
  		colors: {
  			'brand/primary-blue': '#2563eb',
  			'brand/wahsed-blue': '#e2f1ff',
  			'brand/purple': '#92b1f5',
  			'brand/neautrals': '#001120',
  			'primary-blue/Light': '#e6f6f4',
  			'primary-blue/Light :hover': '#d9f2ef',
  			'primary-blue/Light :active': '#b0e4dd',
  			'primary-blue/Normal': '#00a991',
  			'primary-blue/Normal :hover': '#009883',
  			'primary-blue/Normal :active': '#008774',
  			'primary-blue/Dark': '#007f6d',
  			'primary-blue/Dark :hover': '#006557',
  			'primary-blue/Dark :active': '#004c41',
  			'primary-blue/Darker': '#003b33',
  			'brand-primary-blue/brand-primary-blue-1': '#e9effd',
  			'brand-primary-blue/brand-primary-blue-2': '#cbdafa',
  			'brand-primary-blue/brand-primary-blue-3': '#a1bcf6',
  			'brand-primary-blue/brand-primary-blue-4': '#769df2',
  			'brand-primary-blue/brand-primary-blue-5': '#4c7fef',
  			'brand-primary-blue/brand-primary-blue-6': '#2563eb',
  			'brand-primary-blue/brand-primary-blue-7': '#1f54c8',
  			'brand-primary-blue/brand-primary-blue-8': '#1a46a7',
  			'brand-primary-blue/brand-primary-blue-9': '#153886',
  			'brand-primary-blue/brand-primary-blue-10': '#112d6a',
  			'Brand-washed-blue/brand-washed-blue-1': '#fcfeff',
  			'Brand-washed-blue/brand-washed-blue-2': '#f8fcff',
  			'Brand-washed-blue/brand-washed-blue-3': '#f3f9ff',
  			'Brand-washed-blue/brand-washed-blue-4': '#edf6ff',
  			'Brand-washed-blue/brand-washed-blue-5': '#e7f4ff',
  			'Brand-washed-blue/brand-washed-blue-6': '#e2f1ff',
  			'Brand-washed-blue/brand-washed-blue-7': '#c0cdd9',
  			'Brand-washed-blue/brand-washed-blue-8': '#a0abb5',
  			'Brand-washed-blue/brand-washed-blue-9': '#818991',
  			'Brand-washed-blue/brand-washed-blue-10': '#666c73',
  			'Brand-Purple/brand-purple-1': '#f4f7fe',
  			'Brand-Purple/brand-purple-2': '#e5ecfd',
  			'Brand-Purple/brand-purple-3': '#d0ddfb',
  			'Brand-Purple/brand-purple-4': '#bacef9',
  			'Brand-Purple/brand-purple-5': '#a6bff7',
  			'Brand-Purple/brand-purple-6': '#92b1f5',
  			'Brand-Purple/brand-purple-7': '#7c96d0',
  			'Brand-Purple/brand-purple-8': '#687eae',
  			'Brand-Purple/brand-purple-9': '#53658c',
  			'Brand-Purple/brand-purple-10': '#42506e',
  			'Brand-neutrals/brand-neutrals-1': '#e6e7e9',
  			'Brand-neutrals/brand-neutrals-2': '#c2c6c9',
  			'Brand-neutrals/brand-neutrals-3': '#91999f',
  			'Brand-neutrals/brand-neutrals-4': '#5e6973',
  			'Brand-neutrals/brand-neutrals-5': '#2e3c48',
  			'Brand-neutrals/brand-neutrals-6': '#001120',
  			'Brand-neutrals/brand-neutrals-7': '#000e1b',
  			'Brand-neutrals/brand-neutrals-8': '#000c17',
  			'Brand-neutrals/brand-neutrals-9': '#000a12',
  			'Brand-neutrals/brand-neutrals-10': '#00080e',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require("tw-elements/dist/plugin.cjs"),
    require("tailwindcss-animate"),
  ],
};
