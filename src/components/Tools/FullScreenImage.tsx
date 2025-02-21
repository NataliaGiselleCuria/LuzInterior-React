import { useEffect } from "react";

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

  return (
    <div className="fullscreen-overlay">
      <button className="close-btn" onClick={onClose}>✖</button>
      <div className="fullscreen-content">
        <img src={src} alt={alt || "Imagen en pantalla completa"} className="fullscreen-img" />
      </div>
    </div>
  );
};

export default FullScreenImage;