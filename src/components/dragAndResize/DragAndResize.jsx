import React from "react";
import useDraggableAndResizable from "./useDraggableAndResizable";
import "./drag-and-resize.css";

export default function DragAndResize({ children }) {
  const [ref] = useDraggableAndResizable();

  return (
    <div className="draggable resizable" ref={ref}>
      <div className="resizer resizer--r" />
      <div className="resizer resizer--b" />
      {children}
    </div>
  );
}
