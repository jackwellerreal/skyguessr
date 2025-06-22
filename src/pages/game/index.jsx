import React, { useState } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import {
    MapContainer,
    ImageOverlay,
    Marker,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import styles from "./game.module.css";
import "leaflet/dist/leaflet.css";

import map_data from "../../../public/content/map_data.json";
import location_data from "../../../public/content/location_data.json";

export function Game(data) {
    const [guessPosition, setGuessPosition] = useState(null);
    const { locationID, map } = data;

    function ClickHandler({ setGuessPosition }) {
        useMapEvents({
            click(e) {
                setGuessPosition([e.latlng.lat, e.latlng.lng]);
            },
        });
        return null;
    }

    const customMarkerIcon = new L.Icon({
        iconUrl: "/assets/marker_guess.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    function calculateScore(guess_location, real_location, map) {
        if (!guess_location || !real_location || !map_data[map]) {
            console.warn("Missing data");
            return { distance: 0, score: 0 };
        }

        const dy = guess_location[0] - real_location[0];
        const dx = guess_location[1] - real_location[1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= 25) {
            return { distance, score: 5000 };
        }

        const end = map_data[map].bounds.end;
        const avgEnd = (end[0] + end[1]) / 2;
        const maxDistance = avgEnd * 0.5;

        const ratio = Math.max(0, 1 - distance / maxDistance);
        const power = 1.5;
        const score = Math.round(5000 * Math.pow(ratio, power));

        return { distance, score };
    }

    function GuessHandler() {
        const guess_location = guessPosition;
        const real_location = location_data[map][locationID]["location"];

        if (!guess_location || !real_location) {
            console.warn("Missing guess or real location");
            return;
        }

        const result = calculateScore(
            guessPosition,
            location_data[map][locationID]["location"],
            map
        );
        alert(`Score: ${result.score}`);
    }

    return (
        <div className={styles.gamePage}>
            <div className={styles.gameViewer}>
                <ReactPhotoSphereViewer
                    src={`/content/${map}/${locationID}.jpg`}
                    height="100vh"
                    width="100%"
                    navbar={false}
                    maxFov={120}
                    minFov={30}
                    defaultZoomLvl={25}
                    defaultPitch={0}
                    defaultYaw={0}
                />
            </div>

            <div className={styles.gameMinimap}>
                <div className={styles.gameMinimapContainer}>
                    <MapContainer
                        style={{ height: "100%", width: "100%" }}
                        center={map_data[map].bounds.center}
                        zoom={map_data[map].zoom.default}
                        minZoom={map_data[map].zoom.min}
                        maxZoom={map_data[map].zoom.max}
                        scrollWheelZoom={true}
                        zoomControl={false}
                        crs={L.CRS.Simple}
                        dragging={true}
                        inertia={true}
                    >
                        <ImageOverlay
                            url={`/content/maps/${map}.png`}
                            bounds={[
                                map_data[map].bounds.start,
                                map_data[map].bounds.end,
                            ]}
                            attribution="DeDiamondPro/SkyGuide — CC-BY-NC-SA-4.0"
                        />

                        <ClickHandler setGuessPosition={setGuessPosition} />
                        {guessPosition && (
                            <Marker
                                position={guessPosition}
                                icon={customMarkerIcon}
                            />
                        )}
                    </MapContainer>
                </div>
                <button
                    className={styles.gameMinimapButton}
                    onClick={() => {
                        if (guessPosition) {
                            GuessHandler();
                        }
                    }}
                    disabled={!guessPosition}
                >
                    <div className={styles.gameMinimapButtonText}>Guess</div>
                </button>
            </div>
        </div>
    );
}
