import { useState } from "react";

interface ModalConfig {
  isOpen: boolean;
  title: string;
  content: string | JSX.Element;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}

const useModal = () => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    content: "",
    confirmText: "Continuar",
    cancelText: "Cancelar",
    onConfirm: () => {},
  });

  const openModal = (
    title: string,
    content: string | JSX.Element,
    onConfirm: () => void,
    confirmText: string = "Continuar",
    cancelText: string = "Cancelar"
  ) => {
    setModalConfig({
      isOpen: true,
      title,
      content,
      confirmText,
      cancelText,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return { modalConfig, openModal, closeModal };
};

export default useModal;