import { describe, expect, it, vi } from "vitest";

import { getEmoji } from "./getEmoji.js";

const mockRequest = vi.fn();

vi.mock("graphql-request", () => ({
	get request() {
		return mockRequest;
	},
	gql: (text: string) => text,
}));

const slug = "some-emoji";

describe("getEmoji", () => {
	it("returns a found object when request returns emoji technical information", async () => {
		mockRequest.mockResolvedValueOnce({ emoji_v1: { title: "Some Emoji" } });

		const actual = await getEmoji(slug);

		expect(actual).toEqual({
			found: true,
			info: { title: "Some Emoji" },
			slug,
		});
	});

	it("returns a not-found object when request throws", async () => {
		mockRequest.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await getEmoji(slug);

		expect(actual).toEqual({
			found: false,
			slug,
		});
	});
});
