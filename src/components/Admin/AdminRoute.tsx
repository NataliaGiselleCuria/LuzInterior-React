import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

interface Props {
    children: ReactNode;
}

const AdminRoute = ({ children }:Props) => {

    const { userActive } = useUser();

    return userActive?.role=== 'admin' ? children : <Navigate to="/" />;
    
};

export default AdminRoute;