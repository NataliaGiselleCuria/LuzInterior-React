import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FormLogin } from '../../Interfaces/interfaces';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

interface Props {
    setRegisterCont: React.Dispatch<React.SetStateAction<boolean>>;
    serRecoverCort: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<Props> = ({ setRegisterCont, serRecoverCort }) => {

    const navigate = useNavigate();
    const { userLogin } = useUser();
    const { register, handleSubmit } = useForm<FormLogin>();
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (data: FormLogin) => {
        const { email, password } = data;
        const loginResult = await userLogin(email, password);

        if (loginResult.success) {
            setErrorMessage("");
            navigate(-1);
        } else {
            setErrorMessage(loginResult.message);
        }
    };

    return (

        <>
            <h2>Iniciar sesión</h2>
            <div><p>¿Eres un nuevo usuario?</p> <button className="no-button" onClick={() => setRegisterCont(true)}>Crear cuenta</button></div>
            <form onSubmit={handleSubmit(handleLogin)}>
                <div className="form-inputs">
                    <span>
                        <label htmlFor="email">Email*</label>
                        <input
                            id="email"
                            type='email'
                            {...register('email', { required: true })}>
                        </input>
                    </span>
                    <span>
                        <label htmlFor="password">Contraseña*</label>
                        <input
                            id="password"
                            type='password'
                            {...register('password', { required: true })}>
                        </input>
                    </span>
                </div>
                <button className="general-button">Ingresar</button>
            </form>

            <button className="no-button" onClick={() => serRecoverCort(true)}><p>¿Olvidaste tu contraseña?</p></button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </>
    )
}

export default Login
