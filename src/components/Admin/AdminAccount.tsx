import React from "react";
import { useForm } from "react-hook-form";
import { FormAccountInformation, FormSocial } from "../../Interfaces/interfaces";
import { useUpdateUserInfo } from "../../CustomHooks/useUpdateUserInfo";
import { useApi } from "../../context/ApiProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useModal from "../../CustomHooks/useModal";
import ModalMesagge from "../Tools/ModalMesagge";
import useVerifyToken from "../../CustomHooks/useVerefyToken";
import 'react-lazy-load-image-component/src/effects/blur.css';


const AdminAccount = () => {
    const { dev, companyInfo, social, refreshSocial, userActive } = useApi();
    const { modalConfig, openModal, closeModal } = useModal();
    const { validateToken } = useVerifyToken();
    const { handleUpdateInformation } = useUpdateUserInfo((title, content) => openModal(title, content, closeModal));
    const { register: accountRegister, handleSubmit: accountHandleSubmit } = useForm<FormAccountInformation>();
    const { register: companyRegister, handleSubmit: companyHandleSubmit, setValue: companyValues } = useForm();
    const { register: socialRegister, handleSubmit: socialHandleSubmit, reset } = useForm<FormSocial>();


    // Account
    const handleAccountInformation = async (data: FormAccountInformation) => {
        if (userActive) {
            await handleUpdateInformation(
                data,
                userActive.id,
                "update-account-user",
            );
        }
    };

    // Company
    const companyInfoLabels = (name: string): string => {
        const labels: Record<string, string> = {
            email: "Correo Electrónico",
            store_address: "Dirección de la Tienda",
            map: "Mapa interactivo",
            tel: "Teléfono",
        };
        return labels[name] ?? name; // Devuelve la clave original si no hay coincidencia
    };

    React.useEffect(() => {
        if (companyInfo) {
            Object.entries(companyInfo).forEach(([key, value]) => {
                companyValues(key, value || ""); // Prellenar valores
            });
        }

    }, [companyInfo, companyValues]);

    const companySubmit = async (data: Record<string, string>) => {
        const isTokenValid = await validateToken();

        if (!isTokenValid) {
            return { success: false, message: "Token inválido." };
        }

        try {

            const token = localStorage.getItem('user_token')

            const response = await fetch(`${dev}/index.php?action=update_companyInfo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data, token }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                openModal("Error", `Error al actualizar la información, ${result.message}`, closeModal);
                return
            }

            openModal("Éxito", "Información actualizada correctamente", closeModal);
        } catch (error) {
            openModal("Error", `No se pudo actualizar la información" ${error}`, closeModal);
        }
    };

    // Social
    const socialSubmit = async (data: FormSocial) => {
        const isTokenValid = await validateToken();

        if (!isTokenValid) {
            return { success: false, message: "Token inválido." };
        }
        try {
            const token = localStorage.getItem('user_token')

            const formData = new FormData();
            formData.append("id", data.id);
            formData.append("img_social", data.img_social[0]);
            formData.append("social_url", data.social_url);
            formData.append("token", token || '');

            const response = await fetch(`${dev}/index.php?action=update_social`, {
                method: "POST",
                headers: {

                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                openModal("Error", `Error al actualizar la información ${result.message}`, closeModal);
                return
            } else {
                openModal("Éxito", "Información actualizada correctamente", closeModal);
                reset();
                refreshSocial();
            }

        } catch (error) {
            console.error("Error al actualizar:", error);
            openModal("Error", `No se pudo actualizar la información" ${error}`, closeModal);
        }

    };

    const deleteSocial = async (id: string) => {
        const token = localStorage.getItem('user_token');
        try {
            const response = await fetch(`${dev}/index.php?action=delete-social`, {
                method: "POST",
                headers: {

                },
                body: JSON.stringify({ id, token }),
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                openModal("Error", `Error al eliminar la red social",  ${result.message}`, closeModal);
            } else {
                openModal("Éxito", "Red social eliminada correctamente", closeModal);
                refreshSocial();
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            openModal("Error", `No se pudo eliminar la red social" , ${error}`, closeModal);
        }
    };

    const openInfoMap = () => {
        openModal("Mapa interactivo",
            "Este mapa se verá en la página de Contacto. Modifique el valor de este campo si cambia la Dirección de la tienda. Para insertar el nuevo valor, ingresa a Google Maps y busca en el mapa la nueva dirección. Haz clic en el botón de compartir (ícono de enlace), selecciona la opción 'Insertar un mapa' y copia el código <iframe> generado o el enlace de inserción. Pega este enlace en el campo de 'Mapa interactivo' y guarda los cambios.",
            closeModal);
    }

    return (
        <div className="w-100 account">
            <div className="title-page">
                <h4>Cuenta</h4>
            </div>
            <div className="row">
                <div className="col-lg-6 no-padding">
                    <div className="item-cont border-top">
                        <div className="title left-decoration">
                            <h5>Informacion de cuenta</h5>
                            <p>Actualiza tu clave de ingreso</p>
                        </div>
                        <form className="item-cont" onSubmit={accountHandleSubmit(handleAccountInformation)}>
                            <div className="item-form">
                                <label htmlFor="password">Contraseña</label>
                                <input id="password" type="password" {...accountRegister('password')}></input>
                            </div>
                            <span className="button-cont">
                                <button className="general-button">Actualizar</button>
                            </span>
                        </form>
                    </div>
                    <div className="item-cont border-top">
                        <div className="title  left-decoration">
                            <h5>Información de la empresa</h5>
                        </div>
                        <form className="item-cont" onSubmit={companyHandleSubmit(companySubmit)}>
                            {companyInfo.map((key) => (
                                <div className="item-form" key={key.key}>
                                    <label htmlFor={companyInfoLabels(key.key)}>{companyInfoLabels(key.key)}: </label>
                                    <input
                                        id={companyInfoLabels(key.key)}
                                        type="text"
                                        {...companyRegister(key.key)}
                                        defaultValue={key.value ?? ""}
                                    />
                                </div>
                            ))}
                            <div className="button-cont">
                                <button className="light-button" type='button' onClick={() => openInfoMap()}> Info mapa interactivo</button>
                                <button className="general-button" type="submit">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-lg-6 no-padding">
                    <div className="item-cont border-top">
                        <div className="title  left-decoration">
                            <h5>Redes sociales</h5>
                            <p>Agrega nuevas redes sociales de la empresa o modifica las existentes.</p>
                        </div>
                        <form className="item-cont" onSubmit={socialHandleSubmit(socialSubmit)}>
                            <div className="item-form">
                                <label htmlFor="id">Nombre de la Red Social:</label>
                                <input {...socialRegister("id", { required: "Este campo es obligatorio" })} />
                            </div>
                            <div className="item-form">
                                <label htmlFor="social_url">URL:</label>
                                <input
                                    type="url"
                                    {...socialRegister("social_url", {
                                        required: "Este campo es obligatorio",
                                        pattern: {
                                            value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/,
                                            message: "Ingrese una URL válida",
                                        },
                                    })}
                                />
                            </div>
                            <div className="item-form">
                                <label htmlFor="img_social">Imagen</label>
                                <div className="button-cont align-items-start">
                                    <input
                                        type="file"
                                        {...socialRegister("img_social", { required: "Seleccione una imagen" })}
                                    />
                                    <button className="general-button" type="submit">Agregar</button>
                                </div>
                            </div>
                        </form>
                        <ul className="ul-row-nopadding">
                            {social.map((item) => (
                                <li key={item.id} className="li-social">
                                    <div className="item-cont">
                                        <p>{item.id}</p>
                                        <p className="small">{item.url}</p>
                                        <span className="button-cont">
                                            <LazyLoadImage src={`${dev}/${item.img_social}`} alt={item.id} width="50" height="50" effect='blur' />
                                            <button className="no-button" onClick={() => deleteSocial(item.id)}>Eliminar</button>
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
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

export default AdminAccount
