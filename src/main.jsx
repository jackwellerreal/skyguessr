import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "./pages/home/index.jsx";
import { Game } from "./pages/game/index.jsx";

import location_data from "../public/content/location_data.json";

import "./styles.css";

// pick a random location from the location data
const randomLocation = () => {
    const locations = ["hub"];
    const map = locations[Math.floor(Math.random() * locations.length)];
    
    const options = location_data[map];
    const keys = Object.keys(options);
    
    if (keys.length === 0) {
        console.warn(`No locations found for map: ${map}`);
        return null;
    }

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return options[randomKey];
};

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route index element={<Home />} />
            <Route path="game" element={<Game locationID={randomLocation().id} map="hub" />} />
        </Routes>
    </BrowserRouter>
);
