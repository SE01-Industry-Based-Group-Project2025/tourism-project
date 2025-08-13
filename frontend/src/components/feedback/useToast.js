import { useToastContext } from './ToastProvider';

export const useToast = () => {
  const { addToast } = useToastContext();

  const toast = {
    success: (message, duration = 5000) => addToast(message, 'success', duration),
    error: (message, duration = 5000) => addToast(message, 'error', duration),
    info: (message, duration = 5000) => addToast(message, 'info', duration),
  };

  return toast;
};
