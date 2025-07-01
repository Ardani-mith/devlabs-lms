// Button styles
export const buttonStyles = {
  primary: "px-8 py-3.5 bg-brand-purple text-white font-semibold rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50",
  secondary: "px-6 py-3 border-2 border-neutral-300 dark:border-neutral-600 text-base font-medium rounded-lg text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700/50 transition-colors focus:outline-none focus:ring-4 focus:ring-neutral-400/50",
  success: "px-8 py-3.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50",
  outline: "px-6 py-3.5 border-2 border-neutral-500/70 text-base font-medium rounded-lg text-white hover:bg-white/10 dark:hover:bg-black/20 transition-colors focus:outline-none focus:ring-4 focus:ring-neutral-500/50",
  disabled: "opacity-50 cursor-not-allowed",
} as const;

// Card styles
export const cardStyles = {
  main: "bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/70",
  content: "p-6 sm:p-8",
  section: "space-y-10",
  sidebar: "sticky top-[calc(var(--header-height,4rem)+2rem)] space-y-6",
} as const;

// Layout styles
export const layoutStyles = {
  container: "max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8",
  grid: "lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12 items-start",
  contentArea: "lg:col-span-8 xl:col-span-8 min-w-0 space-y-8 mb-8 lg:mb-0",
  sidebarArea: "hidden lg:block lg:col-span-4 xl:col-span-4 relative",
} as const;

// Text styles
export const textStyles = {
  heading: {
    h1: "text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3",
    h2: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-5",
    h3: "text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4",
  },
  body: {
    large: "text-lg sm:text-xl text-neutral-200 dark:text-neutral-300",
    base: "text-sm sm:text-base text-gray-700 dark:text-neutral-300",
    small: "text-xs text-gray-500 dark:text-neutral-400",
  },
  link: "font-semibold hover:underline transition-colors",
} as const;

// Status colors
export const statusColors = {
  selesai: "text-green-500 dark:text-green-400",
  sedang_dipelajari: "text-blue-500 dark:text-blue-400",
  selanjutnya: "text-gray-500 dark:text-neutral-400",
  terkunci: "text-gray-400 dark:text-neutral-500",
} as const;

// Badge styles
export const badgeStyles = {
  primary: "px-3.5 py-1.5 text-xs sm:text-sm font-medium bg-sky-100 text-sky-800 dark:bg-sky-700/40 dark:text-sky-200 rounded-full shadow-sm",
  secondary: "px-3.5 py-1.5 text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-700/40 dark:text-indigo-200 rounded-full shadow-sm",
  instructor: "ml-2 text-xs bg-brand-purple text-white px-2 py-0.5 rounded-full font-medium shadow-sm",
  preview: "ml-2.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-700/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold",
} as const;

// Animation classes
export const animationStyles = {
  fadeIn: "animate-fadeIn",
  slideUp: "animate-slideUp",
  scale: "transform hover:scale-105 transition-transform duration-300",
  spin: "animate-spin",
} as const;

// Form styles
export const formStyles = {
  input: "w-full p-3.5 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 text-sm shadow-sm",
  textarea: "w-full p-3.5 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 text-sm shadow-sm",
  label: "block text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-2",
} as const;

// Utility function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
}; 