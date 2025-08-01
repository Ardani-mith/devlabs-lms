/**
 * UI Components Index
 * Central export for all reusable UI components
 */

// ====================================================================
// Form Components
// ====================================================================
export { FormField } from './form/FormField';
export { Button } from './form/Button';

// ====================================================================
// Card Components
// ====================================================================
export { Card, CardHeader, CardContent, CardFooter } from './cards/Card';
export { StatCard } from './cards/StatCard';

// ====================================================================
// Filter Components
// ====================================================================
export { SearchAndFilter } from './filters/SearchAndFilter';

// ====================================================================
// Loading Components
// ====================================================================
export {
  LoadingSpinner,
  LoadingOverlay,
  Skeleton,
  PageLoading,
  CourseCardSkeleton,
  ListSkeleton
} from './loading/LoadingComponents';

// ====================================================================
// Modal Components
// ====================================================================
export { Modal, ConfirmationModal } from './modal/Modal';

// ====================================================================
// Alert Components
// ====================================================================
export {
  Alert,
  Toast,
  BannerAlert
} from './alerts/AlertComponents';

// ====================================================================
// Utility Components
// ====================================================================
export { default as SafeImage } from './SafeImage';
export { BackgroundGradient } from './background-gradient';

// ====================================================================
// Type Exports
// ====================================================================
export type { 
  FormFieldProps, 
  ButtonProps, 
  StatCardData,
  CourseFilters 
} from '@/lib/types'; 