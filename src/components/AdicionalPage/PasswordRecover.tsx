
import { useForm } from "react-hook-form";
import { useUser } from "../../context/UserContext";
import { useState } from "react";

interface RecoverInput {
  email:''
}

const PasswordRecover = () => {
  
  const { recoverPassword } = useUser();
  const [message, setMessage] = useState<string>("");

  const { register, handleSubmit } = useForm<RecoverInput>();

  const handleRecover = async (data: RecoverInput) => {
    setMessage("");
    const result = await recoverPassword(data.email);
    setMessage(result.message);
  };

  return (
    <div className="cont container">
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit(handleRecover)}> 
        <p>Ingrese su email</p>
        <input 
        id="email"
        {...register('email', { required: true })}>
        </input>
        <p>Se le enviará un mail para que pueda regenerar su contraseña.</p>
        <button>Enviar</button>
      </form>
      
       {message && <p>{message}</p>}
    </div>
  )
}

export default PasswordRecover
