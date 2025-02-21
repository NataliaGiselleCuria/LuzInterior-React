import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useApi } from "../../context/ApiProvider";
import logo from '../../assets/logo_nombre.png'

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
      setTimeout(() => navigate("/login"), 5000);

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
              <span>
                <label>Ingrese su nueva contraseña:</label>
                <input
                  type="password"
                  {...register("newPassword", { required: true })}
                />
              </span>
              <span>
                <label>Repita su nueva contraseña</label>
                <input
                  type="password"
                  {...register("confirmPassword", { required: true })}
                />
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
