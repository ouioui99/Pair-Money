import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";
import env from "vite-plugin-env-compatible";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    mkcert(),
    env({ prefix: "VITE", mountedPath: "process.env" }),
  ],
  server: {
    // External Publication
    host: "0.0.0.0",
    // You can change the port for starting up.
    port: 5173,
  },
});
