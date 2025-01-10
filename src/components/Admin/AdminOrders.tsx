
import { useEffect, useState } from 'react';
import { useApi } from '../../context/ApiProvider'
import { useOrder } from '../../context/OrderProvider';
import useModal from '../CustomHooks/modal';
import useVerifyToken from '../CustomHooks/verefyToken';
import ModalMesagge from '../Tools/ModalMesagge';
import { useSearch } from '../CustomHooks/useSearch';
import { Orders } from '../../Interfaces/interfaces';
import ItemListOrder from './ItemListOrder';

const AdminOrders = () => {

    const { orders } = useApi();
    const { updateOrderState, updateNew, deleteOrder } = useOrder();
    const { validateToken } = useVerifyToken();
    const { modalConfig, openModal, closeModal } = useModal();
    const [ filteredOrders, setFilteredOrders] = useState(orders);
    const { searchQuery, filteredResults, handleSearchChange } = useSearch(orders, true);

   
    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders]);

    const handleStateChange = async (orderId: number, newState: string) => {
        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        try {
            const response = await updateOrderState(orderId, newState)
            if (response.success) {
                
                openModal("Éxito", "El estado de la orden se modificó correctamente.", closeModal);
              

            } else {
                openModal("Error", `Error al actualizar estado de la orden: ${response.message}`, closeModal);
            }

        } catch (error) {
            openModal("Error", `Error inesperado al actualizar estado de la orden:${error}`, closeModal);
        };
    };

    const handleDeletOrder = async (orderId: number) => {
        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        try {
            const response = await deleteOrder(orderId);
            if (response.success) {
              
                setFilteredOrders((prevOrders) =>
                    prevOrders.filter(order => order.id !== orderId)
                );
                openModal("Éxito", "La orden se eliminó correctamente.", closeModal);
               
            } else {
                openModal("Error", `Error al eliminar la orden: ${response.message}`, closeModal);
            }
        } catch (error) {
            openModal("Error", `Error inesperado al eliminar la orden: ${error}`, closeModal);
        }
    };

    const handleUpdateNew = async (orderId: number) => {
        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        const response = await  updateNew(orderId);

        try {
           
            if (response.success) {
              
                setFilteredOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, new: false } : order
                    )
                );
                     
            } else {
                openModal("Error", `Error al eliminar la orden: ${response.message}`, closeModal);
            }
        } catch (error) {
            openModal("Error", `Error inesperado al eliminar la orden: ${error}`, closeModal);
        }   
    }

    return (
        <div>
            <h3>Ordenes de pedido</h3>
            <div>
                <h5>Nuevas ordenes de pedido:</h5>
                <div className="accordion" id="accordionPanelsStayOpenExample">
                    {filteredOrders.filter((order) => order.new).map((order) => {
                        return <ItemListOrder
                            key={order.id}
                            order={order}
                            onStateChange={handleStateChange}
                            handleUpdateNew={handleUpdateNew}
                            handleDeletOrder={handleDeletOrder}
                            openModal={openModal}
                        />;
                    })}
                </div>
            </div>
            <h4>Ordenes</h4>
            <div className="search-container">
                <input
                    className="admin-search"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Buscar orden..."
                />
            </div>
            <div className="accordion" id="accordionPanelsStayOpenExample">
                {filteredResults.filter((order):order is Orders => 'new' in order && !order.new).map((order) => {
                    return <ItemListOrder
                        key={order.id}
                        order={order}
                        onStateChange={handleStateChange}
                        handleUpdateNew={handleUpdateNew}
                        handleDeletOrder={handleDeletOrder}
                        openModal={openModal}
                    />;
                })}
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

    );
}

export default AdminOrders
