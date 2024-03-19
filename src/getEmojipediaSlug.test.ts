import { describe, expect, it } from "vitest";

import { getEmojipediaSlug } from "./getEmojipediaSlug.js";

describe("getEmojipediaSlug", () => {
	it("returns the alias when the slug has an alias", () => {
		const slug = "ginger-root";

		const actual = getEmojipediaSlug(slug);

		expect(actual).toBe("ginger");
	});

	it("returns the original slug when it doesn't have a known aliases", () => {
		const slug = "ginger";

		const actual = getEmojipediaSlug(slug);

		expect(actual).toBe(slug);
	});
});
