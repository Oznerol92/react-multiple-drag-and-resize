import { useState, useEffect, useCallback } from "react";
import { clamp } from "./clamp";

const Direction = {
  Horizontal: "Horizontal",
  Vertical: "Vertical",
};

const useDraggableAndResizable = () => {
  const [nodes, setNodes] = useState([]);
  const [offsets, setOffsets] = useState([]);
  const [resizing, setResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [initialSizes, setInitialSizes] = useState([]);

  const addNode = useCallback((node) => {
    console.log(node);
    setNodes((prevNodes) => [...prevNodes, node]);
    setOffsets((prevOffsets) => [...prevOffsets, { dx: 0, dy: 0 }]);
  }, []);

  const handleMouseDown = useCallback(
    (e, index) => {
      if (!nodes[index]) {
        return;
      }
      if (e.target.classList.contains("resizer")) {
        setResizing(true);
        setResizeDirection(e.target.dataset.direction);

        const node = nodes[index];
        const parent = node.parentElement;

        const direction = e.target.classList.contains("resizer--r")
          ? Direction.Horizontal
          : Direction.Vertical;

        const startRect = node.getBoundingClientRect();
        const initialWidth = startRect.width;
        const initialHeight = startRect.height;
        const startPos = {
          x: e.clientX,
          y: e.clientY,
        };

        const parentRect = parent.getBoundingClientRect();
        const currentX = node.offsetLeft;
        const currentY = node.offsetTop;

        const minWidth = 50; // Adjust the minimum width as needed
        const minHeight = 50; // Adjust the minimum height as needed

        const handleMouseMove = (e) => {
          let delta =
            direction === Direction.Horizontal
              ? e.clientX - startPos.x
              : e.clientY - startPos.y;

          const newWidth =
            direction === Direction.Horizontal
              ? initialWidth + delta
              : initialWidth;
          const newHeight =
            direction === Direction.Vertical
              ? initialHeight + delta
              : initialHeight;

          const maxWidth = parentRect.width - currentX;
          const maxHeight = parentRect.height - currentY;

          const clampedWidth = clamp(newWidth, minWidth, maxWidth);
          const clampedHeight = clamp(newHeight, minHeight, maxHeight);

          if (direction === Direction.Horizontal) {
            node.style.width = `${clampedWidth}px`;
            node.style.height = `${
              (clampedWidth * initialHeight) / initialWidth
            }px`;
          } else {
            node.style.width = `${
              (clampedHeight * initialWidth) / initialHeight
            }px`;
            node.style.height = `${clampedHeight}px`;
          }

          updateCursor(direction, index);
        };

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
          resetCursor();
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      } else {
        const startPos = {
          x: e.clientX - offsets[index].dx,
          y: e.clientY - offsets[index].dy,
        };

        const handleMouseMove = (e) => {
          if (!nodes[index] || resizing) {
            return;
          }
          const node = nodes[index];
          const parent = node.parentElement;
          const parentRect = parent.getBoundingClientRect();
          const eleRect = node.getBoundingClientRect();

          let dx = e.clientX - startPos.x;
          let dy = e.clientY - startPos.y;

          const maxX = parentRect.width - eleRect.width;
          const maxY = parentRect.height - eleRect.height;

          dx = clamp(dx, 0, maxX);
          dy = clamp(dy, 0, maxY);

          setOffsets((prevOffsets) => {
            const newOffsets = [...prevOffsets];
            newOffsets[index] = { dx, dy };
            return newOffsets;
          });
          updateCursor(index);
        };

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
          resetCursor();
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    },
    [nodes, offsets, resizing]
  );

  const handleTouchStart = useCallback(
    (e, index) => {
      const touch = e.touches[0];

      if (touch.target.classList.contains("resizer")) {
        setResizing(true);
        setResizeDirection(touch.target.dataset.direction);

        const node = nodes[index];
        const direction = e.target.classList.contains("resizer--r")
          ? Direction.Horizontal
          : Direction.Vertical;

        const startRect = node.getBoundingClientRect();
        const initialWidth = startRect.width;
        const initialHeight = startRect.height;
        const startPos = {
          x: touch.clientX,
          y: touch.clientY,
        };

        const parent = node.parentElement;
        const parentRect = parent.getBoundingClientRect();
        const currentX = node.offsetLeft;
        const currentY = node.offsetTop;

        const minWidth = 25; // Adjust the minimum width as needed
        const minHeight = 25; // Adjust the minimum height as needed

        const handleTouchMove = (e) => {
          if (!nodes[index] || resizing) {
            return;
          }

          const touch = e.touches[0];
          let delta =
            direction === Direction.Horizontal
              ? touch.clientX - startPos.x
              : touch.clientY - startPos.y;

          const newWidth =
            direction === Direction.Horizontal
              ? initialWidth + delta
              : initialWidth;
          const newHeight =
            direction === Direction.Vertical
              ? initialHeight + delta
              : initialHeight;

          const maxWidth = parentRect.width - currentX;
          const maxHeight = parentRect.height - currentY;

          const clampedWidth = clamp(newWidth, minWidth, maxWidth);
          const clampedHeight = clamp(newHeight, minHeight, maxHeight);

          if (direction === Direction.Horizontal) {
            node.style.width = `${clampedWidth}px`;
            node.style.height = `${
              (clampedWidth * initialHeight) / initialWidth
            }px`;
          } else {
            node.style.width = `${
              (clampedHeight * initialWidth) / initialHeight
            }px`;
            node.style.height = `${clampedHeight}px`;
          }

          updateCursor(index);
        };

        const handleTouchEnd = () => {
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleTouchEnd);
          resetCursor();
        };

        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
      } else {
        const startPos = {
          x: touch.clientX - offsets[index].dx,
          y: touch.clientY - offsets[index].dy,
        };

        const handleTouchMove = (e) => {
          if (!nodes[index] || resizing) {
            return;
          }

          const touch = e.touches[0];
          const node = nodes[index];
          const parent = node.parentElement;
          const parentRect = parent.getBoundingClientRect();
          const eleRect = node.getBoundingClientRect();

          let dx = touch.clientX - startPos.x;
          let dy = touch.clientY - startPos.y;
          const maxX = parentRect.width - eleRect.width;
          const maxY = parentRect.height - eleRect.height;
          dx = clamp(dx, 0, maxX);
          dy = clamp(dy, 0, maxY);

          setOffsets((prevOffsets) => {
            const newOffsets = [...prevOffsets];
            newOffsets[index] = { dx, dy };
            return newOffsets;
          });
          updateCursor(index);
        };

        const handleTouchEnd = () => {
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleTouchEnd);
          resetCursor();
        };

        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
      }
    },
    [nodes, offsets, resizing]
  );

  const updateCursor = (index) => {
    document.body.style.cursor = resizing
      ? getResizeCursor(resizeDirection)
      : "move";
    document.body.style.userSelect = "none";
  };

  const resetCursor = () => {
    document.body.style.removeProperty("cursor");
    document.body.style.removeProperty("user-select");
    setResizing(false);
    setResizeDirection(null);
  };

  const getResizeCursor = (direction) => {
    const cursors = {
      top: "ns-resize",
      topRight: "nesw-resize",
      right: "ew-resize",
      bottomRight: "nwse-resize",
      bottom: "ns-resize",
      bottomLeft: "nesw-resize",
      left: "ew-resize",
      topLeft: "nwse-resize",
    };
    return cursors[direction];
  };

  useEffect(() => {
    console.log(nodes);
    if (nodes.length > 0) {
      const parent = nodes[0].parentElement;
      const parentRect = parent.getBoundingClientRect();
      nodes.forEach((node, index) => {
        const eleRect = node.getBoundingClientRect();
        node.style.transform = `translate3d(${offsets[index].dx}px, ${offsets[index].dy}px, 0)`;
        setInitialSizes((prevSizes) => {
          const newSizes = [...prevSizes];
          if (!newSizes[index]) {
            newSizes[index] = { width: eleRect.width, height: eleRect.height };
          }
          return newSizes;
        });
      });
    }
  }, [nodes, offsets, resizing]);

  useEffect(() => {
    if (nodes.length > 0) {
      nodes.forEach((node, index) => {
        node.addEventListener("mousedown", (e) => handleMouseDown(e, index));
        node.addEventListener("touchstart", (e) => handleTouchStart(e, index));
      });

      return () => {
        nodes.forEach((node, index) => {
          node.removeEventListener("mousedown", (e) =>
            handleMouseDown(e, index)
          );
          node.removeEventListener("touchstart", (e) =>
            handleTouchStart(e, index)
          );
        });
      };
    }
  }, [nodes, offsets, resizing]);

  return [addNode];
};

export default useDraggableAndResizable;
