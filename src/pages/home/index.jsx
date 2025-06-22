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
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512"
                    onClick={() =>
                        window.open(
                            "https://github.com/jackwellerreal/skyguessr",
                            "_blank"
                        )
                    }
                >
                    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                </svg>
            </header>
            <div className={styles.homePageGrid}>
                <div className={styles.homePageGridItem}>
                    <div>
                        <h2>About</h2>

                        <hr />
                        <p>
                            SkyGuessr is a game inspired by{" "}
                            <a
                                href="https://www.geoguessr.com/"
                                target="_blank"
                            >
                                GeoGuessr
                            </a>
                            and a{" "}
                            <a
                                href="https://www.youtube.com/watch?v=v0F-adGB4n8"
                                target="_blank"
                            >
                                Niitroze video
                            </a>{" "}
                            where the goal is to guess the location of a
                            screenshot taken in Hypixel Skyblock.
                        </p>
                    </div>
                    <br />
                    <br />
                    <div>
                        <h2>How to Play</h2>
                        <hr />
                        <ol>
                            <li>Start a game </li>
                            <li>
                                Look at the 360 screenshot and try to guess
                                where it was taken
                            </li>
                            <li>Select a location on the map</li>
                            <li>
                                Get a score based on how close you were to the
                                actual location
                            </li>
                        </ol>
                    </div>
                    <br />
                    <br />
                    <div>
                        <h2>Credits</h2>
                        <hr />
                        <ul>
                            <li>Skycrypt - Background Image</li>
                            <li>Furfsky Reborn - GUI Features</li>
                            <li>SkyGuide - Map Images</li>
                        </ul>
                    </div>
                </div>
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
