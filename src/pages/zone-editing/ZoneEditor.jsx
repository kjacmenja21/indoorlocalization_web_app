import React, { useState } from "react";
import { Rect } from "react-konva";

const ZoneEditor = ({ zone, onUpdate, isEditable }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = () => {
        console.log("Dragging zone", zone);
        setIsDragging(true);
    };

    const handleDragEnd = (e) => {
        setIsDragging(false);
        onUpdate({
            ...zone,
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    const handleTransformEnd = (e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset scale after transformation
        node.scaleX(1);
        node.scaleY(1);

        onUpdate({
            ...zone,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
        });
    };

    return (
        <Rect
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            fill={`#${zone.color}`}
            stroke={isDragging ? "blue" : "black"}
            strokeWidth={2}
            draggable={isEditable}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTransformEnd={handleTransformEnd}
            onClick={(e) => e.cancelBubble = true} // Prevent stage click events
            ref={(node) => {
                if (node && isEditable) {
                    node.setAttrs({
                        name: "zone",
                        draggable: true,
                    });
                }
            }}
        />
    );
};

export default ZoneEditor;
