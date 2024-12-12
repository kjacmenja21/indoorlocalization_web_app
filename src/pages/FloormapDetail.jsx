import React from "react";
import { useParams } from "react-router-dom";

function FloormapDetail() {
    const { floormapId } = useParams();

    return (
        <div>
            <h2>Floormap Detail for {floormapId}</h2>
            
        </div>
    );
}

export default FloormapDetail;
