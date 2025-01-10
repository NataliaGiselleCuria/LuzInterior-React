import { useState } from "react";
import { Orders, OrderStatus } from "../../Interfaces/interfaces";
import useCurrencyFormat from "../CustomHooks/currencyFormat";
import { useApi } from "../../context/ApiProvider";

interface Props {
    order: Orders;
    onStateChange: (orderId: number, newState: string) => void;
    handleUpdateNew: (orderId: number) => void;
    handleDeletOrder:(orderId:number) => void;
    openModal: (title: string, content: string, closeModal: () => void) => void,
}

const ItemListOrder: React.FC<Props> = ({ order, onStateChange, handleUpdateNew,  handleDeletOrder, openModal }) => {

    const { products } = useApi();
    const formatCurrency = useCurrencyFormat();
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newState, setNewState] = useState(order.state);
    const [currentOrder, setCurrentOrder] = useState(order);

    const handleAccordionToggle = (id: number) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const getProductbyId = (id: string) => {
        const prodResult = products.find(prod => prod.id === id);
        if (!prodResult) {
            return <div><span><p>El producto con ID `{id}` ya no se encuentra en el sistema</p></span></div>
        } else {
            return <div><span>{prodResult.id}</span><span>{prodResult.name}</span><span>{prodResult.category}</span><span>{prodResult.price}</span></div>
        }
    }

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewState(e.target.value as OrderStatus);
    };

    const handleSaveState  = () => {
        onStateChange(order.id, newState);
        setCurrentOrder(prevOrder => ({ ...prevOrder, state: newState }));
        setIsEditing(false);
    };

    const alertDeleteOrden = () => {
        openModal("Advertencia", "La orden se eliminará definitivamente ¿Continuar de todas formas?", () => handleDeletOrder(order.id));
    }


    return (
        <div className="accordion-item" key={`${order.id} . ${order.user.id}`}>
            <h2 className="accordion-header">
                <button
                    className={`accordion-button ${openAccordion === order.id ? '' : 'collapsed'}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#panelsStayOpen-${order.id}`}
                    aria-expanded={openAccordion === order.id ? 'true' : 'false'}
                    aria-controls={`panelsStayOpen-${order.id}`}
                    onClick={() => handleAccordionToggle(currentOrder.id)}
                >    
                    <span>{order.id}</span>
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                    <span>{order.user.name}</span>
                    <span>{formatCurrency(order.total_price)}</span>
                    <span>{currentOrder.state}</span>   
                </button>
            </h2>
            <div
                id={`panelsStayOpen-${order.id}`}
                className={`accordion-collapse collapse ${openAccordion === order.id ? 'show' : ''}`}
            >
                <div className="accordion-body">
                    <div>
                        <h5>Cliente</h5>
                        <span>{order.user.name}</span>
                        <span>{order.user.email}</span>
                        <span>{order.user.cuit}</span>
                    </div>
                    <div>
                        <h5>Envío</h5>
                        <span>{String(order.shipping)}</span>
                        <span>{order.shipping.description}</span>
                        <span>{order.shipping.price}</span>
                        <div>
                            <span>{order.address.province}</span>
                            <span>{order.address.city}</span>
                            <span>{order.address.street}</span>
                        </div>                      
                    </div>
                    <div>
                        <h5>Productos</h5>
                        {order.products.map((prod) => {
                            return (
                                <li key={prod.product_id}>
                                    {getProductbyId(prod.product_id)}
                                    <span>cantidad: {prod.quantity} </span>  
                                </li>
                            );
                        })}
                    </div> 
                    <div>
                        <h5>Total</h5>
                        <span>{formatCurrency(order.total_price)}</span>
                    </div>                  
                    <div>
                        {!isEditing ? (
                             <button onClick={() =>setIsEditing(true)}>Cambiar estado</button>
                        ) : (
                            <div>
                                <select name="option" defaultValue={newState} onChange={handleStateChange}>
                                    <option value="En proceso">En proceso</option>
                                    <option value="Entregado">Entregado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                                <button onClick={() => handleSaveState()}>Guardar</button>
                            </div>
                        )}

                    </div>
                    <div>
                        <button onClick={()=>alertDeleteOrden()}>Eliminar</button>
                        {order.new ? (
                            <button onClick={()=> handleUpdateNew(order.id)}>Marcar como visto</button>
                        ):(
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemListOrder
