import { Link } from 'react-router-dom'
import useCurrencyFormat from "../../CustomHooks/useCurrencyFormat";
import { useApi } from '../../context/ApiProvider'
import { useUser } from '../../context/UserContext'
import logo from '../../assets/alt_logo.png'
import './cart.css'
import ProductDetail from '../Tools/ProductDetail';


const ConfirmationOrder = () => {

    const { orders, shipping } = useApi();
    const { userActive } = useUser();
    const formatCurrency = useCurrencyFormat();

    const userOrders = orders.filter(order => order.user.id === userActive?.id);
    const lastOrder = userOrders.length > 0
        ? userOrders.reduce((latest, order) => new Date(order.date) > new Date(latest.date) ? order : latest)
        : null;

    const getShippingDetails = (idShipping: string) => {
        return shipping?.find((shipping) => shipping.id_shipping === idShipping) || null;
    };

    const enhancedOrder = {
        ...lastOrder,
        shippingDetails: getShippingDetails(String(lastOrder?.shipping)),
    };

    return (
        <div>
            <div className="checkout-body container-md">
                <nav className="container-lg nav-checkout">
                    <div className="title-page">
                        <img src={logo} alt="logo luz interior"></img>
                        <h2>Confimación de orden de pedido</h2>
                        <span className="line"></span>
                        <Link to="/" className="small"> ← Seguir navegando  </Link>
                    </div>
                </nav>
                <div className="cont container">
                    {lastOrder ? (
                        <>
                            <div className='confirmation-message'>
                                <span className='back'></span>
                                <p>Gracias por tu compra!</p> 
                                <p>Pronto nos comunicaremos para finalizar el proceso de compra.</p>
                                <p>Cualquier cambio y actualización será notificada por email.</p>
                            </div>
                            <div className="order-details">
                            <h3>Orden #{lastOrder.id}</h3>
                            <div className='item-cont'>
                                <div className="title">
                                    <h5>Cliente</h5>
                                </div>
                                <div className="item-info">
                                    <div className="pr-20"><span className="fw-medium">Nombre:</span> {lastOrder.user.name}</div>
                                    <div className="pr-20"><span className="fw-medium">Email:</span> {lastOrder.user.email}</div>
                                    <div className="pr-20"><span className="fw-medium">CUIT:</span> {lastOrder.user.cuit}</div>
                                </div>
                            </div>
                            <div className='item-cont border-top'>
                                <div className="title">
                                    <h5>Envío</h5>
                                </div>
                                <div className="item-info">
                                    {enhancedOrder.shippingDetails ? (
                                        <>
                                            <div className="pr-20"><span className="fw-medium">Envío: </span> {enhancedOrder.shippingDetails.description}</div>
                                            <div className="pr-20"><span className="fw-medium">Valor: </span> {formatCurrency(enhancedOrder.shippingDetails.price)}</div>
                                        </>
                                    ) : (
                                        <span>Información de envío no disponible</span>
                                    )}
                                    <div className="item-info w-100">
                                        <span className="fw-medium">Dirección: </span>
                                        <span>{lastOrder.address.street} -</span>
                                        <span>{lastOrder.address.city} -</span>
                                        <span>{lastOrder.address.province} -</span>
                                        <span> CP: {lastOrder.address.cp} -</span>
                                        <span>{lastOrder.address.street2?.trim() ? lastOrder.address.street2 : "información adicional no especificada"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='item-cont border-top'>
                                <div className="title">
                                    <h5>Productos</h5>
                                </div>
                                <div className="item-info">
                                    <ul className="order-prods">
                                        {lastOrder.products.map((prod) => {
                                            return (
                                                <li key={prod.product_id}>
                                                    <ProductDetail id={prod.product_id} />
                                                    <div><span className="fw-medium">cantidad:</span> {prod.quantity}</div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className="cart-total item-cont">
                                <div>
                                    <div className="d-flex align-items-baseline gap-2"><h6>Subtotal</h6>{formatCurrency(lastOrder.total_price)}</div>
                                    {enhancedOrder.shippingDetails ? (
                                        <>
                                            <div className="d-flex align-items-baseline gap-2"><h6>Envío</h6>{formatCurrency(enhancedOrder.shippingDetails.price)}</div>
                                            <div className="d-flex align-items-baseline border-top gap-2"><h6>Total</h6>{formatCurrency(lastOrder.total_price + enhancedOrder.shippingDetails.price)}</div>
                                        </>
                                    ) : (
                                        <div className="d-flex align-items-baseline gap-2 border-top"><h6>Total</h6>{formatCurrency(lastOrder.total_price)}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        </>
                    ) : (
                        <p>No se encontró una orden reciente.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ConfirmationOrder
