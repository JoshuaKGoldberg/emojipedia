<h1 align="center">The Emojipedia Technical Information Library</h1>

<p align="center">Unofficial static export of emoji technical information from Emojipedia. 📙</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 2" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-2-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/emojipedia/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/emojipedia" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/emojipedia?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/emojipedia/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/emojipedia"><img alt="📦 npm version" src="https://img.shields.io/npm/v/emojipedia?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## Usage

```shell
npm i emojipedia
```

### Data

The `emojipedia` package exports an `emojipedia/data` export of roughly all emojis on emojipedia.
Data for each emoji can be imported by its PascalCase name:

```ts
import { SparklingHeart } from "emojipedia/data";

console.log(SparklingHeart);
/*
{
	"code": "💖",
	"slug": "sparkling-heart",
	"title": "Sparkling Heart",
	// ...
}
*/
```

Alternately, you can import emoji data from the individual `.json` files by their kebab-case slug name using [JSON import attributes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with#description):

```ts
import sparklingHeart from "emojipedia/data/sparkling-heart.json" with { type: "json" };

console.log(sparklingHeart);
/*
{
	"code": "💖",
	"slug": "sparkling-heart",
	"title": "Sparkling Heart",
	// ...
}
*/
```

### Node.js APIs

The functions used to generate Emojipedia data are exported as well.
In order from low-level to high-level:

1. [`getEmoji`](#getemoji)
1. [`getEmojis`](#getemojis)
1. [`rebuildDirectory`](#rebuilddirectory)

#### `getEmoji`

Retrieves data for an emoji by its slug.
This sends a single network request to the Emojipedia GraphQL API.

```ts
import { getEmoji } from "emojipedia";

const emoji = await getEmoji("sparkling-heart");
console.log(emoji);
/*
{
	"code": "💖",
	"slug": "sparkling-heart",
	"title": "Sparkling Heart",
	// ...
}
*/
```

See the TypeScript types for a complete description of emoji properties.

#### `getEmojis`

Retrieves data for an array of emoji slugs by calling [`getEmoji`](#getemoji) for each slug.

```ts
import { getEmojis } from "emojipedia";

const emojis = await getEmojis(["heart-on-fire", "sparkling-heart"]);
console.log(emojis);
/*
[
	{
		"code": "❤️‍🔥",
		"slug": "heart-on-fire",
		"title": "Heart on Fire",
		// ...
	},
	{
		"code": "💖",
		"slug": "sparkling-heart",
		"title": "Sparkling Heart",
		// ...
	}
]
*/
```

Note that network requests are [`p-throttle` throttled](https://github.com/sindresorhus/p-throttle) to a maximum of 10 calls at each 100ms interval.

#### `rebuildDirectory`

Clears and recreates a directory to contain an `index.mjs`, an `index.d.ts`, and a `*.json` file for each emoji slug.

```ts
import { rebuildDirectory } from "emojipedia";

await rebuildDirectory({
	directory: "lib/data",
});
```

`rebuildDirectory` will call `getEmojis` with each of the emoji slugs as defined by [`unicode-emoji-json`](https://github.com/muan/unicode-emoji-json).

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com/"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/emojipedia/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="https://github.com/JoshuaKGoldberg/emojipedia/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a> <a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/emojipedia/issues?q=author%3AJoshuaKGoldberg" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/git-megan"><img src="https://avatars.githubusercontent.com/u/114352576?v=4?s=100" width="100px;" alt="Megan Middleton"/><br /><sub><b>Megan Middleton</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/emojipedia/commits?author=git-megan" title="Tests">⚠️</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

<!-- You can remove this notice if you don't want it 🙂 no worries! -->

> 💙 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app).
