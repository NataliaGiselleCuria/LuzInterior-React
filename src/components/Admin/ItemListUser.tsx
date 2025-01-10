import { Users } from "../../Interfaces/interfaces"

interface Props {
    user: Users;
    openModal: (title: string, content: string, closeModal: () => void) => void,
    handleUpdateUserApproved: (id: number) => void;
    handleDeleteUser: (id: number) => void;
    handleUpdateUserRole: (id: number) => void;
}

export const ItemListUser: React.FC<Props> = ({ user, openModal, handleUpdateUserApproved, handleDeleteUser, handleUpdateUserRole}) => {

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
        <li key={user.id}>
            <div>
                <span>{new Date(date).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</span>
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>{user.cuit}</span>
            </div>
            <div>
                <span>{user.approved ? 'Sí' : 'No'}</span>
                <button onClick={() => handleUpdateUserApproved(user.id)}>{user.approved ? 'Dar de baja' : 'Habilitar'}</button>
            </div>
            {user.approved ? (
                <div>
                    <span>{user.role}</span>
                    <button onClick={() => alertUpdateUserRole(user.id, user.role)}>
                        Cambiar rol
                    </button>
                </div>
            ) : (
                <></>
            )}
            <button onClick={() => alertdeleteUser(user.id)}>Eliminar</button>
        </li>
    )
}
