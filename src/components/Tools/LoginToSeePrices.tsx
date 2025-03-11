import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const LoginToSeePrices = () => {
    const { isLogin } = useUser();
    const [showMessage, setShowMessage] = useState(!isLogin);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!isLogin) {
            const timer = setTimeout(() => {
                setShowMessage(false);
                setTimeout(() => setIsVisible(false), 900);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isLogin]);

    if (!isVisible) return null;

    return (
        <div className={`login-message ${showMessage ? "show" : "hide"}`}>
            <span>
                <Link to="/login">Inicie sesión</Link>
                <span> para acceder a los precios de los productos.</span>
            </span>
        </div>
    );
};

export default LoginToSeePrices;