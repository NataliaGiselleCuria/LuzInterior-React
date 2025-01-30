import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable";
import SortableItem from "../Tools/SortableItem";
import { FormImgs } from "../../Interfaces/interfaces";
import { useApi } from "../../context/ApiProvider";
import useVerifyToken from "../../CustomHooks/verefyToken";
import ModalMesagge from "../Tools/ModalMesagge";
import useModal from "../../CustomHooks/modal";

const ItemGallery: React.FC = () => {
  const { dev, gallery, refreshGallery } = useApi();
  const { validateToken } = useVerifyToken();
  const { modalConfig, openModal, closeModal } = useModal();
  const { register, reset } = useForm<FormImgs>();
  const [images, setImages] = useState<FormImgs[]>([]);
  const [currentFile, setCurrentFile] = useState<File[] | null>(null);
  const [preview, setPreview] = useState<string[] | null>(null);

  useEffect(() => {
    const loadImages = async () => {

      const formattedImages = gallery.map((img) => ({
        id: img.id,
        url: `${dev}${img.img_url}`,
        priority: img.priority,
        preview: `${dev}${img.img_url}`,
        link: null,
      }));

      const sortedImages = formattedImages.sort((a, b) => a.priority - b.priority);

      setImages(sortedImages);
    };

    loadImages();
  }, [gallery]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
        const previews = Array.from(files).map(file => URL.createObjectURL(file));
        setPreview(previews);
        setCurrentFile(Array.from(files));
    }
  };

  const addImage = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!currentFile || currentFile.length === 0) {
      openModal("Error", "No se ha seleccionado una imagen válida.", closeModal);
      return;
    }
  
    try {
      const isTokenValid = await validateToken();
  
      if (!isTokenValid) {
        openModal("Error", "Token inválido. Por favor, inicie sesión nuevamente.", closeModal);
        return;
      }
  
      const token = localStorage.getItem('token');
  
      for (let i = 0; i < currentFile.length; i++) {
        const formData = new FormData();
        formData.append("image", currentFile[i]);
        formData.append("priority", (images.length + 1 + i).toString()); 
  
        const response = await fetch(`${dev}/index.php?action=add-gallery`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
  
        const result = await response.json();
        if (result.success) {
          const newImage: FormImgs = {
            id: `${Date.now() + i}`,
            url: currentFile[i],
            priority: images.length + 1 + i,
            preview: preview && preview[i] ? preview[i] : "",
            link: null
          };
  
          setImages((prev) => [...prev, newImage]); // Añadir la nueva imagen al estado
        } else {
          openModal("Error", `Error al actualizar la galería: ${result.message}`, closeModal);
        }
      }
  
      setCurrentFile(null);
      setPreview(null);
      refreshGallery();
      reset();
  
    } catch (error) {
      openModal("Error", `Error en la conexión: ${error}`, closeModal);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);

      const updatedImages = arrayMove(images, oldIndex, newIndex).map((img, index) => ({
        ...img,
        priority: index + 1,
      }));

      setImages(updatedImages);

      const updatedPriorities = updatedImages.map((img) => ({
        id: img.id,
        priority: img.priority,
      }));

      updateGallery(updatedPriorities);
    }
  };

  const removeImage = (id: string) => {

    const updatedImages = images
      .filter((img) => img.id !== id)
      .map((img, index) => ({
        ...img,
        priority: index + 1,
      }));

    setImages(updatedImages);

    const updatedPriorities = updatedImages.map((img) => ({
      id: img.id,
      priority: img.priority,
    }));

    updateGallery(updatedPriorities);
  };

  const updateGallery = async (updatedPriorities: Array<{ id: string; priority: number }>) => {
    const payload = {
      images: updatedPriorities,
    };

    try {
      const isTokenValid = await validateToken();

      if (!isTokenValid) {
        openModal("Error", "Token inválido. Por favor, inicie sesión nuevamente.", closeModal);
        return;
      }

      const token = localStorage.getItem('token')

      fetch(`${dev}/index.php?action=update-gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
             openModal("Error", `Error al actualizar la galería: ${data.message}`, closeModal);
          }
          refreshGallery();
        })
    } catch (error) {
      openModal("Error", `Error en la conxión: ${error}`, closeModal);
    }

  };

  return (
    <div className="ul-row-nopadding img-form">    
      <form onSubmit={addImage}>
        <div>
          <input
            type="file"
            id="url"
            accept="image/*"
            {...register("url")}
            onChange={handleFileChange}
            multiple
          />
        </div>
        <button type="submit">Agregar imagen</button>
      </form>
      <h4>Imágenes añadidas:</h4>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <ul className="ul-row-nopadding">
          <SortableContext items={images} strategy={rectSwappingStrategy}>
            {images.map((img) => (
              <SortableItem
                key={img.id}
                id={img.id}
                img={img}
                onRemove={removeImage}
              />
            ))}
          </SortableContext>
        </ul>
      </DndContext>
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
  );
};

export default ItemGallery;