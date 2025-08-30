import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "dist",
	},
	preview: {
		port: Number(process.env.PORT) || 4173,
		host: true,
	},
});
