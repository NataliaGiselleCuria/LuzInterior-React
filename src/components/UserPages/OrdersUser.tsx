import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiProvider";
import useCurrencyFormat from "../../CustomHooks/currencyFormat";
import { LazyLoadImage } from "react-lazy-load-image-component";

const OrdersUser = () => {
  const { dev, orders, shipping, products } = useApi();
  const { isLogin, userActive } = useUser();
  const navigate = useNavigate();
  const formatCurrency = useCurrencyFormat();
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  const handleAccordionToggle = (id: number) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const getShippingDetails = (idShipping: string) => {
    return shipping?.find((shipping) => shipping.id_shipping === idShipping) || null;
  };

  const enhancedOrders = orders.map((order) => ({
    ...order,
    shippingDetails: getShippingDetails(String(order.shipping)), // Asocia los detalles completos
  }));

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



  return (
    <div className="cont container">
      <div className="row account-user">
        <div className="col-md-2 col-name-user">
          <span className="back"></span>
          <div className="icon-user">
            {userActive?.name
              ?.split(" ")
              .map(word => word[0].toUpperCase())
              .join("")}
          </div>
          <span className="title-page">
            <h4>{userActive?.name}</h4>
          </span>
          <Link to="/mi_cuenta">
            <button className="general-button">
              Ver mi cuenta
            </button>
          </Link>
        </div>
        <div className="col-md-7 col-user-info">
          <span className="title-page">
            <h3>Mis pedidos</h3>
          </span>
          <div className="item-cont">
            <div className="accordion" id="accordionPanelsStayOpenExample">
              {enhancedOrders.length >= 1 ? (
                enhancedOrders
                  .filter((order) => order.user.id === userActive?.id)
                  .map((order) => (
                    <div className="accordion-item" key={order.id}>
                      <div className="accordion-header">
                        <button
                          className={`accordion-button ${openAccordion === order.id ? "" : "collapsed"
                            }`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#panelsStayOpen-${order.id}`}
                          aria-expanded={openAccordion === order.id ? "true" : "false"}
                          aria-controls={`panelsStayOpen-${order.id}`}
                          onClick={() => handleAccordionToggle(order.id)}
                        >
                          <div className="">
                            <span>Orden n°{order.id}</span>
                            <span>{new Date(order.date).toLocaleDateString()}</span>
                            <span>Total: {formatCurrency(order.total_price)}</span>
                            <span className={`state-${order.state.toLowerCase().replace(/\s+/g, "-")}`}>{order.state}</span>
                          </div>
                        </button>
                      </div>
                      <div
                        id={`panelsStayOpen-${order.id}`}
                        className={`accordion-collapse collapse ${openAccordion === order.id ? "show" : ""
                          }`}
                      >
                        <div className="accordion-body">
                          <div className='item'>
                            <h5>Envío</h5>
                            <div className="item-info">
                              <div><span className="fw-medium">Envío:</span>{String(order.shipping).toUpperCase()}</div>
                              <div>{order.shippingDetails?.description}</div>
                              <div><span className="fw-medium">Valor: </span>{formatCurrency(order.shippingDetails?.price || 0)}</div>
                              <div className="item-info w-100">
                                <span className="fw-medium">Dirección:</span>
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
                                {order.products.map((prod) => (
                                  <li key={prod.product_id}>
                                    {getProductbyId(prod.product_id)}
                                    <div><span className="fw-medium">cantidad:</span> {prod.quantity}</div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div>
                            <h5>Total</h5>
                            <span>{formatCurrency(order.total_price)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))) : (
                <p>Aún no tienes pedidos realizados</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrdersUser;
