import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
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
      navigate("/mayoristas");
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
          <div>
            <LazyLoadImage src={`${dev}/${mainImage}`} alt={`Imagen de ${prodResult.name}`} />
          </div>
          <div>
            <span>{prodResult.id}</span>
            <span>{prodResult.name}</span>
            <span>{prodResult.category}</span>
            <span>{prodResult.price}</span>
          </div>
        </>
      );
    }
  }



  return (
    <div className="cont container">
      <h2>Tus pedidos</h2>
      <div className="accordion" id="accordionPanelsStayOpenExample">
        {enhancedOrders
          .filter((order) => order.user.id === userActive?.id)
          .map((order) => (
            <div className="accordion-item" key={order.id}>
              <h2 className="accordion-header">
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
                  <span>Orden n°{order.id}</span>
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                  <span>Total: {formatCurrency(order.total_price)}</span>
                  <span>{order.state}</span>
                </button>
              </h2>
              <div
                id={`panelsStayOpen-${order.id}`}
                className={`accordion-collapse collapse ${openAccordion === order.id ? "show" : ""
                  }`}
              >
                <div className="accordion-body">
                  <div>
                    <h5>Envío</h5>
                    <span>{String(order.shipping)}</span>
                    <span>{order.shippingDetails?.description}</span>
                    <span>{formatCurrency(order.shippingDetails?.price || 0)}</span>
                    <div>
                      <span>{order.address.province}</span>
                      <span>{order.address.city}</span>
                      <span>{order.address.street}</span>
                    </div>
                  </div>
                  <div>
                    <h5>Productos</h5>
                    <ul>
                      {order.products.map((prod) => (
                        <li key={prod.product_id}>
                          {getProductbyId(prod.product_id)}
                          <span> - Cantidad: {prod.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5>Total</h5>
                    <span>{formatCurrency(order.total_price)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrdersUser;
