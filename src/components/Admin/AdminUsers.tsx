import { useApi } from "../../context/ApiProvider"
import { useUser } from "../../context/UserContext";
import useModal from "../../CustomHooks/modal";
import useVerifyToken from "../../CustomHooks/verefyToken";
import ModalMesagge from "../Tools/ModalMesagge";
import { useSearch } from "../../CustomHooks/useSearch";
import { Users } from "../../Interfaces/interfaces";
import { ItemListUser } from "./ItemListUser";


const AdminUsers = () => {
    const { users } = useApi();
    const { updateUserApproved, updateUserRole, deletUser } = useUser();
    const { validateToken } = useVerifyToken();
    const { modalConfig, openModal, closeModal } = useModal();
    const { searchQuery, filteredResults, handleSearchChange } = useSearch(users, true);

    const handleUpdateUserApproved = async (id: number) => {
        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        try {
            const response = await updateUserApproved(id)
            if (response.success) {
                openModal("Éxito", "El usuario se modificó correctamente.", closeModal);
            } else {
                openModal("Error", `Error al actualizar el usuario: ${response.message}`, closeModal);
            }

        } catch (error) {
            openModal("Error", `Error inesperado al actualizar el usuario: ${error}`, closeModal);
        }

    }

    const handleDeleteUser = async (id: number) => {
        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        try {
            const response = await deletUser(id)
            if (response.success) {
                openModal("Éxito", "El usuario se eliminó correctamente.", closeModal);
            } else {
                openModal("Error", `Error al eliminar el usuario: ${response.message}`, closeModal);
            }
        } catch (error) {
            openModal("Error", `Error inesperado al eliminar el usuario: ${error}`, closeModal);
        }
    }

    const handleUpdateUserRole = async (id: number) => {

        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        try {
            const response = await updateUserRole(id)
            if (response.success) {
                openModal("Éxito", "El usuario actualizó correctamente.", closeModal);
            } else {
                openModal("Error", `Error al actualizar el usuario: ${response.message}`, closeModal);
            }

        } catch (error) {
            openModal("Error", `Error inesperado al eliminar el usuario: ${error}`, closeModal);
        }
    }

    return (
        <div className="w-100 users">
            <div className="title-page">
                <h4>Usuarios</h4>
            </div>
            <div className='row gap-4'>
                <div className='col-lg'>
                    <div className="title-page">
                        <h5>Nuevos usuarios:</h5>
                        <p>Los siguientes usuarios esperan aprovación para activar su cuenta:</p>
                    </div>
                    <ul>
                        {users.filter((user) => user.new).map((user) => {
                            return <ItemListUser
                                key={user.id}
                                user={user}
                                openModal={openModal}
                                handleUpdateUserApproved={handleUpdateUserApproved}
                                handleDeleteUser={handleDeleteUser}
                                handleUpdateUserRole={handleUpdateUserRole}
                            />
                        })}
                    </ul>
                </div>
                <div className="col-lg">
                    <div className="title-page">
                        <h5>Usuarios activos:</h5>
                        <div className="search-container">
                            <input
                                className="admin-search"
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Buscar usuarios..."
                            />
                        </div>
                    </div>
                    <ul>
                        {filteredResults.filter((item): item is Users => 'approved' in item && !item.new).map((user) => {
                            return <ItemListUser
                                key={user.id}
                                user={user}
                                openModal={openModal}
                                handleUpdateUserApproved={handleUpdateUserApproved}
                                handleDeleteUser={handleDeleteUser}
                                handleUpdateUserRole={handleUpdateUserRole}
                            />
                        })}
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
        </div>
    )
}

export default AdminUsers
