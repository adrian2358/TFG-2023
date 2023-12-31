import { create } from 'zustand';

type SnackOptions = {
  visible?: boolean;
  message: string;
  type: 'success' | 'error';
};

type ShowSnackOptions = Omit<SnackOptions, 'visible'>;

type ModalOptions = {
  visible?: boolean;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm(): Promise<void>;
};

interface ModalStore {
  snackOptions: SnackOptions;
  showSnackMessage: (options: ShowSnackOptions) => void;
  hideSnackMessage: () => void;
  modalOptions: ModalOptions;
  showConfirmationModal: (options: ModalOptions) => void;
  closeConfirmationModal: () => void;
}

const DEFAULT_MODAL_OPTS = {
  content: '',
  confirmText: '',
  cancelText: '',
  onConfirm: async () => {},
};

export const useModalStore = create<ModalStore>((set, get) => ({
  snackOptions: {
    visible: false,
    message: '',
    type: 'success',
  },
  modalOptions: DEFAULT_MODAL_OPTS,
  showSnackMessage: (options: ShowSnackOptions) => {
    set({
      snackOptions: {
        ...options,
        visible: true,
      },
    });
  },
  hideSnackMessage: () => {
    set({
      snackOptions: {
        ...get().snackOptions,
        visible: false,
      },
    });
  },
  showConfirmationModal: (options: ModalOptions) => {
    set({
      modalOptions: {
        ...options,
        visible: true,
      },
    });
  },
  closeConfirmationModal: () => {
    set({
      modalOptions: {
        ...get().modalOptions,
        visible: false,
      },
    });
  },
}));
