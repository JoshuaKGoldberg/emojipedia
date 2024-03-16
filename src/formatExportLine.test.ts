import { describe, expect, it } from "vitest";

import { formatExportLine } from "./formatExportLine.js";

describe("formatExportLine", () => {
	it("uses the CLDR name when it's valid", () => {
		const actual = formatExportLine({
			currentCldrName: "Man in Suit",
			slug: "other",
			title: "other",
		});

		expect(actual).toBe(
			`export { default as ManInSuit } from "./other.json" assert { type: "json" };\n`,
		);
	});

	it("uses the title when CLDR starts with a number", () => {
		const actual = formatExportLine({
			currentCldrName: "1st Place Medal",
			slug: "other",
			title: "First Place Medal",
		});

		expect(actual).toBe(
			`export { default as FirstPlaceMedal } from "./other.json" assert { type: "json" };\n`,
		);
	});

	it("uses the title when CLDR is null", () => {
		const actual = formatExportLine({
			currentCldrName: null,
			slug: "other",
			title: "First Place Medal",
		});

		expect(actual).toBe(
			`export { default as FirstPlaceMedal } from "./other.json" assert { type: "json" };\n`,
		);
	});
});
