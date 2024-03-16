import * as changeCase from "change-case";

import { EmojiV1TechnicalInformation } from "./types.js";

export function formatExportLine({
	currentCldrName,
	slug,
	title,
}: Pick<EmojiV1TechnicalInformation, "currentCldrName" | "slug" | "title">) {
	// Most emojis have a valid current CLDR ("Common Locale Data Repository") name...
	// ...but some start with a number (e.g. 1st-place-medal)
	// ...and some don't (e.g. woman-with-headscarf)
	const name = currentCldrName?.match(/^\D/) ? currentCldrName : title;
	const namePascalCase = changeCase.pascalCase(name);

	return `export { default as ${namePascalCase} } from "./${slug}.json" assert { type: "json" };\n`;
}
