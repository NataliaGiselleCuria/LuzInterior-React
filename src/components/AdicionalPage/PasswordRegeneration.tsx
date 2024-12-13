import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useApi } from "../../context/ApiProvider";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();
      setMessage(result.message);
      setTimeout(() => {
         navigate("/mayoristas");
      }, 1000);

    } catch (error) {
      setMessage("Hubo un error al intentar restablecer la contraseña.");
    }
  };

  return (
    <div className="cont container">
      <h2>Restablecer contraseña</h2>
      {token ? (
        <form onSubmit={handleSubmit(handleResetPassword)}>
          <p>Ingrese su nueva contraseña:</p>
          <input
            type="password"
            {...register("newPassword", { required: true })}
          />
          <input
            type="password"
            {...register("confirmPassword", { required: true })}
          />
          <button type="submit">Restablecer contraseña</button>
        </form>
      ) : (
        <p>El token no es válido o ha expirado.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};


export default PasswordRegeneration
