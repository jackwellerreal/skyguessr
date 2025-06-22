import React, { useState, useEffect } from "react";
import styles from "./home.module.css";

export function Home() {
    const [gameConfig, setGameConfig] = useState({
        map: "any",
        max_difficulty: "hard",
        modifiers: {
            noPan: false,
            noZoom: false,
        },
    });

    useEffect(() => {
        const storedConfig = localStorage.getItem("gameConfig");
        if (storedConfig) {
            try {
                setGameConfig(JSON.parse(storedConfig));
            } catch (e) {
                console.warn("Invalid config in localStorage");
                console.error(e);

                setGameConfig({
                    map: "any",
                    max_difficulty: "hard",
                    modifiers: {
                        noPan: false,
                        noZoom: false,
                    },
                });
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("gameConfig", JSON.stringify(gameConfig));
    }, [gameConfig]);

    const modifiersToQueryString = (config) => {
        const params = new URLSearchParams();
        params.set("map", config.map);
        params.set("max_difficulty", config.max_difficulty);
        if (config.modifiers.noPan) {
            params.set("noPan", "true");
        }
        if (config.modifiers.noZoom) {
            params.set("noZoom", "true");
        }
        return `?${params.toString()}`;
    };

    return (
        <div className={styles.homePage}>
            <header className={styles.header}>
                <h1>SkyGuessr</h1>
            </header>
            <div className={styles.homePageGrid}>
                <div className={styles.homePageGridItem}></div>
                <div className={styles.homePageGridItem}>
                    <div>
                        <h2>Play</h2>

                        <hr />
                        <p>What Map do you want to play on?</p>
                        <select
                            id="mapSelect"
                            className={styles.mapSelect}
                            value={gameConfig.map}
                            onChange={(e) =>
                                setGameConfig({
                                    ...gameConfig,
                                    map: e.target.value,
                                })
                            }
                        >
                            <option value="any">Any Map</option>
                            <option value="hub">Hub</option>
                            <option value="park">Park</option>
                            <option value="gold">Gold Mine</option>
                            <option value="farming">Farming Islands</option>
                            <option value="spiders">Spiders Den</option>
                            <option value="end">The End</option>
                            <option value="crimson">Crimson Isle</option>
                        </select>

                        <p>
                            What is the maximum Difficultly you want to play on?
                        </p>
                        <select
                            className={styles.mapSelect}
                            value={gameConfig.max_difficulty}
                            onChange={(e) =>
                                setGameConfig({
                                    ...gameConfig,
                                    max_difficulty: e.target.value,
                                })
                            }
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="insane">Insane</option>
                        </select>

                        <p>Select any modifiers you want to play with:</p>
                        <div className={styles.modifiers}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={gameConfig.modifiers.noPan}
                                    onChange={(e) =>
                                        setGameConfig({
                                            ...gameConfig,
                                            modifiers: {
                                                ...gameConfig.modifiers,
                                                noPan: e.target.checked,
                                            },
                                        })
                                    }
                                />
                                <span>No Pan</span>
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={gameConfig.modifiers.noZoom}
                                    onChange={(e) =>
                                        setGameConfig({
                                            ...gameConfig,
                                            modifiers: {
                                                ...gameConfig.modifiers,
                                                noZoom: e.target.checked,
                                            },
                                        })
                                    }
                                />
                                <span>No Zoom</span>
                            </label>
                        </div>
                    </div>

                    <button
                        className={styles.playButton}
                        onClick={() =>
                            (window.location.href = `/game${modifiersToQueryString(
                                gameConfig
                            )}`)
                        }
                    >
                        Start
                    </button>
                </div>
            </div>
        </div>
    );
}
