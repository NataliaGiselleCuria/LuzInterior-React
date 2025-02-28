import { useEffect, useState } from "react";

const FullScreenImage = ({ src, alt, onClose }: { src: string; alt?: string; onClose: () => void }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleZoom = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fullscreen-overlay" >
      <button className="close-btn" onClick={onClose}>✖</button>
      <div className={`fullscreen-content ${isExpanded ? "expanded" : ""}`} onClick={toggleZoom}>
        <img src={src} alt={alt || "Imagen en pantalla completa"}
          className={`fullscreen-img ${isExpanded ? "expanded" : ""}`}>
        </img>
      </div>
    </div>
  );
};

export default FullScreenImage;