import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  img: { id: string; preview: string; priority: number };
  onRemove: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, img, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid #ccc",
    margin: "10px 0",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    background: "#f9f9f9",
    borderRadius: "5px",
    gap: "10px",
  };

  return (
    <>
    <li key={img.id} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img
        src={img.preview}
        alt={`Imagen ${img.priority}`}
        style={{ width: "50px", height: "50px", objectFit: "cover" }}
      />
      <span>Prioridad: {img.priority}</span> 
    </li>
     <button onClick={() => {onRemove(img.id)}}> Eliminar </button>
   </>
  );
};

export default SortableItem;