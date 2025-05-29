import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Atau 'media' jika hanya ingin preferensi sistem
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Tambahkan warna kustom untuk light dan dark mode jika perlu
      colors: {
        // Contoh warna dari gambar Anda (perlu disesuaikan)
        'brand-purple': '#6B46C1', // Warna ungu utama
        'sidebar-bg-light': '#FFFFFF',
        'sidebar-bg-dark': '#1F2937', // Contoh warna gelap untuk sidebar
        'card-bg-light': '#FFFFFF',
        'card-bg-dark': '#2D3748',
        'text-light-primary': '#1A202C',
        'text-dark-primary': '#E2E8F0',
        'text-light-secondary': '#4A5568',
        'text-dark-secondary': '#A0AEC0',
      },
    },
  },
  plugins: [
    // Plugin Aceternity UI jika ada
    // require('aceternity-ui-plugin')
  ],
}
export default config