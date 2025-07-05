import toast from 'react-hot-toast';

// Utility functions for consistent toast notifications throughout the app
export const toastUtils = {
  // Success notifications
  success: (message) => {
    return toast.success(message, {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    });
  },

  // Error notifications
  error: (message) => {
    return toast.error(message, {
      duration: 4000,
      style: {
        background: '#EF4444',
        color: '#fff',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
      },
    });
  },

  // Loading notifications
  loading: (message) => {
    return toast.loading(message, {
      style: {
        background: '#6B7280',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Info notifications
  info: (message) => {
    return toast(message, {
      duration: 3000,
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Warning notifications
  warning: (message) => {
    return toast(message, {
      duration: 4000,
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Promise-based notifications (useful for async operations)
  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong!',
    });
  },

  // Custom toast with custom styling
  custom: (message, options = {}) => {
    return toast(message, {
      duration: 3000,
      style: {
        background: '#363636',
        color: '#fff',
        fontWeight: '500',
        ...options.style,
      },
      ...options,
    });
  },

  // Dismiss all toasts
  dismiss: () => {
    toast.dismiss();
  },

  // Dismiss specific toast
  dismissById: (toastId) => {
    toast.dismiss(toastId);
  },
};

export default toastUtils;
