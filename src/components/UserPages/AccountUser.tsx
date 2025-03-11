import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"
import { FormAccountInformation, FormPersonalInformation } from "../../Interfaces/interfaces";
import FormAddresses from "../Tools/FormAddresses";
import { useUpdateUserInfo } from "../../CustomHooks/useUpdateUserInfo";
import useModal from "../../CustomHooks/useModal";
import ModalMesagge from "../Tools/ModalMesagge";
import check from '../../assets/check.png'
import './user.css'
import { useApi } from "../../context/ApiProvider";

const AccountUser = () => {

  const {userActive} = useApi();
  const { isLogin} = useUser();
  const navigate = useNavigate();
  const { modalConfig, openModal, closeModal } = useModal();
  const { handleUpdateInformation, openModalAddress, closeModalAddress, isModalOpen, selectedAddress } = useUpdateUserInfo((title, content) => openModal(title, content, closeModal));
  const { register: accountRegister, handleSubmit: accountHandleSubmit, reset: accountReset } = useForm<FormAccountInformation>();
  const { register: personalRegister, handleSubmit: personalHandleSubmit, formState: { errors: personalErrors }, reset: resetPersonal } = useForm<FormPersonalInformation>({
    defaultValues: {
      name: userActive?.name,
      cuit: userActive?.cuit,
      tel: userActive?.tel,
    },
  });

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

  const descartar = (form: string) => {
    if (userActive) {
      if (form === 'personal') {
        resetPersonal({
          name: userActive.name,
          cuit: userActive.cuit,
          tel: userActive.tel,
        });
      } else if (form === 'account') {
        accountReset()
      }

    }
  }


  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
    }
  }, [isLogin, navigate]);

  return (
    <div className="cont container">
      <div className="row account-user">
        <div className="col-md-3 col-xl-2 col-name-user">
          <span className="back"></span>
          <div className="icon-user">
            {userActive?.name
              ?.split(" ")
              .map(word => word[0].toUpperCase())
              .join("")}
          </div>
          <span className="title-page">
            <h4>{userActive?.name}</h4>
          </span>
          <Link to="/mis_pedidos">
            <button className="general-button">
              Ver mis pedidos
            </button>
          </Link>
        </div>
        <div className="col-md-7 col-user-info">
          <span className="title-page">
            <h3>Mi cuenta</h3>
          </span>
          <div className="item-cont">
            <span className="title left-decoration">
              <h5>Informacion personal</h5>
              <p>Actualiza tu informacion personal</p>
            </span>
            <form onSubmit={personalHandleSubmit(handlePersonalInformation)}>
              <div className="form-inputs">
                <span className="item-form">
                  <label htmlFor="name">Nombre</label>
                  <input
                    id="name"
                    type="text"
                    defaultValue={userActive?.name}
                    {...personalRegister('name')}></input>
                </span>
                <span className="item-form">
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
                <span className="item-form">
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
              </div>
              <span className="form-buttons">
                <button className="general-button">Actualizar</button>
                <button className="no-button" type="button" onClick={() => descartar('personal')}>Descartar</button>
              </span>
            </form>
          </div>
          <div className="item-cont">
            <span className="title left-decoration">
              <h5>Informacion de cuenta</h5>
              <p>Actualiza tu clave de ingreso</p>
            </span>
            <form onSubmit={accountHandleSubmit(handleAccountInformation)}>
              <div className="form-inputs">
                <span className="item-form">
                  <label htmlFor="password">Contraseña</label>
                  <input id="password" type="password" {...accountRegister('password')}></input>
                </span>
              </div>
              <span className="form-buttons">
                <button className="general-button">Actualizar</button>
                <button className="no-button" onClick={() => descartar('account')} type="button">Descartar</button>
              </span>
            </form>
          </div>
          <div className="item-cont">
            <span className="title left-decoration">
              <h5>Direcciones</h5>
              <p>Agrega y administra las direcciones que utilizas con frecuencia.</p>
            </span>
            <ul className="ul-row-nopadding addresses-ul">
              {userActive?.addresses
                .sort((a, b) => (b.default_address ? 1 : 0) - (a.default_address ? 1 : 0))
                .map((address) => (
                  <li className={`address-cont ${address.default_address ? "default" : ""}`}
                    key={`address-${address.id_address}`}>
                    <div className="info-save">
                      <p>{address.name_address}</p>
                      <p>{address.street}</p>
                      <p>{address.city}</p>
                      <p>{address.province}</p>
                      <p>{address.tel_address}</p>
                      {address.default_address == true && <div className="default-address"><p>Dirección predeterminada</p><img src={check} alt='icon check'></img></div>}
                    </div>
                    <span className="form-buttons">
                      <button className="general-button" onClick={() => openModalAddress(address)}>Editar</button>
                      <button className="no-button" onClick={() => deleteAddress(address.id_address)}>Eliminar</button>
                    </span>
                  </li>
                ))}

            </ul>
            <button className="light-button address-button" onClick={() => openModalAddress()}>Agregar nueva dirección</button>
          </div>

          {userActive?.id && isModalOpen && (
            <div className="modal">
              <FormAddresses
                address={selectedAddress}
                id_user={userActive?.id}
                onClose={closeModalAddress}
              />
            </div>
          )}
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

export default AccountUser
