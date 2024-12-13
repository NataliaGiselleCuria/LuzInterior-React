import { Link, useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useUser } from "../../context/UserContext"
import { useState } from "react";
import { LoginFormInputs } from "../../Interfaces/interfaces";

const Wholesalers = () => {

  const { isLogin, userLogin } = useUser();
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const handleLogin = async (data: LoginFormInputs) => {
    const { email, password } = data;
    const loginResult = await userLogin(email, password);

    if (loginResult.success) {
      setErrorMessage("");
      navigate(from, { replace: true });
    } else {
      setErrorMessage(loginResult.message);
    }
  };

  return (
    <div className="cont container">
      <div>
        {!isLogin ?
          <>
            <h2>Iniciar sesión</h2>
            <p>¿Eres un nuevo usuario?<span><Link to='/registro'>Crear cuenta</Link></span></p>
            <form onSubmit={handleSubmit(handleLogin)}>
              <span>
                <label htmlFor="email">Email*</label>
                <input
                  id="email"
                  type='email'
                  placeholder="ingrese su email"
                  {...register('email', { required: true })}>
                </input>
              </span>
              <span>
                <label htmlFor="password">Contraseña*</label>
                <input
                  id="password"
                  type='password'
                  placeholder="ingrese su contraseña"
                  {...register('password', { required: true })}>
                </input>
              </span>
              <button>Ingresar</button>
            </form>

            <Link to='/recuperar_contraseña'><p>¿Olvidaste tu contraseña?</p></Link>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </>
          :
          <h2>Su sesión ya está iniciada</h2>
        }
      </div>
    </div>
  )
}

export default Wholesalers
