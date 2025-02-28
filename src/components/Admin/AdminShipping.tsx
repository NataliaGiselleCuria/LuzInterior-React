import { useForm } from "react-hook-form";
import { useApi } from "../../context/ApiProvider";
import useVerifyToken from "../../CustomHooks/useVerefyToken";
import ModalMesagge from "../Tools/ModalMesagge";
import useModal from "../../CustomHooks/useModal";


const AdminShipping = () => {

  const { dev, shipping } = useApi();
  const { modalConfig, openModal, closeModal } = useModal();
  const { validateToken } = useVerifyToken();
  const { register, handleSubmit } = useForm<Record<string, any>>();

  const updateShipping = async (data: Record<string, any>) => {
    const updatedShipping = shipping.map((item) => ({
      id_shipping: item.id_shipping,
      description: data[`description-${item.id_shipping}`],
      price: parseFloat(data[`price-${item.id_shipping}`]),
    }));

    const isTokenValid = await validateToken();

    if (!isTokenValid) {
      return { success: false, message: "Token inválido." };
    }

    try {

      const token = localStorage.getItem('user_token')

      const response = await fetch(`${dev}/index.php?action=update-shipping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedShipping, token }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        openModal("Error", `Error al actualizar la información: ${result.message}`, closeModal);
        return
      } else {
        openModal("Éxito", "Información actualizada correctamente", closeModal);
      }

    } catch (error) {
      console.error("Error al actualizar:", error);
      openModal("Error", `No se pudo actualizar la información: ${error}`, closeModal);
    }
  };

  return (
    <div className="w-100 shipping">
      <div className="title-page">
        <h4>Envíos</h4>
        <p>Actualiza valores de envío.</p>
      </div>
      <div className="item-cont  border-top">
        <form onSubmit={handleSubmit(updateShipping)}>
          {shipping.map((item) => (
            <li className="item-info" key={item.id_shipping}>
              <h6 className="left-decoration-grey">ID: {item.id_shipping}</h6>
              <div className="description item-form">
                <label htmlFor={`description-${item.id_shipping}`}>Descripción: </label>
                <input
                  id={`description-${item.id_shipping}`}
                  type="text"
                  {...register(`description-${item.id_shipping}`, {
                    required: "Este campo es obligatorio",
                  })}
                  defaultValue={item.description} // Muestra el valor por defecto de la base de datos.
                />
              </div>
              <div className="item-form">
                <label htmlFor={`price-${item.id_shipping}`}>Precio: </label>
                <input
                  id={`price-${item.id_shipping}`}
                  type="number"
                  {...register(`price-${item.id_shipping}`, {
                    required: "Este campo es obligatorio",
                  })}
                  defaultValue={item.price} // Muestra el valor por defecto de la base de datos.
                />
              </div>
            </li>
          ))}
          <div className="button-cont">
            <button className="general-button">Actualizar</button>
          </div>
        </form>
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

export default AdminShipping
