import { describe, expect, it, vi } from "vitest";

import { getEmojis } from "./getEmojis.js";

const mockRetrieveEmoji = vi.fn();

vi.mock("./getEmoji.js", () => ({
	get getEmoji() {
		return mockRetrieveEmoji;
	},
}));

describe("getEmojis", () => {
	it("retrieves emoji data for the provided slugs", async () => {
		mockRetrieveEmoji.mockImplementation((slug: string) => ({
			happy: true,
			slug,
		}));

		const actual = await toArray(getEmojis(["a", "b", "c"]));

		expect(actual).toEqual([
			{ happy: true, slug: "a" },
			{ happy: true, slug: "b" },
			{ happy: true, slug: "c" },
		]);
	});
});

async function toArray<T>(asyncIterator: AsyncGenerator<T, void>) {
	const values = [];

	for await (const i of asyncIterator) {
		values.push(i);
	}

	return values;
}
