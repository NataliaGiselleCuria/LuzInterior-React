import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormImgsProduct } from "../../Interfaces/interfaces";
import SortableImageList from "./SortableImagesList";
import { useApi } from "../../context/ApiProvider";
import './tools.css'

interface ImageFormProps {
  productId: string;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const FormImg: React.FC<ImageFormProps> = ({ productId, setData }) => {

  const { dev, products } = useApi();
  const { register, reset } = useForm<FormImgsProduct>();
  const [images, setImages] = useState<(FormImgsProduct & { preview: string })[]>([]);
  const [currentFiles, setCurrentFiles] = useState<File[] | null>(null);
  const [previews, setPreviews] = useState<string[] | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const previewUrls = fileArray.map(file => URL.createObjectURL(file));

      setCurrentFiles(fileArray);
      setPreviews(previewUrls);
    }
  };

  const addImages = (event: React.FormEvent) => {
    event.preventDefault();

    if (!currentFiles || currentFiles.length === 0) {
      alert("No se ha seleccionado una imagen válida.");
      return;
    }

    const newImages = currentFiles.map((file, index) => {
      const id = `${productId}-${Date.now()}-${index}`;
      return {
        id,
        product: productId,
        url: file,
        priority: images.length + index + 1,
        preview: previews ? previews[index] : "",
      };
    });

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);

    setTimeout(() => {
      setData((prevData: any) => ({
        ...prevData,
        images: updatedImages.map(({ id, product, url, priority }) => ({
          id,
          product,
          url,
          priority,
        })),
      }));
    }, 0);

    setCurrentFiles(null);
    setPreviews(null);
    reset();
  };

  useEffect(() => {
    const productToEdit = products.find((product) => product.id === productId);

    if (productToEdit) {
      const formattedImages = productToEdit.img_url.map((img, index) => ({
        id: img.id_img || `${productId}-${Date.now()}-${index}`,
        product: productId,
        url: img.url,
        priority: index + 1,
        preview: `${dev}${img.url}`,
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
  }, [productId, products, dev, setData]);

  return (
    <div className="img-form w-100">
      <div>
        <div className="title-page">
          <h5>Subir Imágenes</h5>
        </div>
        <form onSubmit={addImages} className="button-cont align-items-start">
          <input
            type="file"
            id="url"
            accept="image/*"
            {...register('url')}
            onChange={handleFileChange}
            multiple
          />
          <button className="general-button" type="submit">Agregar imagen</button>
        </form>
      </div>
      <div>
        <div className="title-page">
          <h5>Imágenes añadidas:</h5>
        </div>
        <SortableImageList images={images} setImages={setImages} setData={setData} />
      </div>
    </div>
  );
};

export default FormImg;