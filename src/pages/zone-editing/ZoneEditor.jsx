import React, { useEffect, useRef, useState } from "react";
import { Rect, Transformer } from "react-konva";

const ZoneEditor = ({ zone, onUpdate, isEditable, stageSize }) => {
    const [isDragging, setIsDragging] = useState(false);
    const shapeRef = useRef(null);
    const trRef = useRef(null);

    useEffect(() => {
        if (isEditable && trRef.current && shapeRef.current) {
            // Attach the transformer to the rectangle
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isEditable]);

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = (e) => {
        setIsDragging(false);

        // Ensure the rectangle stays within bounds
        const node = e.target;
        const newX = Math.min(
            Math.max(node.x(), 0),
            stageSize.width - zone.width
        );
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

        // Reset scale after transformation
        node.scaleX(1);
        node.scaleY(1);

        // Calculate new dimensions and enforce boundaries
        const newWidth = Math.max(5, node.width() * scaleX);
        const newHeight = Math.max(5, node.height() * scaleY);

        const newX = Math.min(
            Math.max(node.x(), 0),
            stageSize.width - newWidth
        );
        const newY = Math.min(
            Math.max(node.y(), 0),
            stageSize.height - newHeight
        );

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
        <>
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
                ref={shapeRef}
            />
            {isEditable && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={false} // Optional: Disable rotation if you don't need it
                    boundBoxFunc={(oldBox, newBox) => {
                        // Ensure the rectangle stays within bounds during resizing
                        if (newBox.x < 0 || newBox.y < 0) {
                            return oldBox;
                        }
                        if (
                            newBox.x + newBox.width > stageSize.width ||
                            newBox.y + newBox.height > stageSize.height
                        ) {
                            return oldBox;
                        }
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
};

export default ZoneEditor;
