import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/es/modal';
export const modalConfirm = (message?: string, options?: ModalFuncProps) => {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: '请确认',
      content: message,
      onOk() {
        resolve(null);
      },
      onCancel() {
        reject();
      },
      ...options,
    });
  });
};
