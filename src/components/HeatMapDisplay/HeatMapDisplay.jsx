import React, { useState, useEffect, useRef } from "react";

function HeatMapDisplay({
                             floormapId,
                             heatmapData
                         }) {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);

    const containerSize = { width: 800, height: 600 };
    const imageSize = { width: 1600, height: 1100 };

    useEffect(() => {
        if (heatmapData && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw heatmap
            heatmapData.forEach(({ positions }) => {
                // Check if positions array exists and has items
                if (Array.isArray(positions) && positions.length > 0) {
                    positions.forEach(({ x, y, count }) => {
                        // Normalize coordinates
                        const normalizedX = (x / imageSize.width) * containerSize.width;
                        const normalizedY = (y / imageSize.height) * containerSize.height;

                        // Draw heatmap circle
                        const radius = count * 10; // Scale radius based on count
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

        }
    }, [heatmapData, zoom, position]);

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
                        position: "absolute",
                        top: position.y,
                        left: position.x,
                        transform: `scale(${zoom})`,
                        transformOrigin: "center",
                    }}
                />
                {/* Heatmap canvas */}
                <canvas
                    ref={canvasRef}
                    width={containerSize.width}
                    height={containerSize.height}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        pointerEvents: "none",
                    }}
                />
            </div>
        </div>
    );
}

export default HeatMapDisplay;
