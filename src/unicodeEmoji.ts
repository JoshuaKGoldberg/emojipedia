import Module from "node:module";

const require = Module.createRequire(import.meta.url);

export const unicodeEmoji =
	require("unicode-emoji-json") as typeof import("unicode-emoji-json");
