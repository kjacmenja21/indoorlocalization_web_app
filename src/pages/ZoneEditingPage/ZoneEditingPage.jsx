import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stage, Layer, Rect } from "react-konva";
import { FloorMapService } from "../../services/floormapService.js";
import ZoneStage from "../../components/ZoneStage/ZoneStage.jsx";
import ZoneMenu from "../../components/ZoneMenu/ZoneMenu.jsx";
import { ZoneService } from "../../services/zoneService.js";
import "./_zoneEditingPage.scss";
import imageConverterService from "src/services/imageConverterService.js";

function ZoneEditing() {
  const { floormapId } = useParams();
  const [floormap, setFloormap] = useState({});
  const [floormapScale, setFloormapScale] = useState(1);
  const [newZone, setNewZone] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [zoneNameError, setZoneNameError] = useState(false);
  const [isFinishedDrawing, setIsFinishedDrawing] = useState(false);
  const containerRef = useRef();
  const [updatedZoneIndices, setUpdatedZoneIndices] = useState(new Set());
  const [realWorldZones, setRealWorldZones] = useState([]);
  const [scaledZones, setScaledZones] = useState([]);
  const [backendZones, setBackendZones] = useState([]);
  const [zoneImage, setZoneImage] = useState(null);

  useEffect(() => {
    FloorMapService.getFloorMapById(floormapId)
      .then((floormap) => {
        console.log(`Fetched floormap details for ID ${floormapId}:`, floormap);
        setFloormap(floormap);

        if (floormap) {
          const zoneImage = imageConverterService.getFloorMapImageSource(floormap);
          if (zoneImage) {
            setZoneImage(zoneImage);
          }
        }

        // Fetch zones associated with the floormap
        ZoneService.getZones(floormapId)
          .then((zones) => {
            console.log(`Fetched zones for floormap ID ${floormapId}:`, zones);
            setBackendZones(zones);
          })
          .catch((error) => {
            console.error(
              `Error fetching zones for floormap ID ${floormapId}:`,
              error
            );
          });
      })
      .catch((error) => {
        console.error(
          `Error fetching floormap details for ID ${floormapId}:`,
          error
        );
      });
  }, [floormapId]);

  useEffect(() => {
    const updateStageSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        const stageWidth = floormap.width || 3000;
        const stageHeight = floormap.height || 2000;
        const scaleFactor = Math.min(
          containerWidth / stageWidth,
          containerHeight / stageHeight
        );

        console.log("Stage size:", stageWidth, stageHeight);
        setStageSize({
          width: stageWidth * scaleFactor,
          height: stageHeight * scaleFactor,
        });
        setFloormapScale(scaleFactor);
      }
    };

    updateStageSize();
    window.addEventListener("resize", updateStageSize);
    return () => window.removeEventListener("resize", updateStageSize);
  }, [floormap]);

  useEffect(() => {
    console.log("Backend zones:", backendZones);
    setScaledZones(convertZonesForDisplay(backendZones, floormapScale));
  }, [floormapScale, backendZones]);

  const convertZonesForDisplay = (zones, scale = 1) => {
    if (!Array.isArray(zones) && typeof zones === "object") {
      // Single zone object
      console.log("convert: ", zones);
      const zone = zones.zone;
      const minX = Math.min(...zone.points.map((p) => p.x));
      const minY = Math.min(...zone.points.map((p) => p.y));
      const maxX = Math.max(...zone.points.map((p) => p.x));
      const maxY = Math.max(...zone.points.map((p) => p.y));

      const width = maxX - minX;
      const height = maxY - minY;

      return {
        id: zone.id,
        name: zone.name,
        color: `#${zone.color.toString(16).padStart(6, "0")}`, // Convert color to hex
        x: minX * scale,
        y: minY * scale,
        width: width * scale,
        height: height * scale,
      };
    }

    // Array of zones
    return zones.map((zone) => {
      const minX = Math.min(...zone.points.map((p) => p.x));
      const minY = Math.min(...zone.points.map((p) => p.y));
      const maxX = Math.max(...zone.points.map((p) => p.x));
      const maxY = Math.max(...zone.points.map((p) => p.y));

      const width = maxX - minX;
      const height = maxY - minY;

      return {
        id: zone.id,
        name: zone.name,
        color: `#${zone.color.toString(16).padStart(6, "0")}`, // Convert color to hex
        x: minX * scale,
        y: minY * scale,
        width: width * scale,
        height: height * scale,
      };
    });
  };

  const convertZoneToRealWorld = (zone) => ({
    ...zone,
    x: zone.x / floormapScale,
    y: zone.y / floormapScale,
    width: zone.width / floormapScale,
    height: zone.height / floormapScale,
  });

  const handleMouseDown = (e) => {
    if (isDrawing && !newZone) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      setNewZone({
        x: pointer.x,
        y: pointer.y,
        width: 0,
        height: 0,
        color: Math.floor(Math.random() * 16777215).toString(16),
      });
    } else if (!isDrawing && newZone) {
      setIsDrawing(false);
      setIsFinishedDrawing(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing && newZone) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      setNewZone((zone) => ({
        ...zone,
        width: pointer.x - zone.x,
        height: pointer.y - zone.y,
      }));
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && newZone) {
      setIsDrawing(false);
      setIsFinishedDrawing(true);
    }
  };

  const handleZoneNameChange = (name) => {
    setZoneName(name);
    setZoneNameError(false);
  };

  const handleSubmitZone = async () => {
    if (!zoneName) {
      setZoneNameError(true);
      return;
    }
    console.log("New zone to submit:", newZone);

    let newZoneData = { ...newZone, name: zoneName };
    // Check overlap
    for (const zone of scaledZones) {
      if (areZonesOverlapping(newZoneData, zone)) {
        console.log("Overlapping zones:", newZoneData, zone);
        alert(
          `The new zone "${zoneName}" overlaps with the existing zone "${zone.name}". Please adjust its position or size.`
        );
        return;
      }
    }

    newZoneData = {
      name: zoneName,
      color: newZone.color,
      x: newZone.x,
      y: newZone.y,
      width: newZone.width,
      height: newZone.height,
    };

    // Convert for backend
    const backendPayload = convertZoneData(newZoneData, floormapId, floormapScale);
    console.log("Zone submitted:", backendPayload);

    try {
      const savedZone = await ZoneService.addZone(backendPayload);
      if (savedZone) {
        const savedZoneData = convertZonesForDisplay(savedZone, floormapScale);
        const updatedZones = [...scaledZones, savedZoneData];
        setScaledZones(updatedZones);
        setNewZone(null);
        setZoneName("");
        setZoneNameError(false);
        setIsFinishedDrawing(false);
        setIsDrawing(false);

        console.log("Zone successfully submitted and saved:", savedZone);
      } else {
        alert("Failed to save the zone. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting zone:", error);
      alert("An error occurred while adding the zone. Please try again later.");
    }
  };

  const handleUndo = () => {
    if (newZone) {
      setNewZone(null);
    }
  };

  const toggleEditMode = () => {
    setIsEditable((prev) => !prev);
  };

  const areZonesOverlapping = (zoneA, zoneB) => {
    const ax1 = zoneA.x;
    const ay1 = zoneA.y;
    const ax2 = zoneA.x + zoneA.width;
    const ay2 = zoneA.y + zoneA.height;

    const bx1 = zoneB.x;
    const by1 = zoneB.y;
    const bx2 = zoneB.x + zoneB.width;
    const by2 = zoneB.y + zoneB.height;

    return !(ax2 <= bx1 || bx2 <= ax1 || ay2 <= by1 || by2 <= ay1);
  };

  const convertZoneData = (zoneData, floorMapId, scale) => {
    const { id, name, color, x, y, width, height } = zoneData;

    // These are already scaled to "stage" coords, but we treat them as the real coords
    // unless you specifically want to further divide by scale.
    const realX = x;
    const realY = y;
    const realWidth = width;
    const realHeight = height;

    const points = [
      { ordinalNumber: 0, x: realX, y: realY },
      { ordinalNumber: 1, x: realX + realWidth, y: realY },
      { ordinalNumber: 2, x: realX + realWidth, y: realY + realHeight },
      { ordinalNumber: 3, x: realX, y: realY + realHeight },
    ];

    return {
      name,
      floorMapId,
      color: parseInt(color.replace("#", ""), 16),
      points,
      id,
    };
  };

  const handleZoneUpdate = (index, updatedScaledZone) => {
    console.log("Updating zone:", index, updatedScaledZone);

    const updatedRealWorldZone = convertZoneToRealWorld(updatedScaledZone);
    const updatedRealWorldZones = [...realWorldZones];
    updatedRealWorldZones[index] = updatedRealWorldZone;
    setRealWorldZones(updatedRealWorldZones);

    const updatedScaledZones = [...scaledZones];
    updatedScaledZones[index] = updatedScaledZone;
    setScaledZones(updatedScaledZones);

    setUpdatedZoneIndices((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.add(index);
      return newSet;
    });
  };

  const saveUpdatedZones = async () => {
    const updatedZonesArray = Array.from(updatedZoneIndices).map(
      (index) => scaledZones[index]
    );

    // Check for overlap among zones being updated and all scaledZones
    for (let i = 0; i < updatedZonesArray.length; i++) {
      for (let j = 0; j < scaledZones.length; j++) {
        if (
          areZonesOverlapping(updatedZonesArray[i], scaledZones[j]) &&
          updatedZonesArray[i].name !== scaledZones[j].name
        ) {
          alert(
            `Zones "${updatedZonesArray[i].name}" and "${scaledZones[j].name}" overlap. Please resolve before saving.`
          );
          return;
        }
      }
    }

    const zonesToSave = updatedZonesArray.map((zone) =>
      convertZoneData(zone, floormapId, 1)
    );

    console.log("Saving updated zones to backend:", zonesToSave);
    try {
      for (const zone of zonesToSave) {
        const savedZone = await ZoneService.updateZone(zone);
        console.log("Saved zone:", savedZone);
      }
      setUpdatedZoneIndices(new Set());
    } catch (error) {
      console.error("Error updating zones:", error);
      alert("An error occurred while updating the zones. Please try again later.");
    }
  };

  const handleNewZoneUpdate = (updatedZone) => {
    if (!zoneName) {
      setZoneNameError(true);
      return;
    }

    const finalizedZone = { ...updatedZone, name: zoneName };
    const newRealWorldZone = convertZoneToRealWorld(finalizedZone);

    setRealWorldZones((prevZones) => [...prevZones, newRealWorldZone]);
    setScaledZones((prevZones) => [...prevZones, finalizedZone]);
    setNewZone(null);
    setZoneName("");
    setZoneNameError(false);
    setIsDrawing(false);
    setIsFinishedDrawing(false);

    console.log("New zone added:", finalizedZone);
    console.log("Converted zone for backend:", convertZoneData(finalizedZone, floormapId));
  };

  const handleDeleteZone = (zoneId) => {
    const updatedZones = scaledZones.filter((zone) => zone.id !== zoneId);
    setScaledZones(updatedZones);

    ZoneService.deleteZone(zoneId)
      .then(() => {
        console.log(`Zone with ID ${zoneId} deleted successfully`);
      })
      .catch((error) => {
        console.error(`Error deleting zone with ID ${zoneId}:`, error);
      });
  };

  return (
    <div className="zone-editing">
      <div className="zone-editing__container">
        <div className="zone-editing__header">
          <h2 className="zone-editing__title">Floormap Detail for {floormapId}</h2>
          <div className="zone-editing__actions">
            <button
              className={`zone-editing__button ${
                isEditable ? "zone-editing__button--active" : ""
              }`}
              onClick={toggleEditMode}
            >
              {isEditable ? "Disable Editing" : "Enable Editing"}
            </button>
            <button
              className="zone-editing__button zone-editing__button--save"
              onClick={saveUpdatedZones}
              disabled={updatedZoneIndices.size === 0}
            >
              Save Changes ({updatedZoneIndices.size})
            </button>
          </div>
        </div>

        <div className="zone-editing__content">
          <div
            className="zone-editing__stage"
            ref={containerRef}
            style={{ position: "relative" }}
          >
            {zoneImage ? (
              <img
                src={zoneImage}
                alt="Floor Map"
                draggable={false}
                style={{
                  zIndex: -1,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: stageSize.width,
                  height: stageSize.height,
                  transform: `scale(1)`,
                  transformOrigin: "center",
                }}
              />
            ) : (
              <p>Loading image...</p>
            )}

            <ZoneStage
              stageSize={stageSize}
              zones={scaledZones}
              newZone={newZone}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onZoneUpdate={handleZoneUpdate}
              onNewZoneUpdate={handleNewZoneUpdate}
              isEditable={isEditable}
              onDeleteZone={handleDeleteZone}
            />
          </div>

          <div className="zone-editing__sidebar">
            <ZoneMenu
              isDrawing={isDrawing}
              setIsDrawing={setIsDrawing}
              zoneName={zoneName}
              zoneNameError={zoneNameError}
              onZoneNameChange={handleZoneNameChange}
              onSubmitZone={handleSubmitZone}
              isFinishedDrawing={isFinishedDrawing}
              onUndo={handleUndo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ZoneEditing;

