import { useForm } from "react-hook-form";
import { FormImgsProduct, FormProduct, Product } from "../../Interfaces/interfaces";
import { useState } from "react";
import FormImg from "../Tools/FormImg";
import { useApi } from "../../context/ApiProvider";
import { useProduct } from "../../context/ProductProvider";
import ModalMesagge from "../Tools/ModalMesagge";
import useModal from "../CustomHooks/modal";
import useVerifyToken from "../CustomHooks/verefyToken";


const AddProductForm = () => {

    const { categories } = useApi();
    const { saveProductAndImages, registerProduct } = useProduct();
    const { register, handleSubmit, getValues, reset } = useForm<FormProduct>({});
    const [productId, setProductId] = useState<string | null>(null);
    const { modalConfig, openModal, closeModal } = useModal();
    const { validateToken } = useVerifyToken();

    const [data, setData] = useState<{ productDetails: FormProduct | null; images: FormImgsProduct[]; }>({ productDetails: null, images: [] });

    const addImg = () => {
        const values = getValues();
        if (!values.id) {
            openModal(
                "Advertencia", "El ID del producto es necesario para agregar imagenes", closeModal
            );
            return;
        }

        setProductId(values.id);
    }

    const addProduct = async (dataForm: FormProduct) => {

        const isTokenValid = await validateToken();

        if (!isTokenValid) {
            return false;
        }

        if (data.images.length === 0) {
            openModal("Advertencia", "Producto sin imágenes. ¿Guardar de todas formas?", () => handleConfirm(dataForm));
            return;
        }

        if (!dataForm) {
            openModal("Advertencia", "Detalles del producto no proporcionados.", closeModal);
            return;
        }

        console.log('imagenes de producto nuevo:', data.images)

        try {
            const response = await saveProductAndImages(dataForm, data.images);

            if (response.success) {
                openModal("Éxito", "Producto e imágenes guardados exitosamente.", closeModal);
                setData({ productDetails: null, images: [] });
                setProductId(null);
                reset();

            } else {
                openModal(
                    "Error", `Error al guardar el producto e imágenes: ${response.message}`, closeModal
                );
            }
        } catch (error) {
            openModal(
                "Error", "Ocurrió un error inesperado al guardar el producto e imágenes.", closeModal
            );
        }
    };

    const handleConfirm = async (productDetails: FormProduct) => {
        const isTokenValid = await validateToken();

        if (!isTokenValid) {
            return false;
        }

        try {
            const response = await registerProduct(productDetails);

            if (response.success) {
                openModal(
                    "Éxito", "Producto guardados exitosamente.", () => closeModal()
                );
            } else {
                openModal(
                    "Error", `Error al guardar el producto: ${response.message}`, () => closeModal()
                );
            }
        } catch (error) {
            openModal(
                "Éxito", `Error al guardar el producto: ${error}`, () => closeModal()
            );
        }
    };

    const cancelEdit = () => {
        setData({ productDetails: null, images: [] });
        setProductId(null);
        reset();
    }

    return (
        <>
            <form>
                <p>Categorias actuales:</p>
                <ul>
                    {categories.map((category, index) => (
                        <li key={index}>{category}</li>
                    ))}
                </ul>
                <span>
                    <label htmlFor="id">Identificador único</label>
                    <input id="id" type="text" {...register('id', { required: true })}></input>
                </span>
                <span>
                    <label htmlFor="name">Nombre</label>
                    <input id="name" type="text" {...register('name', { required: true })}></input>
                </span>
                <span>
                    <label htmlFor="category">Categoría</label>
                    <input id="category" type="text" {...register('category', { required: true })}></input>
                </span>
                <span>
                    <label htmlFor="price">Precio</label>
                    <input id="price" type="number" {...register('price', { required: true })}></input>
                </span>
                <span>
                    <label htmlFor="description">Descripción</label>
                    <input id="description" type="text" {...register('description', { required: true })}></input>
                </span>
            </form>
            <button type="button" onClick={addImg}>Agregar imagenes</button>
            {productId && (
                <>
                    <div>
                        <h3>Imágenes del Producto</h3>
                        <FormImg productId={productId} setData={setData} />
                    </div>
                    <button type="button" onClick={cancelEdit}>Cancelar</button>
                </>
            )}
            <button type="submit" onClick={handleSubmit(addProduct)}>Guardar Producto</button>

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
    )
}

export default AddProductForm
