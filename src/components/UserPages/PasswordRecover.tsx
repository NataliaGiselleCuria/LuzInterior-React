
import { useForm } from "react-hook-form";
import { useUser } from "../../context/UserContext";
import { useState } from "react";

interface RecoverInput {
  email: ''
}

interface Props {
  setRecoverCort: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordRecover: React.FC<Props> = ({ setRecoverCort }) => {

  const { recoverPassword } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const { register, handleSubmit } = useForm<RecoverInput>();

  const handleRecover = async (data: RecoverInput) => {
    setMessage("");
    setLoading(true);

    try {
      const result = await recoverPassword(data.email);
      setMessage(result.message);

    } catch (error) {
      setMessage("Hubo un error al intentar restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit(handleRecover)}>
        <div className="form-inputs">
          <label>Ingrese su email</label>
          <input
            id="email"
            {...register('email', { required: true })}>
          </input>
        </div>
        <p>Se le enviará un email para que pueda regenerar su contraseña.</p>
        <button className="general-button">Enviar</button>
      </form>
      <button className="no-button" onClick={() => setRecoverCort(false)}>Cancelar</button>
      {loading &&
        <div className="spinner-grow text-secondary" role="status">
          <span className="visually-hidden">Enviando...</span>
        </div>
      }
      {message && <p className="recover-pass">{message}</p>}
    </>
  )
}

export default PasswordRecover
