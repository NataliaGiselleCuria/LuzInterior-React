

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApi } from "../../context/ApiProvider";
import { useCart } from "../../context/CartProvider";
import { useOrder } from "../../context/OrderProvider";
import { useUser } from "../../context/UserContext";
import { Address, Orders, Shipping } from "../../Interfaces/interfaces";
import { useUpdateUserInfo } from "../../CustomHooks/useUpdateUserInfo";
import useCurrencyFormat from "../../CustomHooks/useCurrencyFormat";
import ProductsInCart from "../Tools/ProductsInCart";
import FormAddresses from "../Tools/FormAddresses";
import useModal from "../../CustomHooks/useModal";
import ModalMesagge from "../Tools/ModalMesagge";
import useVerifyToken from "../../CustomHooks/useVerefyToken";
import logo from "../../assets/alt_logo.png"
import './cart.css'


const CheckOut = () => {
  const { userActive, isLogin, userLogout } = useUser();
  const { shipping, companyInfo } = useApi();
  const { cart, totalPrice } = useCart();
  const { sendOrder } = useOrder();
  const { modalConfig, openModal, closeModal } = useModal();
  const { openModalAddress, closeModalAddress, isModalOpen, selectedAddress } = useUpdateUserInfo((title, content) => openModal(title, content, closeModal));
  const { validateToken } = useVerifyToken();
  const formatCurrency = useCurrencyFormat();
  const navigate = useNavigate();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingshipping, setIsEditingshipping] = useState(true);
  const [selAddress, setSelAddress] = useState<Address | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [selshipping, setSelshipping] = useState<Shipping | null>(null);
  const isCartEmpty = cart.length === 0;
  const [loading, setLoading] = useState(false);

  //direcciones
  useEffect(() => {
    const defaultAddress = userActive?.addresses?.find(address => address.default_address) || userActive?.addresses[0] || null;
    setSelAddress(defaultAddress)
    setDefaultAddress(defaultAddress)
  }, [userActive]);

  useEffect(() => {
    if (selAddress) {
      const updatedAddress = userActive?.addresses?.find(
        addr => addr.id_address === selAddress.id_address
      );

      if (updatedAddress && updatedAddress !== selAddress) {
        setSelAddress(updatedAddress);
      }
    }
  }, [userActive?.addresses, selAddress]);

  useEffect(() => {
    if (userActive?.addresses?.length === 1) {
      setSelAddress(userActive?.addresses[0]);
    }
  }, [userActive?.addresses]);

  const handleSelectAddress = (addressId: number) => {
    const address = userActive?.addresses?.find(addr => addr.id_address === addressId);

    if (address) {
      setSelAddress(address);
    }
  };

  const handleConfirmAddress = () => {
    setIsEditingAddress(false);
  };

  //envío
  const valueFree = () => {
    const value = shipping.find(shipping => shipping.id_shipping === 'min_free_shipping')
    return value?.price || 0;
  };

  const shippingsMessages = (shippingType: string) => {
    let message = '';

    switch (shippingType) {
      case 'free': {
        const freePrice = valueFree();

        if (freePrice) {
          message = `Pedido superior a ${formatCurrency(freePrice)} el envío es gratis`;
        } else {
          message = 'Información no disponible';
        }
        break;
      }
      case 'delivery': {
        message = 'Despacho en el transporte indicado';
        break;
      }
      case 'pickup': {
        const valuePickup = companyInfo.find(setting => setting.key === 'store_address');
        if (valuePickup) {
          message = `${valuePickup.value}`;
        } else {
          message = 'Información no disponible';
        }
        break;
      }

      default: {
        message = 'Tipo de envío no reconocido';
        break;
      }
    }

    return message;
  };

  const handleConfirmShipping = (opc: Shipping) => {
    setSelshipping(opc);
  };

  //Guardar orden
  const handleAddtoOrder = async () => {

    const isTokenValid = await validateToken();

    if (!isTokenValid) {
      return;
    }

    setLoading(true);

    const addressOrder = selAddress || defaultAddress;
    const shippingOrder = selshipping;

    if (userActive && addressOrder && shippingOrder) {
      const order: Orders = {
        id: userActive.id + Math.random(),
        user: userActive,
        products: cart,
        total_price: totalPrice,
        address: addressOrder,
        shipping: shippingOrder,
        date: new Date(),
        state: 'En proceso',
        new: true
      };

      try {
        const response = await sendOrder(order, navigate);

        if (response.success) {
          setLoading(false);
          navigate('/confirmacion');
        } else {
          openModal("Error", `Error al procesar la orden:', ${response.message}`, closeModal);
          setLoading(false);
        }
      } catch (error) {
        openModal("Error", `Error inesperado al enviar la orden:', ${error}`, closeModal);
        setLoading(false);
      }
    } else {
      openModal("Advertencia", "Por favor, completa todos los datos necesarios antes de enviar tu orden.", closeModal);
      setLoading(false);
    }
  };

  return (
    <div className="checkout-body container-md">
      <nav className="container-lg nav-checkout">
        <div className="title-page">
          <img src={logo} alt="logo luz interior"></img>
          <h2>Generar orden de pedido</h2>
          <span className="line"></span>
          <Link to="/" className="small"> ← Seguir navegando  </Link>
        </div>
      </nav>
      <div className="cont container">
        {(!isLogin) ?
          <div className="d-flex justify-content-center">
            <div className="ckeckout login-cont aling-items-center justify-content-center">
              <span className="back"></span>
              <h3 className="text-center">Inicie sesión para continuar</h3>
              <div className="item-cont text-center">
                <button onClick={() => navigate('/login', { state: { from: '/checkout' } })}>  Iniciar sesión </button>
                <Link to='/registro'>¿No tienes cuenta aún?</Link>
              </div>
            </div>
          </div>
          :
          <div className="row checkOut">
            <div className="column-g-20 col-lg-7">
              <span className="email"><p>Sesión iniciada con {userActive?.email}</p><button className="no-button" onClick={() => userLogout(navigate)}>Cerrar sesión</button></span>
              <div className="item-cont border-top">
                <span className="d-flex gap-2">
                  <div className="title left-decoration">
                    <h4>Método de envío</h4>
                  </div>
                  {!isEditingshipping &&
                    <button className="general-button checkout-button" onClick={() => setIsEditingshipping(!isEditingshipping)}>Cambiar</button>
                  }
                </span>
                {isEditingshipping ? (
                  <div className="opc-cont">
                    <h5>Envío y entrega</h5>
                    {shipping
                      .filter(option => option.id_shipping !== 'min_free_shipping')
                      .map(option => (
                        <div key={option.id_shipping} className={`option-cont ${selshipping === option ? 'selected' : ''}`}>
                          <div className="option-radio">
                            <input
                              type="radio"
                              name="shipping"
                              id={option.id_shipping}
                              onChange={() => handleConfirmShipping(option)}
                              disabled={option.id_shipping === 'free' && totalPrice < valueFree()} />
                          </div>
                          <div className="option-info">
                            <span>
                              <p>{option.description}</p>
                              <p>{formatCurrency(option.price)}</p>
                            </span>
                            <p className="small">{shippingsMessages(option.id_shipping)}</p>
                          </div>

                        </div>
                      ))}
                    <button className="light-button" onClick={() => setIsEditingshipping(false)}>Confirmar</button>
                  </div>
                ) : (
                  <>
                    {selshipping &&
                      <div className="info-save">
                        <p>{selshipping.description}</p>
                        <p>{shippingsMessages(selshipping.id_shipping)}</p>
                        <p>{formatCurrency(selshipping.price)}</p>
                      </div>
                    }
                  </>
                )}
              </div>
              {!isEditingshipping && selshipping?.id_shipping !== 'pickup' && (
                <div className="item-cont border-top">
                  <div className="d-flex gap-2">
                    <div className="title left-decoration">
                      <h4>Detalle de envío</h4>
                    </div>
                    {!isEditingAddress &&
                      <button className="general-button checkout-button" onClick={() => setIsEditingAddress(!isEditingAddress)}>Cambiar</button>
                    }
                  </div>

                  {!isEditingAddress ? (
                    <div className="">
                      <span className="opc-cont">
                        {selAddress ? (
                          <div className="info-save">
                            <p>{selAddress.name_address}, {selAddress.last_name}</p>
                            <p>{selAddress.street}, {selAddress.street2}</p>
                            <p>{selAddress.city}, {selAddress.province}</p>
                            <p>{selAddress.cp}</p>
                            <p>{selAddress.tel_address}</p>
                          </div>
                        ) : (
                          defaultAddress && (
                            <div className="info-save">
                              <p>{defaultAddress.name_address}, {defaultAddress.last_name}</p>
                              <p>{defaultAddress.street}, {defaultAddress.street2}</p>
                              <p>{defaultAddress.city}, {defaultAddress.province}</p>
                              <p>{defaultAddress.cp}</p>
                              <p>{defaultAddress.tel_address}</p>
                            </div>
                          )
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="opc-cont">
                      <div>
                        <p>Elige una dirección:</p>
                        <span className="d-flex flex-column gap-1 align-items-start">
                          <select
                            onChange={(e) => handleSelectAddress(Number(e.target.value))}
                            defaultValue={selAddress ? selAddress.id_address : defaultAddress?.id_address}>
                            <option key="default-option" value="" disabled>Seleccione una dirección</option>
                            {userActive?.addresses?.map((address, index) => (
                              <option key={address.id_address || index} value={address.id_address}>
                                {address.street}, {address.city} ({address.province})
                              </option>
                            ))}
                          </select>
                          <button className="no-button" onClick={() => openModalAddress()}>Agregar nueva dirección</button>
                        </span>
                      </div>
                      <span>
                        {selAddress && (
                          <div className="">
                            <span>
                              <p>{selAddress.name_address}, {selAddress.last_name}</p>
                              <p>{selAddress.street}, {selAddress.street2}</p>
                              <p>{selAddress.city}, {selAddress.province}</p>
                              <p>{selAddress.cp}</p>
                              <p>{selAddress.tel_address}</p>
                            </span>
                            <span>
                              <button className="no-button" onClick={() => openModalAddress(selAddress)}>Editar</button>
                            </span>
                            {userActive?.id && isModalOpen && (
                              <div className="modal">
                                <FormAddresses
                                  address={selectedAddress}
                                  id_user={userActive?.id}
                                  onClose={closeModalAddress}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </span>
                      <button className="light-button" onClick={handleConfirmAddress}>Confirmar Dirección</button>
                    </div>
                  )}
                </div>
              )}
              <div className="pay-cont">
                {!isEditingshipping && !isEditingAddress &&
                  <div className="item-cont border-top">
                    <div className="title left-decoration">
                      <h4>Pago</h4>
                    </div>
                    <div>
                      <p>Nos pondremos en contacto para coordinar el pago y la facturación correspondiente.</p>
                      <p>Revisa la información anterior y continúa cuando esté todo listo.</p>
                    </div>
                  </div>
                }
              </div>
            </div>
            <div className="prod-chekout-container col-lg-4">
              <div className="title-page">
                <h4>Resumen de pedido</h4>
              </div>
              <Link to="#" onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}>
                ← Editar pedido
              </Link>
              <div className="item-cont">
                <ProductsInCart price='subtotal' editable={false} ></ProductsInCart>
              </div>
              <div className="">
                <div className="checkout-total-item">
                  <span className="cart-total">
                    <h6>Subtotal</h6>
                  </span>
                  <span>
                    {formatCurrency(totalPrice - (totalPrice * 0.21))}
                  </span>
                </div>
                <div className="checkout-total-item">
                  <span className="cart-total">
                    <h6>Envío</h6>
                  </span>
                  {selshipping &&
                    <div className="total-shipping">
                      <p>{selshipping.id_shipping}</p>
                      <p>{formatCurrency(selshipping.price)}</p>
                    </div>}
                </div>
                <div className="checkout-total-item">
                  <span className="cart-total">
                    <h6>IVA</h6>
                  </span>
                  <span>
                    {formatCurrency(totalPrice * 0.21)}
                  </span>
                </div>
                <div className="checkout-total-item total">
                  <span className="cart-total">
                    <h5>Total</h5>
                  </span>
                  <span>{!selshipping ? (<p>{formatCurrency(totalPrice)}</p>) : (<p>{formatCurrency(totalPrice + selshipping.price)}</p>)}</span>
                </div>
              </div>
              <div className="d-flex flex-column text-center">
                {!loading ? (
                  <>
                    <button className="general-button" onClick={handleAddtoOrder} disabled={isCartEmpty}>Finalizar Pedido</button>
                    {isCartEmpty && <p>Agrege productos para realizar el pedido.</p>}
                  </>
                ) : (
                  <div className="spinner-grow text-secondary" role="status">
                    <span className="visually-hidden">Enviando...</span>
                  </div>
                )
                }
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
        }
      </div>
    </div>
  );
};

export default CheckOut;