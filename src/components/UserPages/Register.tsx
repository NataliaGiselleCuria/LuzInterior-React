
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { FormRegister } from "../../Interfaces/interfaces";
import useModal from "../../CustomHooks/useModal";
import ModalMesagge from "../Tools/ModalMesagge";

interface Props {
    setRegisterCont: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: React.FC<Props> = ({ setRegisterCont }) => {

    const { userRegister } = useUser();
    const [errorMessage, setErrorMessage] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm<FormRegister>();
    const { modalConfig, openModal, closeModal } = useModal();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (data: FormRegister) => {
        if (data.password !== data.repeatPass) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);

        try {
            const result = await userRegister(data);

            if (result.success) {
                setErrorMessage("");
                setSuccess(true);
            } else {
                setErrorMessage(result.message);
            }

        } catch (error) {
            openModal("Error", "Ocurrió un error al intentar registrar el usuario. Intente nuevamente más tarde.", closeModal);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!success ? (
                <>
                    <h2>Nuevo usuario</h2>
                    <div><p>¿Ya tienes un usuario?</p><button className="no-button" onClick={() => setRegisterCont(false)}>Iniciar sesión</button></div>
                    <form onSubmit={handleSubmit(handleRegister)}>
                        <div className="form-inputs">
                            <span>
                                <input
                                    id="name"
                                    type='text'
                                    placeholder="Nombre comercial o personal"
                                    {...register('name', { required: true })}>
                                </input>
                            </span>
                            <span>
                                <input
                                    id="cuit"
                                    type='number'
                                    placeholder="CUIT *"
                                    {...register('cuit', {
                                        required: true,
                                        pattern: {
                                            value: /^\d{11}$/,
                                            message: "El CUIT debe tener 11 dígitos numéricos",
                                        },
                                    })}>
                                </input>
                            </span>
                            <span>
                                <input
                                    id="email"
                                    type='email'
                                    placeholder="Email *"
                                    {...register('email', { required: true })}>
                                </input>
                            </span>
                            <span>
                                <input
                                    id="tel"
                                    type='number'
                                    placeholder="Teléfono *"
                                    {...register('tel', { required: true })}>
                                </input>
                            </span>
                            <span>
                                <input
                                    id="password"
                                    type='password'
                                    placeholder="Contraseña *"
                                    {...register('password', { required: true })}>
                                </input>

                            </span>
                            <span>
                                <input
                                    id="repeat-password"
                                    type='password'
                                    placeholder="Repita su contraseña *"
                                    {...register('repeatPass', { required: true })}>
                                </input>

                            </span>
                        </div>
                        <button className="general-button">Registrarse</button>
                    </form>
                    {loading &&
                        <div className="spinner-grow text-secondary" role="status">
                            <span className="visually-hidden">Enviando...</span>
                        </div>
                    }
                    {errors.cuit && <p className="error">{errors.cuit.message}</p>}
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                </>
            ) : (
                <>
                    <h2>Registro exitoso</h2>
                    <div className="form-inputs">
                        <h5>Gracias por registrate!</h5>
                        <p>A la brevedad confirmaremos tus datos para que puedas acceder a la plataforma.</p>
                        <p>Te hemos enviado un email con más información.</p>
                    </div>
                </>
            )}
            <ModalMesagge
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                content={<p>{modalConfig.content}</p>}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
            />
        </>
    )
}

export default Register
