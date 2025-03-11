
import { useEffect, useState } from 'react';
import { useApi } from '../../context/ApiProvider'
import { useOrder } from '../../context/OrderProvider';
import useModal from '../../CustomHooks/useModal';
import useVerifyToken from '../../CustomHooks/useVerefyToken';
import ModalMesagge from '../Tools/ModalMesagge';
import { useSearch } from '../../CustomHooks/useSearch';
import { Orders } from '../../Interfaces/interfaces';
import ItemListOrder from './ItemListOrder';

const AdminOrders = () => {

    const { orders } = useApi();
    const { updateOrderState, updateNew, deleteOrder } = useOrder();
    const { validateToken } = useVerifyToken();
    const { modalConfig, openModal, closeModal } = useModal();
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const { searchQuery, filteredResults, handleSearchChange } = useSearch(orders, true);


    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders]);

    const handleStateChange = async (orderId: number, newState: string) => {

        const order = orders.find(order => order.id === orderId);
        if (!order) {
            openModal("Error", "Orden no encontrada", closeModal);
            return;
        }

        const currentState = order.state;

        if (newState === currentState) {
            return;
        }

        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        try {
            const response = await updateOrderState(orderId, newState)
            if (!response.success) {
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

        const response = await updateNew(orderId);

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
        <>
            <div className="title-page">
                <h4>Ordenes de pedido</h4>
            </div>
            <div className='row gap-4'>
                <div className='col-lg item-cont border-top no-padding'>
                    <div className="title left-decoration">
                        <h5>Nuevas ordenes de pedido:</h5>
                    </div>
                    <div className="item-cont accordion" id="accordionPanelsStayOpenExample">
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
                <div className='col-lg item-cont border-top no-padding'>
                    <div className="title left-decoration">
                        <label htmlFor='admin-searc-order'>
                        <h5>Ordenes vistas:</h5>
                        </label>
                        <div className="search-container">
                        <input
                            id='admin-searc-order'
                            className="admin-search"
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Buscar orden..."
                        />
                    </div>
                    </div>
                    
                    <div className="item-cont accordion" id="accordionPanelsStayOpenExample">
                        {filteredResults.filter((order): order is Orders => 'new' in order && !order.new).map((order) => {
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
    );
}

export default AdminOrders
