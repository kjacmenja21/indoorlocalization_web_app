import React, { useEffect, useRef, useState } from "react";

function TailMapDisplay({ floormapId, tailmapData }) {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);

    const containerSize = { width: 800, height: 600 };
    const imageSize = { width: 1600, height: 1100 };

    useEffect(() => {
        if (tailmapData && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.scale(zoom, zoom);
            //ctx.translate(position.x / zoom, position.y / zoom);

            // Draw tailmap as lines connecting consecutive positions
            ctx.strokeStyle = "rgba(0, 0, 255, 0.8)";
            ctx.lineWidth = 2 / zoom;

            ctx.beginPath();
            tailmapData.forEach(({ x, y }, index) => {
                const normalizedX = (x / imageSize.width) * imageSize.width;
                const normalizedY = (y / imageSize.height) * imageSize.height;

                if (index === 0) {
                    ctx.moveTo(normalizedX, normalizedY);
                } else {
                    ctx.lineTo(normalizedX, normalizedY);
                }
            });
            ctx.stroke();

            ctx.restore();
        }
    }, [tailmapData, zoom]); //, position

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            const limitedX = Math.min(
                Math.max(newX, -imageSize.width * zoom + containerSize.width),
                0
            );
            const limitedY = Math.min(
                Math.max(newY, -imageSize.height * zoom + containerSize.height),
                0
            );

            setPosition({ x: limitedX, y: limitedY });
        }
    };

    return (
        <div
            className="floormap-detail"
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            style={{ userSelect: "none", overflow: "hidden" }}
        >
            <h2>Floormap Detail for {floormapId}</h2>
            <div
                className="floormap-container"
                style={{
                    width: `${containerSize.width}px`,
                    height: `${containerSize.height}px`,
                    overflow: "hidden",
                    position: "relative",
                    border: "1px solid #ccc",
                    cursor: isDragging ? "grabbing" : "grab",
                }}
                onMouseDown={(e) => {
                    setIsDragging(true);
                    setDragStart({
                        x: e.clientX - position.x,
                        y: e.clientY - position.y,
                    });
                }}
            >
                {/* Floor map image */}
                <img
                    src="https://fapa.jp/fair-2014/wp-content/uploads/2015/05/floormap_16.svg"
                    alt="Floor Map"
                    draggable={false}
                    style={{
                        width: `${imageSize.width}px`,
                        height: `${imageSize.height}px`,
                        position: "absolute",
                        top: position.y,
                        left: position.x,
                        transform: `scale(${zoom})`,
                        transformOrigin: "top left",
                    }}
                />
                {/* Tailmap canvas */}
                <canvas
                    ref={canvasRef}
                    width={imageSize.width}
                    height={imageSize.height}
                    style={{
                        position: "absolute",
                        top: position.y,
                        left: position.x,
                        width: `${imageSize.width}px`,
                        height: `${imageSize.height}px`,
                        transform: `scale(${zoom})`,
                        transformOrigin: "top left",
                        pointerEvents: "none",
                    }}
                />
            </div>
        </div>
    );
}

export default TailMapDisplay;
