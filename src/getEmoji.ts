import { gql, request } from "graphql-request";

import { EmojiV1TechnicalInformation } from "./types.js";

export type RetrievedEmoji = RetrievedEmojiMissing | RetrievedEmojiSuccess;

export interface RetrievedEmojiBase {
	slug: string;
}

export interface RetrievedEmojiMissing extends RetrievedEmojiBase {
	found: false;
}

export interface RetrievedEmojiSuccess extends RetrievedEmojiBase {
	found: true;
	info: EmojiV1TechnicalInformation;
}

export async function getEmoji(slug: string): Promise<RetrievedEmoji> {
	try {
		return {
			found: true,
			info: await getTechnicalInformation(slug),
			slug,
		};
	} catch {
		return {
			found: false,
			slug,
		};
	}
}

interface ResponseData {
	emoji_v1: EmojiV1TechnicalInformation;
}

async function getTechnicalInformation(slug: string) {
	const response = await request<ResponseData>(
		"https://emojipedia.org/api/graphql",
		gql`
			query ($slug: Slug!, $lang: Language) {
				emoji_v1(slug: $slug, lang: $lang) {
					...emojiDetailsResource
				}
			}

			fragment shortCodeResource on Shortcode {
				code
				vendor {
					slug
					title
				}
			}

			fragment emojiResource on Emoji {
				alsoKnownAs
				appleName
				code
				codepointsHex
				currentCldrName
				description
				id
				modifiers
				slug
				shortcodes {
					...shortCodeResource
				}
				title
			}

			fragment emojiDetailsResource on Emoji {
				...emojiResource
				components {
					...emojiResource
				}
				emojiVersion {
					date
					name
					slug
					status
				}
				shortcodes {
					code
					source
					vendor {
						slug
						title
					}
				}
				type
				version {
					date
					description
					name
					slug
					status
				}
			}
		`,
		{ lang: "EN", slug },
	);

	return response.emoji_v1;
}
