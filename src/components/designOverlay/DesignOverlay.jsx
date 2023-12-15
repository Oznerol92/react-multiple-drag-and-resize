import React, { useState, useRef, useEffect } from "react";
import "./design-overlay.css";
import DragAndResize from "../dragAndResize/DragAndResize";

const DesignOverlay = ({
  backgroundImage,
  overlayImage,
  style,
  overlayImages,
}) => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [size, setSize] = useState({ width: 100, height: 100 });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const handleSave = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image
    const backgroundImageObj = new Image();
    backgroundImageObj.src = backgroundImage;
    context.drawImage(backgroundImageObj, 0, 0, canvas.width, canvas.height);

    // Draw overlay image
    const overlayImageObj = new Image();
    overlayImageObj.src = overlayImage;
    context.drawImage(
      overlayImageObj,
      position.x,
      position.y,
      size.width,
      size.height
    );

    // You can also draw other elements or text here if needed

    // Convert canvas to data URL and open it in a new tab
    const dataUrl = canvas.toDataURL();
    const newWindow = window.open();
    newWindow.document.write(`<img src="${dataUrl}" alt="Design" />`);
  };

  return (
    <div className="design-overlay-container" ref={containerRef}>
      <img
        className="background-image"
        src={backgroundImage}
        alt="Background"
        draggable="false"
      />
      <div className="design-constrain" style={style} draggable="false">
        {overlayImages &&
          overlayImages.map((image, index) => (
            <DragAndResize key={index} id={index}>
              <img
                key={index}
                id={index}
                src={URL.createObjectURL(image)}
                alt="Overlay"
                // id="overlayImage"
                className="overlay-content"
                draggable="false"
              />
            </DragAndResize>
          ))}
      </div>
      <button onClick={handleSave}>Save</button>
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={"300px"}
        height={"300px"}
      />
    </div>
  );
};

export default DesignOverlay;
