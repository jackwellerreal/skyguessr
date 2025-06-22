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

const randomLocation = (map) => {
    if (map === "any") {
        const availableMaps = Object.keys(location_data).filter(
            (m) => Object.keys(location_data[m]).length > 0
        );

        if (availableMaps.length === 0) {
            console.warn("No maps with locations found");
            return null;
        }

        map = availableMaps[Math.floor(Math.random() * availableMaps.length)];
    }

    const options = location_data[map];
    const keys = Object.keys(options);

    if (keys.length === 0) {
        console.warn(`No locations found for map: ${map}`);
        return null;
    }

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    //return options["barn_top"]
    return options[randomKey];
};

export function Game() {
    const mapRef = useRef();

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasGuessed, setHasGuessed] = useState(false);
    const [guessPosition, setGuessPosition] = useState(null);
    const [correctPosition, setCorrectPosition] = useState(null);
    const [score, setScore] = useState(null);
    const [linePositions, setLinePositions] = useState(null);

    const [gameConfig] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            map: urlParams.get("map") || "any",
            max_difficulty: urlParams.get("max_difficulty") || "hard",
            modifiers: {
                noPan: urlParams.get("noPan") === "true",
                noZoom: urlParams.get("noZoom") === "true",
            },
        };
    });

    console.log("Game Config:", gameConfig);

    const [location, setLocation] = useState(() =>
        randomLocation(gameConfig.map)
    );

    console.log("Initial Location:", location);

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
        const real_location = location.location;

        if (!guess_location || !real_location) {
            console.warn("Missing guess or real location");
            return;
        }

        const result = calculateScore(
            guess_location,
            real_location,
            location.map
        );

        setHasGuessed(true);
        setCorrectPosition(real_location);
        setLinePositions([guess_location, real_location]);
        setIsFullscreen(true);

        /*alert(`You guessed: [${guess_location[0].toFixed(0)}, ${guess_location[1].toFixed(0)}]\n` +
              `Correct location: [${real_location[0].toFixed(0)}, ${real_location[1].toFixed(0)}]\n` +
              `Distance: ${result.distance.toFixed(0)}\n` +
              `Score: ${result.score}`);*/
              

        if (mapRef.current) {
            setTimeout(() => {
                mapRef.current.invalidateSize();
                const bounds = L.latLngBounds([guess_location, real_location]);
                mapRef.current.fitBounds(bounds, {
                    padding: [50, 50],
                    maxZoom: map_data[location.map].zoom.max ?? 1,
                });
            }, 100);
        }

        setScore(result.score);
    }

    return (
        <div className={styles.gamePage}>
            <div className={styles.gameViewer}>
                <ReactPhotoSphereViewer
                    key={location.id}
                    src={`/content/${location.map}/${location.image}`}
                    height="100vh"
                    width="100%"
                    navbar={false}
                    maxFov={gameConfig.modifiers.noZoom ? 100 : 120}
                    minFov={gameConfig.modifiers.noZoom ? 100 : 30}
                    defaultZoomLvl={25}
                    defaultPitch={0}
                    defaultYaw={0}
                    defaultTransition={{
                        speed: 0,
                        rotation: false,
                        effect: "none",
                    }}
                    mousewheel={!gameConfig.modifiers.noZoom}
                    touchmoveTwoFingers={!gameConfig.modifiers.noZoom}
                    moveInertia={!gameConfig.modifiers.noPan}
                    mousemove={!gameConfig.modifiers.noPan}
                    touchmoveOneFinger={!gameConfig.modifiers.noPan}
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
                        key={location.id}
                        ref={mapRef}
                        style={{ height: "100%", width: "100%" }}
                        center={map_data[location.map].bounds.center}
                        zoom={map_data[location.map].zoom.default}
                        minZoom={map_data[location.map].zoom.min}
                        maxZoom={map_data[location.map].zoom.max}
                        scrollWheelZoom={true}
                        zoomControl={false}
                        crs={L.CRS.Simple}
                        dragging={true}
                        inertia={true}
                    >
                        <ImageOverlay
                            url={`/content/maps/${location.map}${
                                location.underground ? "_underground" : ""
                            }.png`}
                            bounds={[
                                map_data[location.map].bounds.start,
                                map_data[location.map].bounds.end,
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
                            setLocation(randomLocation(location.map));

                            setGuessPosition(null);
                            setCorrectPosition(null);
                            setLinePositions(null);
                            setScore(null);
                            setHasGuessed(false);

                            setIsFullscreen(false);

                            if (mapRef.current) {
                                setTimeout(() => {
                                    mapRef.current.invalidateSize();
                                    mapRef.current.setView(
                                        map_data[location.map].bounds.center,
                                        map_data[location.map].zoom.default
                                    );
                                }, 100);
                            }
                        }
                    }}
                    disabled={!guessPosition}
                >
                    {guessPosition
                        ? isFullscreen
                            ? "Next"
                            : "Submit Guess"
                        : "Click to Guess"}
                </button>
            </div>
        </div>
    );
}
