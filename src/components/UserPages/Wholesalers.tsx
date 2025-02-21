import { Link } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { useState } from "react";
import Register from './Register';
import Login from "./Login";
import logo from '../../assets/logo_nombre.png'
import PasswordRecover from "./PasswordRecover";

const Wholesalers = () => {
  const { isLogin } = useUser();
  const [registerCont, setRegisterCont] = useState(false);
  const [recoverCont, setRecoverCort] = useState(false);

  return (
      <div className="login">
        <Link to="/" className="close-login">← Volver</Link>
        <div className="login-text">
          <img src={logo} alt="logo Luz Interior"></img>
        </div>
        <div className="login-cont">
          <span className="back"></span>
          {!isLogin ? (
            <>
              {!registerCont && !recoverCont ? (
                <Login setRegisterCont={setRegisterCont} serRecoverCort={setRecoverCort} ></Login>
              ) : (
                <>
                {registerCont && <Register setRegisterCont={setRegisterCont} />}
                {recoverCont && <PasswordRecover setRecoverCort={setRecoverCort} />}
                </>
              )}
            </>
          ) : (
            <h2>Su sesión ya está iniciada</h2>
          )}
          <div/>
        </div>
        <h3>Espacio exclusivo para clientes mayoristas</h3>
      </div >
  )
}

export default Wholesalers
