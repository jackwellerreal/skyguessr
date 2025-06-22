import React, { useState, useRef } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import {
    MapContainer,
    ImageOverlay,
    Marker,
    Polyline,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import styles from "./game.module.css";
import "leaflet/dist/leaflet.css";

import map_data from "../../../public/content/map_data.json";
import location_data from "../../../public/content/location_data.json";

export function Game(data) {
    const mapRef = useRef();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasGuessed, setHasGuessed] = useState(false);
    const [guessPosition, setGuessPosition] = useState(null);
    const [correctPosition, setCorrectPosition] = useState(null);
    const [score, setScore] = useState(null);
    const [linePositions, setLinePositions] = useState(null);

    const { locationID, map } = data;

    function ClickHandler({ setGuessPosition, disabled }) {
        useMapEvents({
            click(e) {
                if (!disabled) {
                    setGuessPosition([e.latlng.lat, e.latlng.lng]);
                }
            },
        });
        return null;
    }

    const guessMarkerIcon = new L.Icon({
        iconUrl: "/assets/marker_guess.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    const correctMarkerIcon = new L.Icon({
        iconUrl: "/assets/marker_correct.png",
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

        const perfectRadius = 25;

        if (distance <= perfectRadius) {
            return { distance, score: 5000 };
        }

        const end = map_data[map].bounds.end;
        const avgEnd = (end[0] + end[1]) / 2;
        const maxDistance = avgEnd * 0.5;

        const excessDistance = distance - perfectRadius;
        const adjustedMax = Math.max(1, maxDistance - perfectRadius);

        const ratio = Math.max(0, 1 - excessDistance / adjustedMax);
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

        const result = calculateScore(guess_location, real_location, map);

        setHasGuessed(true);
        setCorrectPosition(real_location);
        setLinePositions([guess_location, real_location]);
        setIsFullscreen(true);

        /*alert(`You guessed: [${guess_location[0].toFixed(0)}, ${guess_location[1].toFixed(0)}]\n` +
              `Correct location: [${real_location[0].toFixed(0)}, ${real_location[1].toFixed(0)}]\n` +
              `Distance: ${result.distance.toFixed(0)}\n` +
              `Score: ${result.score}`);
              */

        if (mapRef.current) {
            setTimeout(() => {
                mapRef.current.invalidateSize();
                const bounds = L.latLngBounds([guess_location, real_location]);
                mapRef.current.fitBounds(bounds, {
                    padding: [50, 50],
                    maxZoom: map_data[map].zoom.max ?? 1,
                });
            }, 100);
        }

        setScore(result.score);
    }

    return (
        <div className={styles.gamePage}>
            <div className={styles.gameViewer}>
                <ReactPhotoSphereViewer
                    src={`/content/${map}/${location_data[map][locationID].image}`}
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
            <div
                className={`${styles.gameMinimap} ${
                    isFullscreen ? styles.gameMinimapFullscreen : ""
                }`}
            >
                <div
                    className={styles.gameMinimapHeader}
                    style={
                        isFullscreen ? { display: "flex" } : { display: "none" }
                    }
                >
                    <div className={styles.gameMinimapHeaderBar}>
                        <div
                            className={styles.gameMinimapHeaderBarInside}
                            style={{
                                width: score !== null ? `${score / 50}%` : "0%",
                            }}
                        >
                            {score}
                        </div>
                    </div>
                </div>

                <div className={styles.gameMinimapContainer}>
                    <MapContainer
                        ref={mapRef}
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
                            url={`/content/maps/${map}${
                                location_data[map][locationID]["underground"]
                                    ? "_underground"
                                    : ""
                            }.png`}
                            bounds={[
                                map_data[map].bounds.start,
                                map_data[map].bounds.end,
                            ]}
                            attribution="DeDiamondPro/SkyGuide — CC-BY-NC-SA-4.0"
                        />

                        <ClickHandler
                            setGuessPosition={setGuessPosition}
                            disabled={isFullscreen}
                        />

                        {guessPosition && (
                            <Marker
                                position={guessPosition}
                                icon={guessMarkerIcon}
                            />
                        )}

                        {correctPosition && (
                            <Marker
                                position={correctPosition}
                                icon={correctMarkerIcon}
                            />
                        )}

                        {linePositions && (
                            <Polyline
                                positions={linePositions}
                                pathOptions={{
                                    color: "white",
                                    weight: 4,
                                    dashArray: "10, 10",
                                    dashOffset: "10",
                                }}
                            />
                        )}
                    </MapContainer>
                </div>
                <button
                    className={styles.gameMinimapButton}
                    onClick={() => {
                        if (!hasGuessed) {
                            GuessHandler();
                        } else {
                            setGuessPosition(null);
                            setCorrectPosition(null);
                            setLinePositions(null);
                            setScore(null);
                            setIsFullscreen(false);
                            setHasGuessed(false);

                            if (mapRef.current) {
                                setTimeout(() => {
                                    mapRef.current.invalidateSize();
                                    mapRef.current.setView(
                                        map_data[map].bounds.center,
                                        map_data[map].zoom.default
                                    );
                                }, 100);
                            }
                        }
                    }}
                    disabled={!guessPosition}
                >
                    <div className={styles.gameMinimapButtonText}>
                        {guessPosition
                            ? isFullscreen
                                ? "Next"
                                : "Submit Guess"
                            : "Click to Guess"}
                    </div>
                </button>
            </div>
        </div>
    );
}
