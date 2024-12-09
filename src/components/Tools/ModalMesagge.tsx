import { ReactNode } from "react";
import './tools.css';

interface ModalProps {
    isOpen: boolean;
    title: string;
    content?: ReactNode;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ModalMesagge: React.FC<ModalProps> = ({
    isOpen,
    title,
    content,
    onClose,
    onConfirm,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h4>{title}</h4>
                <div className="modal-body">{content}</div>
                <div className="modal-footer">
                    {onConfirm && (
                        <button className="btn-confirm" onClick={onConfirm}>
                            {confirmText}
                        </button>
                    )}
                    <button className="btn-cancel" onClick={onClose}>
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalMesagge
