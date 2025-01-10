import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

interface Props {
    children: ReactNode;
}

const AdminRoute = ({ children }:Props) => {
    const { userActive, isLogin } = useUser();

    if (userActive?.role === 'admin') {
        return children;
    }

    console.log(`Error en el rol del usuario: ${userActive?.role}`);
    return <Navigate to="/" />;
    
};

export default AdminRoute;