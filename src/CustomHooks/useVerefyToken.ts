import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import useModal from './useModal';

const useVerifyToken = () => {
    const { checkToken } = useUser();
    const navigate = useNavigate();
    const { openModal, closeModal } = useModal();
    const [isSessionValid, setIsSessionValid] = useState(true);

    const validateToken = async () => {
        const token = localStorage.getItem('user_token');

        if (!token) {
            await checkToken('', navigate);
            setIsSessionValid(false);
            return false;
        }

        try {
            const tokenResult = await checkToken(token, navigate);
            if (!tokenResult.success) {
                openModal("Sesión Expirada", "Tu sesión ha caducado. Por favor, inicia sesión nuevamente.", closeModal);
                setIsSessionValid(false);
                return false;
            }
            setIsSessionValid(true);
            return true;
        } catch (error) {
            openModal("Error", "Hubo un error al verificar el token.", closeModal);
            setIsSessionValid(false);
            return false;
        }
    };

    return { validateToken, isSessionValid };
};

export default useVerifyToken;