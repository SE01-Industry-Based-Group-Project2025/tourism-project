import { useConfirmContext } from './ConfirmProvider';

export const useConfirm = () => {
  const { confirm } = useConfirmContext();
  return confirm;
};
