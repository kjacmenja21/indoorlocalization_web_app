import React, { useState, useEffect, useRef } from "react";

function HeatMapDisplay({ floormapId, heatmapData }) {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);

    const containerSize = { width: 800, height: 600 };
    const imageSize = { width: 1600, height: 1100 }; //TODO: Get image size from API

    useEffect(() => {
        if (heatmapData && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.scale(zoom, zoom);

            // Draw heatmap
            heatmapData.forEach(({ positions }) => {
                if (Array.isArray(positions) && positions.length > 0) {
                    positions.forEach(({ x, y, count }) => {
                        // Normalize coordinates
                        const normalizedX = (x / imageSize.width) * imageSize.width;
                        const normalizedY = (y / imageSize.height) * imageSize.height;

                        const radius = count * 10 / zoom;
                        const gradient = ctx.createRadialGradient(
                            normalizedX,
                            normalizedY,
                            0,
                            normalizedX,
                            normalizedY,
                            radius
                        );
                        gradient.addColorStop(0, "rgba(255, 0, 0, 0.8)");
                        gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

                        ctx.beginPath();
                        ctx.arc(normalizedX, normalizedY, radius, 0, 2 * Math.PI);
                        ctx.fillStyle = gradient;
                        ctx.fill();
                    });
                }
            });

            ctx.restore();
        }
    }, [heatmapData, zoom]);


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
                {/* Heatmap canvas */}
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

export default HeatMapDisplay;
