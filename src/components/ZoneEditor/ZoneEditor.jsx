import React, { useEffect, useRef, useState } from "react";
import { Rect, Transformer } from "react-konva";
import "./_zoneEditor.scss";

const ZoneEditor = ({
  zone,
  onUpdate,
  isEditable,
  stageSize,
  isSelected,
  onClick,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const shapeRef = useRef(null);
  const trRef = useRef(null);

  useEffect(() => {
    if (isEditable && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isEditable]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    const node = e.target;
    const newX = Math.min(Math.max(node.x(), 0), stageSize.width - zone.width);
    const newY = Math.min(
      Math.max(node.y(), 0),
      stageSize.height - zone.height
    );

    node.position({ x: newX, y: newY });

    onUpdate({
      ...zone,
      x: newX,
      y: newY,
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    const newWidth = Math.max(5, node.width() * scaleX);
    const newHeight = Math.max(5, node.height() * scaleY);

    const newX = Math.min(Math.max(node.x(), 0), stageSize.width - newWidth);
    const newY = Math.min(Math.max(node.y(), 0), stageSize.height - newHeight);

    node.position({ x: newX, y: newY });

    onUpdate({
      ...zone,
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    });
  };

  return (
    <Rect
      x={zone.x}
      y={zone.y}
      width={zone.width}
      height={zone.height}
      fill={`#${zone.color}`}
      stroke={isSelected ? "blue" : "black"}
      strokeWidth={2}
      draggable={isEditable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      ref={shapeRef}
      onClick={onClick}
      className="zone-editor"
    />
  );
};

export default ZoneEditor;
