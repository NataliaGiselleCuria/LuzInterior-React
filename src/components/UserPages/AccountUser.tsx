import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"
import { FormAccountInformation, FormPersonalInformation } from "../../Interfaces/interfaces";
import FormAddresses from "../Tools/FormAddresses";
import { useUpdateUserInfo } from "../../CustomHooks/updateUserInfo";
import useModal from "../../CustomHooks/modal";
import ModalMesagge from "../Tools/ModalMesagge";


const AccountUser = () => {

  const { isLogin, userActive } = useUser();
  const { modalConfig, openModal, closeModal } = useModal();
  const { handleUpdateInformation, openModalAddress, closeModalAddress, isModalOpen, selectedAddress } = useUpdateUserInfo((title, content) => openModal(title, content, closeModal));
  const navigate = useNavigate();


  const { register: personalRegister, handleSubmit: personalHandleSubmit, formState: { errors: personalErrors }, reset: resetPersonal } = useForm<FormPersonalInformation>({
    defaultValues: {
      name: userActive?.name,
      cuit: userActive?.cuit,
      tel: userActive?.tel,
    },
  });

  const { register: accountRegister, handleSubmit: accountHandleSubmit } = useForm<FormAccountInformation>();

  useEffect(() => {
    if (userActive) {
      resetPersonal({
        name: userActive.name,
        cuit: userActive.cuit,
        tel: userActive.tel,
      });
    }
  }, [userActive]);


  const handlePersonalInformation = async (data: FormPersonalInformation) => {
    if (userActive) {
      await handleUpdateInformation(
        data,
        userActive.id,
        "update-personal-user",
      );
    }
  };

  const handleAccountInformation = async (data: FormAccountInformation) => {
    if (userActive) {
      await handleUpdateInformation(
        data,
        userActive.id,
        "update-account-user",
      );
    }

  };

  const deleteAddress = async (id_address: number) => {
    const data = id_address
    if (userActive) {
      await handleUpdateInformation(
        data,
        userActive.id,
        "delete-address-user",
      );
    }
  }

  const descartar = () => {
    if (userActive) {
      resetPersonal({
        name: userActive.name,
        cuit: userActive.cuit,
        tel: userActive.tel,
      });
    }
  }

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
    }
  }, [isLogin, navigate]);

  return (
    <div className="cont container">
      <h3>{userActive?.name}</h3>
      <h2>Mi cuenta</h2>
      <div>
        <h2>Informacion personal</h2>
        <p>Actualiza tu informacion personal</p>
        <form onSubmit={personalHandleSubmit(handlePersonalInformation)}>
          <span>
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              defaultValue={userActive?.name}
              {...personalRegister('name')}></input>
          </span>
          <span>
            <label htmlFor="cuit">Cuit</label>
            <input
              id="cuit"
              type="number"
              defaultValue={userActive?.cuit}
              {...personalRegister('cuit', {
                required: true,
                pattern: {
                  value: /^\d{11}$/,
                  message: "El CUIT debe tener 11 dígitos numéricos",
                },
              })}>
            </input>
            {personalErrors.cuit && <p className="error">{personalErrors.cuit.message}</p>}
          </span>
          <span>
          <label htmlFor="telefono">Teléfono</label>
            <input
              id="tel"
              type="text"
              {...personalRegister('tel', {
                required: true,
                pattern: {
                  value: /^(\+54)\d{1,4}\d{6,8}$/,
                  message: "El teléfono debe tener el formato +54 seguido de un código de área y número válido.",
                },
                validate: {
                  length: value =>
                    value.replace(/[^\d]/g, '').length >= 11 ||
                    "El teléfono debe incluir el código de área y el número completo (mínimo 11 dígitos).",
                },
              })}
            />
            {personalErrors.tel && <p className="error">{personalErrors.tel.message}</p>}
          </span>
          <span><button type="button" onClick={descartar}>Descartar</button><button>Actualizar</button></span>
        </form>
      </div>
      <div>
        <h2>Informacion de cuenta</h2>
        <p>Actualiza tu clave de ingreso</p>
        <form onSubmit={accountHandleSubmit(handleAccountInformation)}>
          <span>
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" {...accountRegister('password')}></input>
          </span>
          <span><button>Descartar</button><button>Actualizar</button></span>
        </form>
      </div>
      <div>
        <h2>Direcciones</h2>
        <p>Agrega y administra las direcciones que utilizas con frecuencia.</p>
        {userActive?.addresses
          .sort((a, b) => (b.default_address ? 1 : 0) - (a.default_address ? 1 : 0))
          .map((address) => (
            <div key={address.id}>
              <span>
                <p>{address.name_address}</p>
                <p>{address.street}</p>
                <p>{address.city}</p>
                <p>{address.province}</p>
                <p>{address.tel_address}</p>
                {address.default_address == true && <p>Dirección predeterminada</p>}
              </span>
              <span>
                <button onClick={() => openModalAddress(address)}>Editar</button>
                <button onClick={() => deleteAddress(address.id)}>Eliminar</button>
              </span>
            </div>
          ))}
      </div>
      <button onClick={() => openModalAddress()}>Agregar nueva dirección</button>
      {userActive?.id && isModalOpen && (
        <div className="modal">
          <FormAddresses
            address={selectedAddress}
            id_user={userActive?.id}
            onClose={closeModalAddress}
          />
        </div>
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

    </div>

  )
}

export default AccountUser
