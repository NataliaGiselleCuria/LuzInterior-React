

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApi } from "../../context/ApiProvider";
import { useCart } from "../../context/CartProvider";
import { useOrder } from "../../context/OrderProvider";
import { useUser } from "../../context/UserContext";
import { Address, Order, Shipping } from "../../Interfaces/interfaces";
import { useUpdateUserInfo } from "../CustomHooks/updateUserInfo";
import ProductsInCart from "../Tools/ProductsInCart";
import FormAddresses from "../Tools/FormAddresses";
import useModal from "../CustomHooks/modal";
import ModalMesagge from "../Tools/ModalMesagge";
import useVerifyToken from "../CustomHooks/verefyToken";


const CheckOut = () => {

  const { modalConfig, openModal, closeModal } = useModal();
  const { openModalAddress, closeModalAddress, isModalOpen, selectedAddress } = useUpdateUserInfo((title, content) => openModal(title, content, closeModal));
  const { userActive, isLogin, userLogout } = useUser();
  const { shipping, settings } = useApi();
  const { cart, totalPrice } = useCart();
  const { sendOrder } = useOrder();
  const { validateToken } = useVerifyToken();

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingshipping, setIsEditingshipping] = useState(true);
  const [selAddress, setSelAddress] = useState<Address | null>(null);
  const [selshipping, setSelshipping] = useState<Shipping | null>(null);

  const navigate = useNavigate();

  //direcciones
  const defaultAddress = userActive?.addresses?.find(address => address.default_address);

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
  const shippingsMessages = (shippingType: string) => {
    let message = '';

    switch (shippingType) {
      case 'free': {
        const valueFree = settings.find(setting => setting.key === 'free_shipping_limit');
        if (valueFree) {
          message = `Pedido superior a ${valueFree.value_number} EL ENVÍO ES GRATIS`;
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
        const valuePickup = settings.find(setting => setting.key === 'store_address');
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

    const addressOrder = selAddress || defaultAddress;
    const shippingOrder = selshipping;

    if (userActive && addressOrder && shippingOrder) {
      const order: Order = {
        user: userActive,
        products: cart,
        total_price: totalPrice,
        address: addressOrder,
        shipping: shippingOrder,
        date: new Date(),
        state: 'En proceso'
      };

      try {
        const response = await sendOrder(order, navigate);

        if (response.success) {
          navigate('/order-confirmation');
        } else {
          openModal( "Error", `Error al procesar la orden:', ${response.message}`, closeModal);
        }
      } catch (error) {
        openModal( "Error", `Error inesperado al enviar la orden:', ${error}`, closeModal);
      }
    } else {
      openModal( "Advertencia", "Por favor, completa todos los datos necesarios antes de enviar tu orden.", closeModal);
    }
  };

  return (
    <div>
      <h2>Generar orden de pedido</h2>
      {(!isLogin) ?
        <>
          <h3>Inicie sesión para continuar</h3>
          <button onClick={() => navigate('/mayoristas', { state: { from: '/checkout' } })}>  Iniciar sesión </button>
          <Link to='/registro'>¿No tienes cuenta aún?</Link>
        </>
        :
        <>
          <div>
            <ProductsInCart></ProductsInCart>
          </div>
          <div>
            <span><p>Sesión inciada con {userActive?.email}</p><button onClick={() => userLogout(navigate)}>Cerrar sesión</button></span>
            <div className="address-order-cont">
              <span>
                <h3>Detalle de envío</h3>
                {!isEditingAddress &&
                  <button onClick={() => setIsEditingAddress(!isEditingAddress)}>Cambiar</button>
                }
              </span>

              {!isEditingAddress ? (
                <div>
                  <span className="adress-order-selected">
                    {selAddress ? (
                      <div>
                        <p>{selAddress.name_address}, {selAddress.last_name}</p>
                        <p>{selAddress.street}, {selAddress.street2}</p>
                        <p>{selAddress.city}, {selAddress.province}</p>
                        <p>{selAddress.cp}</p>
                        <p>{selAddress.tel_address}</p>
                      </div>
                    ) : (
                      defaultAddress && (
                        <div>
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
                <span className="address-options">
                  <p>Elige una dirección:</p>
                  <span>
                    <select
                      onChange={(e) => handleSelectAddress(Number(e.target.value))}
                      defaultValue={selAddress ? selAddress.id_address : defaultAddress?.id_address}>
                      <option value="" disabled>Seleccione una dirección</option>
                      {userActive?.addresses?.map((address) => (
                        <option key={address.id_address} value={address.id_address}>
                          {address.street}, {address.city} ({address.province})
                        </option>
                      ))}
                    </select>
                    <button onClick={() => openModalAddress()}>Agregar nueva dirección</button>
                  </span>
                  <span>
                    {selAddress && (
                      <>
                        <span>
                          <p>{selAddress.name_address}, {selAddress.last_name}</p>
                          <p>{selAddress.street}, {selAddress.street2}</p>
                          <p>{selAddress.city}, {selAddress.province}</p>
                          <p>{selAddress.cp}</p>
                          <p>{selAddress.tel_address}</p>
                        </span>
                        <span>
                          <button onClick={() => openModalAddress(selAddress)}>Editar</button>

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
                      </>
                    )}
                  </span>
                  <button onClick={handleConfirmAddress}>Confirmar Dirección</button>
                </span>
              )}
            </div>
            <div className="shipping-cont">
              <span>
                <h3>Opciones de envío.</h3>
                {!isEditingshipping &&
                  <button onClick={() => setIsEditingshipping(!isEditingshipping)}>Cambiar</button>
                }
              </span>
              {isEditingshipping ? (
                <div>
                  <p>Envío y entrega</p>
                  {shipping.map((option) => (
                    <div key={option.id}>
                      <div>
                        <span>
                          <input
                            type="radio"
                            name="shipping"
                            id={option.id}
                            onChange={() => handleConfirmShipping(option)} />
                          <p>{option.description}</p>
                        </span>
                        <p>{option.price}</p>
                      </div>
                      <div>
                        <p>{shippingsMessages(option.id)}</p>
                      </div>
                    </div>
                  ))};
                  <button onClick={() => setIsEditingshipping(false)}>Confirmar</button>
                </div>
              ) : (
                <>
                  {selshipping &&
                    <>
                      <p>{selshipping.id}</p>
                      <p>{selshipping.description}</p>
                      <p>{shippingsMessages(selshipping.id)}</p>
                      <p>{selshipping.price}</p>
                    </>
                  }

                </>
              )}
            </div>
            <div className="pay-cont">
              <h3>Pago</h3>
              {!isEditingshipping && !isEditingAddress &&
                <>
                  <div>
                    <p>Nos pondremos en contacto para coordinar el pago y la facturación correspondiente.</p>
                  </div>
                  <p>Revisa la información anterior y continúa cuando esté todo listo.</p>
                  <button onClick={handleAddtoOrder}>Finalizar Pedido</button>
                </>
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
        </>
      }
    </div>
  );
};

export default CheckOut;