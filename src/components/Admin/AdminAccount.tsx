
import { useUser } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import { FormAccountInformation, FormSocial } from "../../Interfaces/interfaces";
import useModal from "../CustomHooks/modal";
import { useUpdateUserInfo } from "../CustomHooks/updateUserInfo";
import ModalMesagge from "../Tools/ModalMesagge";
import { useApi } from "../../context/ApiProvider";
import React, { useEffect, useState } from "react";
import useVerifyToken from "../CustomHooks/verefyToken";


const AdminAccount = () => {
    const { dev, companyInfo, social, setSocial } = useApi();
    const { userActive } = useUser();
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

        console.log(companyInfo)
    }, [companyInfo, companyValues]);

    const companySubmit = async (data: Record<string, string>) => {
        const isTokenValid = await validateToken();

        if (!isTokenValid) {
            return { success: false, message: "Token inválido." };
        }

        try {

            const token = localStorage.getItem('token')

            const response = await fetch(`${dev}/index.php?action=update_companyInfo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                openModal("Error", `Error al actualizar la información", ${result.message}`, closeModal);
                return
            }

            openModal("Éxito", "Información actualizada correctamente", closeModal);


        } catch (error) {
            console.error("Error al actualizar:", error);
            openModal("Error", `No se pudo actualizar la información" ${error}`, closeModal);
        }
    };

    // Social

    const refreshSocial = async () => {
        const updateProducts = await fetch(`${dev}/index.php?action=social`);
        const data = await updateProducts.json();
        setSocial(data);
        console.log(social)
    }

    const socialSubmit = async (data: FormSocial) => {
        const isTokenValid = await validateToken();

        if (!isTokenValid) {
            return { success: false, message: "Token inválido." };
        }

        console.log(data)

        try {

            const token = localStorage.getItem('token')

            const formData = new FormData();
            formData.append("id", data.id);
            formData.append("img_social", data.img_social[0]);
            formData.append("social_url", data.social_url);

            const response = await fetch(`${dev}/index.php?action=update_social`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                openModal("Error", `Error al actualizar la información" ${result.message}`, closeModal);
                console.log(response)
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
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${dev}/index.php?action=delete-social`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
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
   

    return (

        <>
            <h3>Cuenta</h3>
            <h5>{userActive?.email}</h5>
            <div>
                <h5>Informacion de cuenta</h5>
                <p>Actualiza tu clave de ingreso</p>
                <form onSubmit={accountHandleSubmit(handleAccountInformation)}>
                    <span>
                        <label htmlFor="password">Contraseña</label>
                        <input id="password" type="password" {...accountRegister('password')}></input>
                    </span>
                    <span><button>Actualizar</button></span>
                </form>
            </div>
            <div>
                <h5>Información de la empresa</h5>
                <form onSubmit={companyHandleSubmit(companySubmit)}>
                    {companyInfo.map((key) => (
                        <div key={key.key}>
                            <label>{companyInfoLabels(key.key)}: </label>
                            <input
                                type="text"
                                {...companyRegister(key.key)}
                                defaultValue={key.value ?? ""}
                            />
                        </div>
                    ))}
                    <button type="submit">Guardar Cambios</button>
                </form>
            </div>
            <div>
                <h5>Redes sociales</h5>
                <p>Agrega nuevas redes sociales de la empresa o modifica las existentes.</p>
                <form onSubmit={socialHandleSubmit(socialSubmit)}>
                    <div>
                        <label>Nombre de la Red Social:</label>
                        <input {...socialRegister("id", { required: "Este campo es obligatorio" })} />
                    </div>
                    <div>
                        <label>URL:</label>
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
                    <div>
                        <label>Imagen</label>
                        <input
                            type="file"
                            {...socialRegister("img_social", { required: "Seleccione una imagen" })}
                        />
                    </div>

                    <button type="submit">Agregar</button>
                </form>
                <div>
                    <ul>
                        {social.map((item) => (
                            <li key={item.id}>
                                <span>
                                    <p>{item.id}</p>
                                    <p>{item.url}</p>
                                    <img src={`${dev}/${item.img_social}`} alt={item.id} width="50" height="50" />
                                </span>
                                <span>
                                    <button onClick={() => deleteSocial(item.id)}>Eliminar</button>
                                </span>
                            </li>
                        ))}
                    </ul>
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
        </>

    )
}

export default AdminAccount
