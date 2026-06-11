import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Builds the single-page app into ./dist, which the Azure Static Web Apps
// deploy workflow uploads as the site output.
export default defineConfig({
  plugins: [react()],
});
