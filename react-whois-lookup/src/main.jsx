import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/App.css";
import App from "./App.jsx";

import Navbar from "./assets/components/Navbar.jsx";
import Footer from "./assets/components/Footer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Navbar />
    <App />
    <Footer />
  </StrictMode>
);
