import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormImgsProduct } from "../../Interfaces/interfaces";
import SortableImageList from "./SortableImagesList";
import { useApi } from "../../context/ApiProvider";

interface ImageFormProps {
  productId: string;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const FormImg: React.FC<ImageFormProps> = ({ productId, setData }) => {

  const { dev, prod, products } = useApi();
  const { register, reset } = useForm<FormImgsProduct>();
  const [images, setImages] = useState<(FormImgsProduct & { preview: string })[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCurrentFile(file);
      setPreview(previewUrl);
    }
  };

  const addImage = (event: React.FormEvent) => {

    event.preventDefault()

    if (!currentFile) {
      alert("No se ha seleccionado una imagen válida.");
      return;
    }

    const id = `${productId}-${Date.now()}`;
    const newImage: FormImgsProduct & { preview: string } = {
      id,
      product: productId,
      url: currentFile,
      priority: images.length + 1,
      preview: preview || "",
    };

    const updatedImages = [...images, newImage];
    setImages(updatedImages);

    setTimeout(() => {
      setData((prevData: any) => ({
        ...prevData,
        images: updatedImages,
      }));
    }, 0);

    setCurrentFile(null);
    setPreview(null);
    reset();
  };

  useEffect(() => {
    const productToEdit = products.find((product) => product.id === productId);
  
    console.log('productToEdit:', productToEdit)
    
    if (productToEdit) {
      const formattedImages = productToEdit.img_url.map((img, index) => ({
        id: img.id_img || `${productId}-${Date.now()}-${index}`, // Genera un id único si no existe
        product: productId,
        url: img.url,
        priority: index + 1,
        preview: `${dev}${img.url}`, // URL completa para la vista previa
      }));
  
      setImages(formattedImages);
  
      setData((prevData: any) => ({
        ...prevData,
        images: formattedImages.map(({ id, product, url, priority }) => ({
          id,
          product,
          url,
          priority,
        })),
      }));
    }
  }, [productId, products, dev]);

return (
  <div>
    <h2>Subir Imágenes</h2>
    <form onSubmit={addImage}>
      <div>
        <label htmlFor="file">Subir imagen:</label>
        <input
          type="file"
          id="url"
          accept="image/*"
          {...register('url')}
          onChange={handleFileChange}
        />
      </div>
      <button type="submit">Agregar imagen</button>
    </form>
    <h4>Imágenes añadidas:</h4>
    <SortableImageList images={images} setImages={setImages} setData={setData} />
  </div>
);
};

export default FormImg;