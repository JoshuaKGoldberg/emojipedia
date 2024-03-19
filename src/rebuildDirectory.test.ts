import { describe, expect, it, vi } from "vitest";

import { rebuildDirectory } from "./rebuildDirectory.js";

const mockGetEmojis = vi.fn();

vi.mock("./getEmojis.js", () => ({
	get getEmojis() {
		return mockGetEmojis;
	},
}));

const mockAppendFile = vi.fn();
const mockWriteFile = vi.fn();

vi.mock("node:fs/promises", () => ({
	get appendFile() {
		return mockAppendFile;
	},
	mkdir: vi.fn(),
	rm: vi.fn(),
	get writeFile() {
		return mockWriteFile;
	},
}));

describe("rebuildDirectory", () => {
	it("throws an error when an emoji cannot be found", async () => {
		mockGetEmojis.mockImplementation(function* () {
			yield Promise.resolve({
				found: false,
				slug: "some-slug",
			});
		});

		await expect(async () => {
			await rebuildDirectory({ directory: "test" });
		}).rejects.toMatchInlineSnapshot(
			`[Error: Could not find slug on Emojipedia: some-slug]`,
		);
	});

	it("writes data to disk when an emoji is found", async () => {
		mockGetEmojis.mockImplementation(function* () {
			yield Promise.resolve({
				found: true,
				info: { slug: "some-cldr", title: "Some Title" },
				slug: "some-slug",
			});
		});

		await rebuildDirectory({ directory: "test" });

		expect(mockAppendFile.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "test/index.d.mts",
			    "export { default as SomeTitle } from "./some-cldr.json" assert { type: "json" };
			",
			  ],
			  [
			    "test/index.mjs",
			    "export { default as SomeTitle } from "./some-cldr.json" assert { type: "json" };
			",
			  ],
			]
		`);
		expect(mockWriteFile.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "test/index.d.mts",
			    "",
			  ],
			  [
			    "test/index.mjs",
			    "",
			  ],
			  [
			    "test/some-slug.json",
			    "{
			    "slug": "some-cldr",
			    "title": "Some Title"
			}",
			  ],
			  [
			    "test/some-slug.d.ts",
			    "{
			    "slug": "some-cldr",
			    "title": "Some Title"
			}",
			  ],
			]
		`);
	});
});
