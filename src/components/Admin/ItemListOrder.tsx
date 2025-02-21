import { useState } from "react";
import { Orders, OrderStatus } from "../../Interfaces/interfaces";
import useCurrencyFormat from "../../CustomHooks/currencyFormat";
import { useApi } from "../../context/ApiProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface Props {
    order: Orders;
    onStateChange: (orderId: number, newState: string) => void;
    handleUpdateNew: (orderId: number) => void;
    handleDeletOrder: (orderId: number) => void;
    openModal: (title: string, content: string, closeModal: () => void) => void,
}

const ItemListOrder: React.FC<Props> = ({ order, onStateChange, handleUpdateNew, handleDeletOrder, openModal }) => {

    const { dev, products, shipping } = useApi();
    const formatCurrency = useCurrencyFormat();
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newState, setNewState] = useState(order.state);
    const [currentOrder, setCurrentOrder] = useState(order);

    const handleAccordionToggle = (id: number) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const getShippingDetails = (idShipping: string) => {
        return shipping?.find((shipping) => shipping.id_shipping === idShipping) || null;
    };

    const enhancedOrder = {
        ...order,
        shippingDetails: getShippingDetails(String(order.shipping)),
    };

    const getProductbyId = (id: string) => {
        const prodResult = products.find(prod => prod.id === id);
        if (!prodResult) {
            return <div><span><p>El producto con ID `{id}` ya no se encuentra en el sistema</p></span></div>
        } else {
            const mainImage = prodResult.img_url
                ?.sort((a, b) => a.priority - b.priority)[0]?.url || 'ruta/a/imagen/default.png';

            return (
                <>
                    <div className="order-prod-img">
                        <LazyLoadImage src={`${dev}/${mainImage}`} alt={`Imagen de ${prodResult.name}`} />
                    </div>
                    <div className="item-info">
                        <div><span className="fw-medium">id:</span> {prodResult.id}</div>
                        <div><span className="fw-medium">Nombre:</span> {prodResult.name}</div>
                        <div><span className="fw-medium">Categoría:</span> {prodResult.category}</div>
                        <div><span className="fw-medium">Precio:</span> {prodResult.price}</div>
                    </div>
                </>
            );
        }
    }

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewState(e.target.value as OrderStatus);
    };

    const handleSaveState = () => {
        onStateChange(order.id, newState);
        setCurrentOrder(prevOrder => ({ ...prevOrder, state: newState }));
        setIsEditing(false);
    };

    const alertDeleteOrden = () => {
        openModal("Advertencia", "La orden se eliminará definitivamente ¿Continuar de todas formas?", () => handleDeletOrder(order.id));
    }


    return (
        <div className="accordion-item" key={`${order.id} . ${order.user.id}`}>
            <div className="accordion-header">
                <button
                    className={`accordion-button ${openAccordion === order.id ? '' : 'collapsed'}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#panelsStayOpen-${order.id}`}
                    aria-expanded={openAccordion === order.id ? 'true' : 'false'}
                    aria-controls={`panelsStayOpen-${order.id}`}
                    onClick={() => handleAccordionToggle(currentOrder.id)}
                >
                    <div className="fw-medium">
                        <span>Orden n°{order.id}</span>
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                        <span>{order.user.name}</span>
                        <span>Total: {formatCurrency(order.total_price)}</span>
                        <span className={`state-${currentOrder.state.toLowerCase().replace(/\s+/g, "-")}`}>{currentOrder.state}</span>
                    </div>
                </button>
            </div>
            <div
                id={`panelsStayOpen-${order.id}`}
                className={`accordion-collapse collapse ${openAccordion === order.id ? 'show' : ''}`}
            >
                <div className="accordion-body">
                    <div className='item'>
                        <h5>Cliente</h5>
                        <div className="item-info">
                            <div><span className="fw-medium">Nombre:</span> {order.user.name}</div>
                            <div><span className="fw-medium">Email:</span> {order.user.email}</div>
                            <div><span className="fw-medium">CUIT:</span> {order.user.cuit}</div>
                        </div>
                    </div>
                    <div className='item'>
                        <h5>Envío</h5>
                        <div className="item-info">
                            {enhancedOrder.shippingDetails ? (
                                <>
                                    <div><span className="fw-medium">Envío: </span> {enhancedOrder.shippingDetails.description}</div>
                                    <div><span className="fw-medium">Valor: </span> {formatCurrency(enhancedOrder.shippingDetails.price)}</div>
                                </>
                            ) : (
                                <span>Información de envío no disponible</span>
                            )}
                            <div className="item-info w-100">
                                <span className="fw-medium">Dirección: </span>
                                <span>{order.address.street} -</span>
                                <span>{order.address.street2?.trim() ? order.address.street2 : "información adicional no especificada"} -</span>
                                <span> CP: {order.address.cp} -</span>
                                <span>{order.address.city} -</span>
                                <span>{order.address.province} -</span>
                            </div>
                        </div>
                    </div>
                    <div className='item'>
                        <h5>Productos</h5>
                        <div className="item-info">
                            <ul className="order-prods">
                                {order.products.map((prod) => {
                                    return (
                                        <li key={prod.product_id}>
                                            {getProductbyId(prod.product_id)}
                                            <div><span className="fw-medium">cantidad:</span> {prod.quantity}</div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="d-flex align-items-baseline fs-5 gap-2"><h5>Total</h5>{formatCurrency(order.total_price)}</div>
                    <div className="button-cont">
                        {!isEditing ? (
                            <button className="general-button" onClick={() => setIsEditing(true)}>Cambiar estado</button>
                        ) : (
                            <div className="button-cont">
                                <select name="option" defaultValue={newState} onChange={handleStateChange}>
                                    <option value="En proceso">En proceso</option>
                                    <option value="Entregado">Entregado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                                <button className="general-button" onClick={() => handleSaveState()}>Guardar</button>
                            </div>
                        )}

                    </div>
                    <div className="item-info buttons">
                        {order.new ? (
                            <button className="light-button" onClick={() => handleUpdateNew(order.id)}>Marcar como visto</button>
                        ) : (
                            <></>
                        )}
                        <button className="no-button" onClick={() => alertDeleteOrden()}>Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemListOrder
