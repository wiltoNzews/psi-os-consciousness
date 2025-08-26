import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/promise-rejection-suppressor";

// Error handling is now managed by the imported error-handler module

// Using our full App with proper routing and OROBORO NEXUS dashboard
createRoot(document.getElementById("root")!).render(<App />);
