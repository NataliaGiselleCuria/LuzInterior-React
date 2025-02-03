import React, { useEffect, useState } from 'react'
import ModalMesagge from '../Tools/ModalMesagge';
import useVerifyToken from '../../CustomHooks/verefyToken';
import { useForm } from 'react-hook-form';
import useModal from '../../CustomHooks/modal';
import { useApi } from '../../context/ApiProvider';
import { FormImgs } from '../../Interfaces/interfaces';
import { DndContext, closestCenter } from '@dnd-kit/core';
import SortableItem from '../Tools/SortableItem';
import { arrayMove, SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable';

const ItemBanner = () => {
    const { dev, bannerDesktop, bannerMobile, refreshBanner } = useApi();
    const { validateToken } = useVerifyToken();
    const { modalConfig, openModal, closeModal } = useModal();
    const { register: registerDesktop, reset: resetDesktop } = useForm<FormImgs>();
    const { register: registerMobile, reset: resetMobile } = useForm<FormImgs>();
    const [desktopImages, setDesktopImages] = useState<FormImgs[]>([]);
    const [mobileImages, setMobileImages] = useState<FormImgs[]>([]);
    const [currentFile, setCurrentFile] = useState<File[] | null>(null);
    const [preview, setPreview] = useState<string[] | null>(null);

    useEffect(() => {
        setDesktopImages(
            [...bannerDesktop].map(img => ({
                id: img.id,
                url: `${dev}${img.img_url}`,
                priority: img.priority,
                preview: `${dev}${img.img_url}`,
                link: img.link || '',
            })).sort((a, b) => a.priority - b.priority)
        );

        setMobileImages(
            [...bannerMobile].map(img => ({
                id: img.id,
                url: `${dev}${img.img_url}`,
                priority: img.priority,
                preview: `${dev}${img.img_url}`,
                link: img.link || '',
            })).sort((a, b) => a.priority - b.priority)
        );
    }, [bannerDesktop, bannerMobile]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const previews = Array.from(files).map(file => URL.createObjectURL(file));
            setPreview(previews);
            setCurrentFile(Array.from(files));
        }
    };

    const handleLinkChange = (id: string, value: string, uploadType: "desktop" | "mobile") => {
        if (uploadType === "desktop") {
            setDesktopImages((prev) => {
                const updatedImages = prev.map((img) =>
                    img.id === id ? { ...img, link: value } : img
                );
                // Llamar a updateBanner, pasando tanto las prioridades como los links
                const updatedPriorities = updatedImages.map((img) => ({
                    id: img.id,
                    priority: img.priority,
                    link: img.link || '', // Mantener la prioridad
                }));
                updateBanner(updatedPriorities, 'desktop'); // Actualiza tanto las prioridades como el link
                return updatedImages;
            });
        } else {
            setMobileImages((prev) => {
                const updatedImages = prev.map((img) =>
                    img.id === id ? { ...img, link: value } : img
                );
                // Llamar a updateBanner, pasando tanto las prioridades como los links
                const updatedPriorities = updatedImages.map((img) => ({
                    id: img.id,
                    priority: img.priority, // Mantener la prioridad
                    link: img.link || '',
                }));
                updateBanner(updatedPriorities, 'mobile'); // Actualiza tanto las prioridades como el link
                return updatedImages;
            });
           
            
        }
    };

    const addImage = async (event: React.FormEvent, uploadType: string) => {
        event.preventDefault();
        if (!currentFile) {
            openModal("Error", "No se ha seleccionado una imagen válida.", closeModal);
            return;
        }

        try {
            const isTokenValid = await validateToken();
            if (!isTokenValid) {
                openModal("Error", "Token inválido. Por favor, inicie sesión nuevamente.", closeModal);
                return;
            }

            const token = localStorage.getItem('user_token');

            for (let i = 0; i < currentFile.length; i++) {
                const formData = new FormData();
                formData.append("image", currentFile[i]); // Añadir cada imagen individualmente
                formData.append("priority", (uploadType === 'desktop'
                    ? desktopImages.length + 1 + i
                    : mobileImages.length + 1 + i).toString());

                const imageLink = uploadType === "desktop"
                    ? desktopImages.find(img => img.url === currentFile[i])?.link
                    : mobileImages.find(img => img.url === currentFile[i])?.link;

                formData.append("link", imageLink || "");
                formData.append("type", uploadType);
                formData.append("token", token || "");   
              
                const response = await fetch(`${dev}/index.php?action=add-banner`, {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();
                if (result.success) {

                    const newImage: FormImgs = {
                        id: `${Date.now() + i}`,
                        url: currentFile[i],
                        priority: (uploadType === 'desktop'
                            ? desktopImages.length + 1 + i
                            : mobileImages.length + 1 + i),
                        preview: preview && preview.length > 0 ? preview.join(', ') : "",
                        link: imageLink || "",

                    };

                    if (uploadType === 'desktop') {
                        setDesktopImages((prev) => [...prev, newImage]);
                        resetDesktop();

                    } else {
                        setMobileImages((prev) => [...prev, newImage]);
                        resetMobile();
                    }

                    refreshBanner();
                    setCurrentFile([]);
                    setPreview([]);

                } else {
                    openModal("Error", `Error al subir la imagen: ${result.message}`, closeModal);
                }
            }
        } catch (error) {
            openModal("Error", `Error en la conexión: ${error}`, closeModal);
        }
    };

    const handleDragEndDesktop = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = desktopImages.findIndex((img) => img.id === active.id);
            const newIndex = desktopImages.findIndex((img) => img.id === over.id);

            const updatedImages = arrayMove(desktopImages, oldIndex, newIndex).map((img, index) => ({
                ...img,
                priority: index + 1,
            }));

            setDesktopImages(updatedImages)

            const updatedPriorities = updatedImages.map((img) => ({
                id: img.id,
                priority: img.priority,
                link: img.link || '',
            }));

            updateBanner(updatedPriorities, 'desktop');
        }
    };

    const handleDragEndMobile = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = mobileImages.findIndex((img) => img.id === active.id);
            const newIndex = mobileImages.findIndex((img) => img.id === over.id);

            const updatedImages = arrayMove(mobileImages, oldIndex, newIndex).map((img, index) => ({
                ...img,
                priority: index + 1,
            }));


            setMobileImages(updatedImages)


            const updatedPriorities = updatedImages.map((img) => ({
                id: img.id,
                priority: img.priority,
                link:img.link
            }));

            updateBanner(updatedPriorities, 'mobile');
        }
    };

    const removeImageDesktop = (id: string) => {

        const updatedImages = desktopImages
            .filter((img) => img.id !== id)
            .map((img, index) => ({
                ...img,
                priority: index + 1,
            }));

        setDesktopImages(updatedImages)

        const updatedPriorities = updatedImages.map((img) => ({
            id: img.id,
            priority: img.priority,
            link:img.link
        }));

        updateBanner(updatedPriorities, 'desktop');
    };

    const removeImageMobile = (id: string) => {

        const updatedImages = mobileImages
            .filter((img) => img.id !== id)
            .map((img, index) => ({
                ...img,
                priority: index + 1,
            }));

        setMobileImages(updatedImages)

        const updatedPriorities = updatedImages.map((img) => ({
            id: img.id,
            priority: img.priority,
            link: null
        }));

        updateBanner(updatedPriorities, 'mobile');
    };

    const updateBanner = async (updatedPriorities: Array<{ id: string; priority: number, link:string | null}>, uploadType: string) => {
        const payload = {
            images: updatedPriorities.map((img) => ({
                id: img.id,
                priority: img.priority,
                link: img.link || '', // Enviar el link actualizado
            })),
        };

        try {
            const isTokenValid = await validateToken();

            if (!isTokenValid) {
                openModal("Error", "Token inválido. Por favor, inicie sesión nuevamente.", closeModal);
                return;
            }

            const token = localStorage.getItem('user_token')
            
            const url = uploadType === 'desktop'
            ? `${dev}/index.php?action=update-banner-desktop`
            : `${dev}/index.php?action=update-banner-mobile`;
        
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ payload, uploadType, token }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.success) {
                        openModal("Error", `Error al actualizar la galería: ${data.message}`, closeModal);
                    }
                    refreshBanner();
                })
        } catch (error) {
            openModal("Error", `Error en la conxión: ${error}`, closeModal);
        }

    };

    return (
        <div className="ul-row-nopadding img-form">
            <span>
                <h4>Desktop:</h4>
                <form onSubmit={(e) => addImage(e, 'desktop')}>
                    <div>
                        <input
                            type="file"
                            id="url"
                            accept="image/*"
                            {...registerDesktop("url")}
                            onChange={handleFileChange}
                            multiple
                        />
                    </div>

                    <button type="submit">Agregar imagen</button>
                </form>
                <h5>Imágenes añadidas:</h5>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEndDesktop}>
                    <ul className="ul-row-nopadding">
                        <SortableContext items={desktopImages} strategy={rectSwappingStrategy}>
                            {desktopImages.map((img) => (
                                <span key={img.id}>
                                    <SortableItem
                                        key={img.id}
                                        id={img.id}
                                        img={img}
                                        onRemove={removeImageDesktop}
                                    />
                                    <span>
                                        <label htmlFor={`link-${img.id}`}>Link</label>
                                        <input
                                            id={`link-${img.id}`}
                                            value={img.link || ""}
                                            type='text'
                                            onChange={(e) => handleLinkChange(img.id, e.target.value, 'desktop')}
                                        ></input>
                                    </span>
                                </span>
                            ))}
                        </SortableContext>
                    </ul>
                </DndContext>
            </span>
            <span>
                <h4>Mobile:</h4>
                <form onSubmit={(e) => addImage(e, 'mobile')}>
                    <div>
                        <input
                            type="file"
                            id="url"
                            accept="image/*"
                            {...registerMobile("url")}
                            onChange={handleFileChange}
                            multiple
                        />
                    </div>
                    <button type="submit">Agregar imagen</button>
                </form>
                <h5>Imágenes añadidas:</h5>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEndMobile}>
                    <ul className="ul-row-nopadding">
                        <SortableContext items={mobileImages} strategy={rectSwappingStrategy}>
                            {mobileImages.map((img) => (
                                <span key={img.id}>
                                    <SortableItem
                                        key={img.id}
                                        id={img.id}
                                        img={img}
                                        onRemove={removeImageMobile}
                                    />
                                    <span>
                                        <label htmlFor={`link-${img.id}`}>Link</label>
                                        <input
                                            id={`link-${img.id}`}
                                            value={img.link || ""}
                                            type='text'
                                            onChange={(e) => handleLinkChange(img.id, e.target.value, 'mobile')}>
                                        </input>
                                    </span>
                                </span>
                            ))}

                        </SortableContext>
                    </ul>
                </DndContext>
            </span>
            <ModalMesagge
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                content={<p>{modalConfig.content}</p>}
                onClose={closeModal}
            />
        </div>
    );
}

export default ItemBanner
