export interface ComponentShortcode {
	code: string;
	vendor: ComponentVendor;
}

export interface ComponentVendor {
	slug: string;
	title: string;
}

export interface EmojiComponent {
	alsoKnownAs: string[];
	appleName: string;
	code: string;
	codepointsHex: string[];
	currentCldrName: string;
	description: string;
	id: string;
	shortcodes: ComponentShortcode[];
	slug: string;
	title: string;
}

export interface EmojiShortcode {
	code: string;
	source: string;
	vendor: EmojiVendor;
}

export interface EmojiV1TechnicalInformation {
	alsoKnownAs: string[];
	appleName: string;
	code: string;
	codepointsHex: string[];
	components: EmojiComponent[];
	currentCldrName: null | string;
	description: string;
	emojiVersion: EmojiVersion;
	id: string;
	shortcodes: EmojiShortcode[];
	slug: string;
	title: string;
	type: string;
	version: EmojiVersion;
}

export interface EmojiVendor {
	slug: string;
	title: string;
}

export interface EmojiVersion {
	date: number;
	name: string;
	slug: string;
	status: number;
}

export interface EmojiVersion {
	date: number;
	description: string;
	name: string;
	slug: string;
	status: number;
}

export type UnicodeEmojiEntry = UnicodeEmojiJson[keyof UnicodeEmojiJson];

export type UnicodeEmojiJson = typeof import("unicode-emoji-json");
