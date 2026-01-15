import { toast as sonnerToast } from 'sonner';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { type ReactNode } from 'react';

interface ToastOptions {
  description?: ReactNode;
  duration?: number;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function showSuccess(message: string, options?: ToastOptions) {
  return sonnerToast.success(message, {
    icon: <CheckCircle className="size-4 text-green-500" />,
    ...options,
  });
}

export function showError(message: string, options?: ToastOptions) {
  return sonnerToast.error(message, {
    icon: <XCircle className="size-4 text-destructive" />,
    duration: 5000,
    ...options,
  });
}

export function showWarning(message: string, options?: ToastOptions) {
  return sonnerToast.warning(message, {
    icon: <AlertTriangle className="size-4 text-yellow-500" />,
    ...options,
  });
}

export function showInfo(message: string, options?: ToastOptions) {
  return sonnerToast.info(message, {
    icon: <Info className="size-4 text-blue-500" />,
    ...options,
  });
}

export function showLoading(message: string, options?: ToastOptions) {
  return sonnerToast.loading(message, options);
}

export function updateToast(
  toastId: string | number,
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  options?: ToastOptions
) {
  const icons = {
    success: <CheckCircle className="size-4 text-green-500" />,
    error: <XCircle className="size-4 text-destructive" />,
    warning: <AlertTriangle className="size-4 text-yellow-500" />,
    info: <Info className="size-4 text-blue-500" />,
  };

  sonnerToast[type](message, { id: toastId, icon: icons[type], ...options });
}

export function dismissToast(toastId?: string | number) {
  sonnerToast.dismiss(toastId);
}

export function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  }
) {
  return sonnerToast.promise(promise, messages);
}

export { sonnerToast as toast };
