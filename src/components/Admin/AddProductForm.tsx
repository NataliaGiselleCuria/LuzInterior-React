import { useForm } from "react-hook-form";
import { Editor } from '@tinymce/tinymce-react';
import { FormImgsProduct, FormProduct } from "../../Interfaces/interfaces";
import { useState } from "react";
import FormImg from "../Tools/FormImg";
import { useApi } from "../../context/ApiProvider";
import { useProduct } from "../../context/ProductProvider";
import ModalMesagge from "../Tools/ModalMesagge";
import useModal from "../../CustomHooks/useModal";
import useVerifyToken from "../../CustomHooks/useVerefyToken";
import './admin.css'


const AddProductForm = () => {

    const { categories, products } = useApi();
    const { saveProductAndImages, registerProduct } = useProduct();
    const { register, handleSubmit, setValue, getValues, setError, clearErrors, reset } = useForm<FormProduct>({});
    const [productId, setProductId] = useState<string | null>(null);
    const { modalConfig, openModal, closeModal } = useModal();
    const { validateToken } = useVerifyToken();
    const [isIdValid, setIsIdValid] = useState(true);
    const [data, setData] = useState<{ productDetails: FormProduct | null; images: FormImgsProduct[]; }>({ productDetails: null, images: [] });

    const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredId = event.target.value;
        const idExists = products.some((product) => product.id === enteredId);

        if (idExists) {
            setIsIdValid(false);
            setError("id", { type: "manual", message: "El ID ya está registrado" });
        } else {
            setIsIdValid(true);
            clearErrors("id");
        }

        setValue("id", enteredId);
    };

    const handleEditorChange = (content: string) => {
        setValue('description', content);
    };

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
                setData({ productDetails: null, images: [] });
                setProductId(null);
                reset();
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
        <div className="">
            <form className="add-prod">
                <div className="item-cont">
                    <h6>Categorías actuales:</h6>
                    <p>Elige una de las categorías existentes o ingresa una nueva.</p>
                    <ul className="ul-row-nopadding ul-categories">
                        {categories.map((category, index) => (
                            <li key={index} onClick={() => setValue('category', category)}>{category}</li>
                        ))}
                    </ul>
                </div>
                <div className="li-product-cont">
                    <div className="item-info">
                        <div className="item-form pr-20">
                            <label htmlFor="id">ID: </label>
                            <input id="id" type="text" {...register('id', { required: true })} onChange={handleIdChange}></input>
                            {!isIdValid && <p style={{ color: "red" }}>El ID ya está registrado</p>}
                        </div>
                        <div className="item-form pr-20">
                            <label htmlFor="name">Nombre: </label>
                            <input id="name" type="text" {...register('name', { required: true })} disabled={!isIdValid}></input>
                        </div>
                        <div className="item-form pr-20">
                            <label htmlFor="category">Categoría: </label>
                            <input id="category" type="text" {...register('category', { required: true })} disabled={!isIdValid}></input>
                        </div>
                        <div className="item-form pr-20">
                            <label htmlFor="price">Precio: </label>
                            <input id="price" type="number" {...register('price', { required: true })} disabled={!isIdValid}></input>
                        </div>
                    </div>
                    <label htmlFor="description" className="fw-medium">Descripción:</label>
                    <Editor
                        apiKey='l8lb42gic93aurxg94l1ijzbitffo8i746rsk9q9fmazi1th'
                        onEditorChange={handleEditorChange}
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: 'lists link image table code',
                            toolbar:
                                'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code',
                        }}
                    />
                    <textarea className="description-textarea" id="description" {...register('description', { required: true })}></textarea>
                    <div className="button-cont">
                        <span className="button-check"><label htmlFor="novelty">Marcar como novedad: </label><input type="checkbox" id="novelty" {...register('novelty')} disabled={!isIdValid}></input></span>
                        <button className="light-button" type="button" onClick={addImg} disabled={!isIdValid}>Agregar imagenes</button>
                    </div>
                </div>
            </form>
            {productId && (
                <div className="li-product-cont">
                    <FormImg productId={productId} setData={setData} />
                    <div className="button-cont">
                        <button className="no-button" type="button" onClick={cancelEdit}>Cancelar</button>
                    </div>
                </div>
            )}
            <div className="button-cont">
                <button className="general-button" type="submit" onClick={handleSubmit(addProduct)}>Guardar Producto</button>
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


export default AddProductForm
