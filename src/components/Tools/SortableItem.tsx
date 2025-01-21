import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import trash from '../../assets/trash.png'
import './tools.css'

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
    <div className="li-img-prod">
      <li key={img.id} ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <LazyLoadImage
          className='img-prod'
          src={img.preview}
          alt={`Imagen ${img.priority}`}
        />
        <span>Prioridad: {img.priority}</span>
      </li>
      <button onClick={() => { onRemove(img.id) }}>
        <LazyLoadImage className="w100 h100 fix-img" src={trash} alt="eliminar"></LazyLoadImage>
        </button>
    </div>
  );
};

export default SortableItem;