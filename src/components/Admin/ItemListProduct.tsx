import { useEffect, useState } from "react";
import { useApi } from "../../context/ApiProvider";
import { useProduct } from "../../context/ProductProvider";
import { Editor } from '@tinymce/tinymce-react';
import { FormImgsProduct, FormProduct, Products } from "../../Interfaces/interfaces"
import { useForm } from "react-hook-form";
import FormImg from "../Tools/FormImg";
import useVerifyToken from "../../CustomHooks/useVerefyToken";
import useModal from "../../CustomHooks/useModal";
import ModalMesagge from "../Tools/ModalMesagge";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

export interface ItemListProductProps {
  product: Products;
}

const ItemListProduct = ({ product }: ItemListProductProps) => {
  const { dev, products, categories } = useApi();
  const { deleteProduct, updateProduct, uploadImages } = useProduct();
  const { modalConfig, openModal, closeModal } = useModal();
  const { validateToken } = useVerifyToken();
  const [data, setData] = useState<{ productDetails: FormProduct | null; images: FormImgsProduct[]; }>({ productDetails: null, images: [] });
  const [isEditingProduct, setIsEditingProducts] = useState(false);
  const [isEditingImages, setIsEditingImages] = useState(false);
  const [idEditingProduct, setIdEditingProduct] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { register, handleSubmit, setValue } = useForm<Products>({});

  useEffect(() => {
    if (product) {
      setData({
        productDetails: {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          novelty: product.novelty,
        },
        images: product.img_url.map((img) => ({
          id: img.id_img,
          product: idEditingProduct,
          url: img.url,
          priority: img.priority,
        })),
      });
    }
  }, [product]);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value.trim();

    if (newId !== idEditingProduct && products.some((product) => product.id === newId)) {
      openModal(
        "Advertencia",
        "Ya existe un producto con el id ingresado",
        closeModal
      );
      e.target.value = "";
    }
  };

  const handleEditorChange = (content: string) => {
    setValue('description', content);
  };

  const onSubmitProductInfo = (formData: any) => {
    setIsUpdating(true);
    setData((prevData) => ({
      ...prevData,
      productDetails: { ...formData }
    }));
  };

  const onSubmitImages = (images: FormImgsProduct[]) => {

    setData((prevData) => ({
      ...prevData,
      images,
    }));
    setIsUpdating(true);
  };

  useEffect(() => {
    if (isUpdating && (data.productDetails || data.images.length > 0)) {
      handleUpdate();
      setIsUpdating(false);
    }
  }, [data.productDetails, data.images, isUpdating]);

  const handleUpdate = async () => {
    const isTokenValid = await validateToken();
    if (!isTokenValid) {
      openModal("Error", "Token inválido. Por favor, inicie sesión nuevamente.", closeModal);
      return;
    }

    try {
      let productUpdateSuccess = true;
      let imageUpdateSuccess = true;

      // Actualización de la información del producto
      if (data.productDetails) {
        const updateResponse = await updateProduct(idEditingProduct, data.productDetails);
        if (!updateResponse.success) {
          openModal("Error", `Error al actualizar el producto: ${updateResponse.message}`, closeModal);
        }
      }

      // Actualización de las imágenes del producto
      const originalProduct = products.find((product) => product.id === idEditingProduct);
      const originalImages = originalProduct?.img_url || [];

      const deletedImages: FormImgsProduct[] = originalImages
        .filter(
          (original) =>
            !data.images.some(
              (updated) =>
                updated.id === original.id_img ||
                updated.url === original.url
            )
        )
        .map((original) => ({
          id: original.id_img,
          product: idEditingProduct,
          url: original.url,
          priority: original.priority,
        }));

      if (data.images && data.images.length > 0) {
        const imageResponse = await uploadImages(idEditingProduct, data.images, deletedImages);
        if (!imageResponse.success) {
          openModal("Advertencia", `Producto actualizado, pero hubo un error con las imágenes: ${imageResponse.message}`, closeModal);
        }
      }

      if (productUpdateSuccess && imageUpdateSuccess) {
        openModal("Éxito", "Producto e imágenes actualizados correctamente.", closeModal);
      } else if (productUpdateSuccess && !imageUpdateSuccess) {
        openModal(
          "Advertencia",
          "Producto actualizado, pero hubo un problema al actualizar las imágenes.",
          closeModal
        );
      } else if (!productUpdateSuccess && imageUpdateSuccess) {
        openModal(
          "Advertencia",
          "Imágenes actualizadas, pero hubo un problema al actualizar la información del producto.",
          closeModal
        );
      } else {
        openModal("Error", "No se pudo actualizar el producto ni las imágenes.", closeModal);
      }

      setIsEditingProducts(false);
      setIsEditingImages(false);
    } catch (error) {
      openModal("Error", `Error inesperado al actualizar el producto: ${error}`, closeModal);
    }
  };

  const editProductInfo = async (id: string) => {
    const isTokenValid = await validateToken();
    if (!isTokenValid) {
      return false;
    }
    setIdEditingProduct(id);
    setIsEditingProducts(true);
    setIsEditingImages(false);
  };

  const editProductImages = async (id: string) => {
    const isTokenValid = await validateToken();
    if (!isTokenValid) {
      return false;
    }
    setIdEditingProduct(id);
    setIsEditingImages(true);
    setIsEditingProducts(false);
  };

  const closeEditProduct = () => {
    setIsEditingProducts(false);
    setIsEditingImages(false);
  };

  return (
    <>
      {!isEditingProduct && !isEditingImages ? (
        <>
          <div className="li-product-cont item-cont">
            <div className="item-info">
              <div className="pr-20"><span className="fw-medium">ID:</span> {product.id}</div>
              <div className="pr-20"><span className="fw-medium">Nombre:</span> {product.name}</div>
              <div className="pr-20"><span className="fw-medium">Categoría:</span> {product.category}</div>
              <div className="pr-20"><span className="fw-medium">Precio:</span> {product.price}</div>
            </div>
            <div className="li-product-cont-description">
              <span className="fw-medium">Descripción:</span>
              <span dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
            <div>
              <ul className="ul-row-nopadding">
                {product.img_url.map((img, index) => (
                  <li className="h100 " key={`${product.name} - ${index}`}>
                    <LazyLoadImage className="h100 fix-img" id={img.id_img} src={`${dev}${img.url}`} alt={`${product.name} - ${img.id_img}`} effect='blur'/>
                    {img.priority === 1 &&
                      <span className="priority-mark">Portada</span>
                    }
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="item-info buttons">
            <div className="button-cont">
              <button className="general-button" onClick={() => editProductInfo(product.id)}>Editar Información</button>
              <button className="light-button" onClick={() => editProductImages(product.id)}>Editar Imágenes</button>
            </div>
            <button className="no-button" onClick={() => deleteProduct(product.id)}>Eliminar producto</button>
          </div>
        </>
      ) : (
        <>
          {isEditingProduct && (
            <form className="li-product-cont">
              <div className="item-cont">
                <h6>Categorías actuales:</h6>
                <p>Elige una de las categorías existentes o ingresa una nueva.</p>
                <ul className="ul-row-nopadding ul-categories">
                  {categories.map((category, index) => (
                    <li key={index} onClick={() => setValue('category', category)}>{category}</li>
                  ))}
                </ul>
              </div>
              <div className="item-info">
                <div className="item-form pr-20">
                  <label htmlFor="id">ID:</label>
                  <input id="id" type="text" {...register('id', { required: true })} defaultValue={product.id} onChange={handleIdChange}></input>
                </div>
                <div className="item-form pr-20">
                  <label htmlFor="name">Nombre:</label>
                  <input id="name" type="text" {...register('name', { required: true })} defaultValue={product.name}></input>
                </div>
                <div className="item-form pr-20">
                  <label htmlFor="category">Categoría:</label>
                  <input id="category" type="text" {...register('category', { required: true })} defaultValue={product.category}></input>
                </div>
                <div className="item-form">
                  <label htmlFor="price">Precio:</label>
                  <input id="price" type="number" {...register('price', { required: true })} defaultValue={product.price}></input>
                </div>
              </div>
              <div className="li-product-cont">
                <div>
                  <label htmlFor="description" className="fw-medium">Descripción:</label>
                  <Editor
                    apiKey='l8lb42gic93aurxg94l1ijzbitffo8i746rsk9q9fmazi1th'
                    initialValue={product.description}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: 'lists link image table code',
                      toolbar:
                        'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code',
                    }}
                  />
                </div>
                <textarea className="description-textarea" id="description" {...register('description', { required: true })} defaultValue={product.description}></textarea>
              </div>
              <div className="button-cont">
                <span className="button-check"><label htmlFor="novvelty">Marcar como novedad: </label><input id="novelty" type="checkbox" {...register('novelty')} defaultChecked={product.novelty}></input></span>
                <button className="general-button" type="submit" onClick={handleSubmit(onSubmitProductInfo)}>Guardar Información</button>
              </div>
            </form>
          )}
          {isEditingImages && (
            <div className="li-product-cont">
              <div className="item-info">
                <div className="pr-20"><span className="fw-medium">ID:</span> {product.id}</div>
                <div className="pr-20"><span className="fw-medium">Nombre:</span> {product.name}</div>
                <div className="pr-20"><span className="fw-medium">Categoría:</span> {product.category}</div>
              </div>
              <FormImg productId={idEditingProduct} setData={setData} />
              <div className="button-cont">
                <button className="light-button" type="button" onClick={() => onSubmitImages(data.images)}>Guardar Imágenes</button>
              </div>
            </div>
          )}
          <div className="button-cont">
            <button className="no-button" type="button" onClick={closeEditProduct}>Volver</button>
          </div>
        </>
      )}
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
  );
};

export default ItemListProduct;

