import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "dist",
	},
	server: {
		host: true,
		port: Number(process.env.PORT) || 5173,
	},
	preview: {
		port: Number(process.env.PORT) || 4173,
		host: true,
		allowedHosts: [
			"localhost",
			"127.0.0.1",
			"fullstack4all.onrender.com",
			".onrender.com", // Allow all Render subdomains
		],
	},
});
