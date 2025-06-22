import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "./pages/home/index.jsx";
import { Game } from "./pages/game/index.jsx";

import "./styles.css";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route index element={<Game locationID="pats_house" map="hub" />} />
            <Route path="game" element={<Game locationID="pats_house" map="hub" />} />
        </Routes>
    </BrowserRouter>
);
