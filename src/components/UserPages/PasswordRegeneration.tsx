import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useApi } from "../../context/ApiProvider";
import logo from '../../assets/logo_nombre.png'
import showPass from '../../assets/show-pass.png'
import hidddenPass from '../../assets/hidden-pass.png'

interface ResetPasswordInput {
  newPassword: string;
  confirmPassword: string;
}

const PasswordRegeneration = () => {

  const { dev } = useApi();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState<string>("");
  const { register, handleSubmit } = useForm<ResetPasswordInput>();
  const [visibilityPass, SetVisibilityPass] = useState(false);
  const [visibilityPass2, SetVisibilityPass2] = useState(false);

  const navigate = useNavigate();

  const handleResetPassword = async (data: ResetPasswordInput) => {
    if (data.newPassword !== data.confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    try {

      const response = await fetch(`${dev}/index.php?action=reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", },

        body: JSON.stringify({
          token,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Error inesperado.");
        return;
      }

      setMessage(result.message); // Éxito
      setTimeout(() => navigate("/"), 3000);

    } catch (error) {
      setMessage("Hubo un error al intentar restablecer la contraseña.");
    }
  };

  return (
    <div className="login">
      <div className="login-text">
        <img src={logo} alt="logo Luz Interior"></img>
      </div>
      <div className="login-cont">
        <span className="back"></span>
        <h2>Restablecer contraseña</h2>
        {token ? (
          <form onSubmit={handleSubmit(handleResetPassword)}>
            <div className="form-inputs">
              <span className='password'>
                <label>Ingrese su nueva contraseña:</label>
                <input
                   type={visibilityPass ? "text" : "password"}
                  {...register("newPassword", { required: true })}
                />
                {!visibilityPass ?
                                    <img className="visibility-pass" onClick={() => SetVisibilityPass(true)} src={hidddenPass} alt="contraseña no visible"></img>
                                    :
                                    <img className="visibility-pass" onClick={() => SetVisibilityPass(false)} src={showPass} alt="contraseña visible"></img>
                                }
              </span>
              <span className='password'>
                <label>Repita su nueva contraseña</label>
                <input
                  type={visibilityPass2 ? "text" : "password"}
                  {...register("confirmPassword", { required: true })}
                  
                />
                {!visibilityPass2 ?
                                    <img className="visibility-pass" onClick={() => SetVisibilityPass2(true)} src={hidddenPass} alt="contraseña no visible"></img>
                                    :
                                    <img className="visibility-pass" onClick={() => SetVisibilityPass2(false)} src={showPass} alt="contraseña visible"></img>
                                }
              </span>
            </div>
            <button className="general-button">Restablecer contraseña</button>
          </form>
        ) : (
          <p>El token no es válido o ha expirado.</p>
        )}
        {message && <p className="recover-pass">{message}</p>}
        <Link to="/login" className="no-button">Iniciar sesión</Link>
      </div>
    </div>
  );
};


export default PasswordRegeneration
