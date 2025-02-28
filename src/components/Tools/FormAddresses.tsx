

import { useForm } from "react-hook-form";
import { Address } from "../../Interfaces/interfaces";
import { useUser } from "../../context/UserContext";
import { useUpdateUserInfo } from "../../CustomHooks/useUpdateUserInfo";
import useModal from "../../CustomHooks/useModal";
import './tools.css'

export interface FormAddresses {
    address: Address | null,
    id_user: number,
    onClose: () => void
}

const FormAddresses: React.FC<FormAddresses> = ({ address, onClose }) => {

    const { userActive } = useUser();
    const { openModal, closeModal } = useModal();
    const { handleUpdateInformation } = useUpdateUserInfo((title, content) => openModal(title, content, closeModal));
    const { register, handleSubmit, formState: { errors } } = useForm<Address>({
        defaultValues: address ? address : {
            street: '',
            street2: '',
            city: '',
            province: '',
            name_address: '',
            last_name: '',
            company_name: '',
            default_address: false,
        },
    });

    const onSubmit = async (data: Address) => {
        if (userActive) {
            const endpoint = address ? "update-address-user" : "add-address-user";

            const response = await handleUpdateInformation(
                data,
                userActive.id,
                endpoint,
            );

            if (response) {
                onClose();
            }
        }

    };

    return (
        <form className='form-modal' onSubmit={handleSubmit(onSubmit)}>
            <div className="title-page">
                <h5 className="left-decoration">{address ? 'Editar Dirección' : 'Nueva Dirección'}</h5>
            </div>
            <span></span>         
            <div className="row">
                <span className="col-6">
                    <label htmlFor="name"> Nombre </label>
                    <input
                        id="name"
                        type='text'
                        {...register('name_address', { required: true })}>
                    </input>
                </span>
                <span className="col-6">
                    <label htmlFor="lastName"> Apellido  </label>
                    <input
                        id="lastName"
                        type='text'
                        {...register('last_name', { required: true })}>
                    </input>
                </span>
            </div>
            <div className="row border-top">
                <span>
                    <label htmlFor="company_name"> Nombre de la empresa </label>
                    <input
                        id="company_name"
                        type='text'
                        {...register('company_name')}>
                    </input>
                </span>
            </div>
            <div className="row border-top">
                <span className="col-6">
                    <label htmlFor="street"> Calle </label>
                    <input
                        id="street"
                        type='text'
                        {...register('street', { required: true })}>
                    </input>
                </span><span className="col-6">
                    <label htmlFor="street2"> Info adicional </label>
                    <input
                        id="street2"
                        type='text'
                        {...register('street2')}>
                    </input>
                </span>
            </div>
            <div className="row border-top">
                <span className="col-6">
                    <label htmlFor="city">Ciudad</label>
                    <input
                        id="city"
                        type='text'
                        {...register('city', { required: true })}
                    >
                    </input>
                </span>
                <span className="col-6">
                    <label htmlFor="province"> Provincia </label>
                    <input
                        id="province"
                        type='text'
                        {...register('province', { required: true })}>
                    </input>
                </span>
            </div>
            <div className="row border-top">
                <span className="col-6">
                    <label htmlFor="cp"> Codigo Postal</label>
                    <input
                        id="cp"
                        type='number'
                        {...register('cp', { required: true })}>
                    </input>
                </span>
                <span className="col-6">
                    <label htmlFor="tel"> Teléfono </label>
                    <input
                        id="tel"
                        type='number'
                        {...register('tel_address',
                            {
                                required: true,
                                pattern: {
                                    value: /\d{1,4}\d{6,8}$/,
                                    message: "El teléfono debe tener el formato +54 seguido de un código de área y número válido.",
                                },
                                validate: {
                                    length: value =>
                                        value.replace(/[^\d]/g, '').length >= 11 ||
                                        "El teléfono debe incluir el código de área y el número completo (mínimo 11 dígitos).",
                                },
                            })}>
                    </input>
                    {errors.tel_address && <p className="error">{errors.tel_address.message}</p>}
                </span>
            </div>
            <span></span>
            <div className=" d-flex gap-2">
                <label className="default" htmlFor="default"> Quiere usar esta dirección como predeterminada? </label>
                <input
                    id="default"
                    type='checkbox'
                    {...register('default_address')}>
                </input>
            </div>
            <span></span>
            <input className="general-button" type="submit" value={address ? 'Guardar cambios' : 'Agregar dirección'} />
            <button className="no-button" type="button" onClick={onClose}>Cancelar</button>
        </form>
    )
}

export default FormAddresses
