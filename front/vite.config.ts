import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    // External Publication
    host: "0.0.0.0",
    // You can change the port for starting up.
    port: 5173,
  },
});
