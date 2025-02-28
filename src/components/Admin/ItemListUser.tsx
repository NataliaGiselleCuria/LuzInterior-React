import { Users } from "../../Interfaces/interfaces"

interface Props {
    user: Users;
    openModal: (title: string, content: string, closeModal: () => void) => void,
    handleUpdateUserApproved: (id: number) => void;
    handleDeleteUser: (id: number) => void;
    handleUpdateUserRole: (id: number) => void;
}

export const ItemListUser: React.FC<Props> = ({ user, openModal, handleUpdateUserApproved, handleDeleteUser, handleUpdateUserRole }) => {

    const alertdeleteUser = (id: number) => {
        openModal("Advertencia", "Este usuario perderá su registro en la página ¿Eliminar de todas formas?", () => handleDeleteUser(id));
    }

    const alertUpdateUserRole = (id: number, role: string) => {
        if (role === 'admin') {
            openModal("Advertencia", "Este usuario perderá sus permisos para ingresar al panel de administrador ¿Cambiar de todas formas?", () => handleUpdateUserRole(id));
        } else {
            openModal("Advertencia", "Este usuario obtendrá permisos para ingresar al panel de administrador ¿Cambiar de todas formas?", () => handleUpdateUserRole(id));
        }
    }

    const date = new Date(user.register_date + "T00:00:00");

    return (
        <>
            <div className="item-info">
                <div className="pr-20"><span className="fw-medium">Registro: </span> {new Date(date).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</div>
                <div className="pr-20"><span className="fw-medium">Nombre: </span> {user.name}</div>
            </div>
            <div className="item-info">
                <div className="pr-20"><span className="fw-medium">Email: </span> {user.email}</div>
                <div className="pr-20"><span className="fw-medium">CUIT: </span> {user.cuit}</div>
            </div>
            <div className="item-info  buttons">
                <div className="item-info users-button-cont">
                    <div><span className="fw-medium">Aprovado: </span>{user.approved ? 'Sí' : 'No'}</div>
                    <button className="general-button" onClick={() => handleUpdateUserApproved(user.id)}>{user.approved ? 'Dar de baja' : 'Habilitar'}</button>
                </div>
                {user.approved ? (
                    <div className="item-info users-button-cont">
                        <div><span className="fw-medium">Rol: </span>{user.role}</div>
                        <button className="general-button" onClick={() => alertUpdateUserRole(user.id, user.role)}>
                            Cambiar rol
                        </button>
                    </div>
                ) : (
                    <></>
                )}
                <button className="no-button" onClick={() => alertdeleteUser(user.id)}>Eliminar</button>
            </div>

        </>
    )
}
