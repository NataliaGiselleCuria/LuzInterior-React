
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext";
import { FormRegister } from "../../Interfaces/interfaces";
import useModal from "../../CustomHooks/modal";
import ModalMesagge from "../Tools/ModalMesagge";

const Register = () => {

    const { userRegister } = useUser();
    const [errorMessage, setErrorMessage] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm<FormRegister>();
    const { modalConfig, openModal, closeModal } = useModal();

    const navigate = useNavigate();

    const handleRegister = async (data: FormRegister) => {

        if (data.password !== data.repeatPass) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            const result = await userRegister(data);

            if (result.success) {
                setErrorMessage("");
                navigate("/registro_finalizado");              
            } else {
                setErrorMessage(result.message);
            }

        } catch (error) {
            openModal( "Error", "Ocurrió un error al intentar registrar el usuario. Intente nuevamente más tarde.", closeModal);
        }

    };

    return (
        <div className="cont container">
            <h2>Nuevo usuario</h2>
            <p>¿Ya tienes un usuario?<span><Link to='/login'>Iniciar sesión</Link></span></p>
            <form onSubmit={handleSubmit(handleRegister)}>
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
                        {...register('cuit', { required: true,
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
                <button>Registrarse</button>
            </form>
            {errors.cuit && <p className="error">{errors.cuit.message}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <ModalMesagge
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                content={<p>{modalConfig.content}</p>}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
            />
        </div>
    )
}

export default Register
