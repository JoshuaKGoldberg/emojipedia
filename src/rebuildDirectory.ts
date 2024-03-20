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
			throw new Error(`Could not find slug on Emojipedia: ${retrieved.slug}`);
		}

		const fileContents = JSON.stringify(
			Object.fromEntries(
				Object.entries(retrieved.info).sort(([a], [b]) => a.localeCompare(b)),
			),
			null,
			4,
		);
		const filePathStart = path.join(directory, retrieved.slug);

		await Promise.all([
			fs.appendFile(`${index}.d.mts`, formatExportLine(retrieved.info)),
			fs.appendFile(`${index}.mjs`, formatExportLine(retrieved.info)),
			fs.writeFile(`${filePathStart}.json`, fileContents),
			fs.writeFile(`${filePathStart}.d.ts`, fileContents),
		]);

		foundInfo.push(retrieved.info);
	}
}
