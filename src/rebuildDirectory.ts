import * as fs from "node:fs/promises";
import * as path from "node:path";

import { formatExportLine } from "./formatExportLine.js";
import { getEmojis } from "./getEmojis.js";
import { EmojiV1TechnicalInformation } from "./types.js";
import { unicodeEmoji } from "./unicodeEmoji.js";

export interface RebuildSettings {
	directory: string;
}

export async function rebuildDirectory({ directory }: RebuildSettings) {
	await fs.rm(directory, { force: true, recursive: true });
	await fs.mkdir(directory, { recursive: true });

	const index = path.join(directory, "index");
	await fs.writeFile(`${index}.d.mts`, "");
	await fs.writeFile(`${index}.mjs`, "");

	const foundInfo: EmojiV1TechnicalInformation[] = [];

	for await (const retrieved of getEmojis(
		Object.values(unicodeEmoji)
			.map(({ slug }) => slug.replaceAll("_", "-"))
			.sort(),
	)) {
		if (!retrieved.found) {
			console.warn("Could not find slug:", retrieved.slug);
			continue;
		}

		await Promise.all([
			fs.appendFile(`${index}.d.mts`, formatExportLine(retrieved.info)),
			fs.appendFile(`${index}.mjs`, formatExportLine(retrieved.info)),
			fs.writeFile(
				path.join(directory, `${retrieved.slug}.json`),
				JSON.stringify(
					Object.fromEntries(
						Object.entries(retrieved.info).sort(([a], [b]) =>
							a.localeCompare(b),
						),
					),
					null,
					4,
				),
			),
			fs.writeFile(
				path.join(directory, `${retrieved.slug}.d.ts`),
				JSON.stringify(
					Object.fromEntries(
						Object.entries(retrieved.info).sort(([a], [b]) =>
							a.localeCompare(b),
						),
					),
					null,
					4,
				),
			),
		]);

		foundInfo.push(retrieved.info);
	}
}
