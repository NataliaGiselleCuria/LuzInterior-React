import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { FormImgsProduct } from "../../Interfaces/interfaces";
import { useCallback } from "react";

interface SortableImageListProps {
    images: (FormImgsProduct & { preview: string; id: string })[];
    setImages: React.Dispatch<React.SetStateAction<(FormImgsProduct & { preview: string; id: string })[]>>;
    setData: React.Dispatch<React.SetStateAction<any>>;
}

const SortableImageList: React.FC<SortableImageListProps> = ({ images, setImages, setData }) => {

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = images.findIndex((img) => img.id === active.id);
            const newIndex = images.findIndex((img) => img.id === over.id);

            const updatedImages = arrayMove(images, oldIndex, newIndex).map((img, index) => ({
                ...img,
                priority: index + 1, // Actualiza las prioridades según el nuevo orden
            }));

            setImages(updatedImages);
            setData((prevData: any) => ({
                ...prevData,
                images: updatedImages, // Actualiza también en `setData`
            }));
        }
    };

    const removeImage = useCallback((id: string) => {
        const updatedImages = images.filter((image) => image.id !== id)
            .map((img, index) => ({
                ...img,
                priority: index + 1,
            }));

        setImages(updatedImages);

        setData((prevData: any) => ({
            ...prevData,
            images: updatedImages,
        }));

    }, [images]);


    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images} strategy={verticalListSortingStrategy}>
                <ul>
                    {images.map((img,index) => (
                        <SortableItem key={`${img.id}-${index}`} id={img.id} img={img} onRemove={removeImage} />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
};

export default SortableImageList;