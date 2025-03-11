import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useApi } from '../../context/ApiProvider';

interface Props {
    children: ReactNode;
}

const AdminRoute = ({ children }:Props) => {
    const { userActive } = useApi();

    if (userActive?.role === 'admin') {
        return children;
    }
    return <Navigate to="/" />;
    
};

export default AdminRoute;