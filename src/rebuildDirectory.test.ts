import { beforeEach, describe, expect, it, vi } from "vitest";

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

const mockWarn = vi.fn();

describe("rebuildDirectory", () => {
	beforeEach(() => {
		console.warn = mockWarn;
	});

	it("warns when an emoji cannot be found", async () => {
		mockGetEmojis.mockImplementation(function* () {
			yield Promise.resolve({
				found: false,
				slug: "some-slug",
			});
		});

		await rebuildDirectory({ directory: "test" });

		expect(mockWarn.mock.calls).toEqual([
			["Could not find slug:", "some-slug"],
		]);
		expect(mockAppendFile).not.toHaveBeenCalled();
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
			]
		`);
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

		expect(mockWarn).not.toHaveBeenCalled();
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

	it("writes only found data to disk when only some emojis are found", async () => {
		mockGetEmojis.mockImplementation(function* () {
			yield Promise.resolve({
				found: true,
				info: { slug: "some-cldr-a", title: "Some Title A" },
				slug: "some-slug-a",
			});
			yield Promise.resolve({
				found: false,
				slug: "some-slug-b",
			});
			yield Promise.resolve({
				found: true,
				info: { slug: "some-cldr-c", title: "Some Title C" },
				slug: "some-slug-c",
			});
			yield Promise.resolve({
				found: false,
				slug: "some-slug-d",
			});
		});

		await rebuildDirectory({ directory: "test" });

		expect(mockWarn.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Could not find slug:",
			    "some-slug-b",
			  ],
			  [
			    "Could not find slug:",
			    "some-slug-d",
			  ],
			]
		`);
		expect(mockAppendFile.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "test/index.d.mts",
			    "export { default as SomeTitleA } from "./some-cldr-a.json" assert { type: "json" };
			",
			  ],
			  [
			    "test/index.mjs",
			    "export { default as SomeTitleA } from "./some-cldr-a.json" assert { type: "json" };
			",
			  ],
			  [
			    "test/index.d.mts",
			    "export { default as SomeTitleC } from "./some-cldr-c.json" assert { type: "json" };
			",
			  ],
			  [
			    "test/index.mjs",
			    "export { default as SomeTitleC } from "./some-cldr-c.json" assert { type: "json" };
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
			    "test/some-slug-a.json",
			    "{
			    "slug": "some-cldr-a",
			    "title": "Some Title A"
			}",
			  ],
			  [
			    "test/some-slug-a.d.ts",
			    "{
			    "slug": "some-cldr-a",
			    "title": "Some Title A"
			}",
			  ],
			  [
			    "test/some-slug-c.json",
			    "{
			    "slug": "some-cldr-c",
			    "title": "Some Title C"
			}",
			  ],
			  [
			    "test/some-slug-c.d.ts",
			    "{
			    "slug": "some-cldr-c",
			    "title": "Some Title C"
			}",
			  ],
			]
		`);
	});
});
