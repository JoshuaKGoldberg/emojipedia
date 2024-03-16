import { defineConfig } from "tsup";

export default defineConfig({
	bundle: false,
	dts: true,
	entry: ["src/**/*.ts", "!src/**/*.test.*"],
	format: "esm",
	outDir: "lib",
	sourcemap: true,
});
