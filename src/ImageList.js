import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const type = "Image"; // Need to pass which type element can be draggable

const Image = ({ image, index, moveImage, onDoubleClick }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: type,
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Move the content
      moveImage(dragIndex, hoverIndex);
      // Update the index for dragged item directly to avoid flickering when half dragged
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type, id: image.id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  // initialize drag and drop into the element
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
      className="file-item"
    >
      <img
        alt={`img - ${image.id}`}
        src={image.src}
        className="file-img"
        onError={e => (e.target.style.display = "none")}
      />
    </div>
  );
};

const ImageList = ({ images, moveImage, onDoubleClickNode }) => {
  const renderImage = (image, index) => {
    return (
      <div
        key={`${image.id}-image`}
        onDoubleClick={() => {
          onDoubleClickNode(image.id);
        }}
      >
        <center style={{ fontSize: "15px" }}>{image.id}</center>
        <Image image={image} index={index} moveImage={moveImage} />
      </div>
    );
  };

  return (
    <section className="file-list">
      {images
        .filter(item => item.visible === null || item.visible === true)
        .map(renderImage)}
    </section>
  );
};

export default ImageList;
