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
            openModal("Error", `Error inesperado al eliminar el usuario: ${error}` , closeModal);
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
        <div>
            <div>
                <h3>Nuevos usuarios</h3>
                <p>Los siguientes usuarios esperan aprovación para activar su cuenta:</p>
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
            <div>
                <h4>Usuarios:</h4>
                <div className="accordion" id="accordionPanelsStayOpenExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                                Usuarios
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <div className="search-container">
                                    <input
                                        className="admin-search"
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Buscar usuarios..."
                                    />
                                </div>
                                <ul className="list-acordeon">
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

export default AdminUsers
