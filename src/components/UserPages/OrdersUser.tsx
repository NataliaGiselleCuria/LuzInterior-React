import { useEffect } from "react";
import { useUser } from "../../context/UserContext"
import { useNavigate } from "react-router-dom";

const OrdersUser = () => {

  const { isLogin } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate('/mayoristas');
    }
  }, [isLogin, navigate]);

  return (
    <div className="cont container">
      <h2>Tus pedidos</h2>
    </div>
  )
}

export default OrdersUser
