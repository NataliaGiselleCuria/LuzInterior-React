import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

interface Props {
    children: ReactNode;
}

const AdminRoute = ({ children }:Props) => {
    const { userActive } = useUser();

    console.log(userActive)

    if (userActive?.role === 'admin') {

        console.log(userActive.role)
        return children;
    }
    return <Navigate to="/" />;
    
};

export default AdminRoute;