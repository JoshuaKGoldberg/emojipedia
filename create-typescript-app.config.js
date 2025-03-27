// 👋 Hi! This is an optional config file for create-typescript-app (CTA).
// Repos created with CTA or its underlying framework Bingo don't use one by default.
// A CTA config file allows automatic updates to the repo that preserve customizations.
// For more information, see Bingo's docs:
//   https://www.create.bingo/execution#transition-mode
// Eventually these values should be inferable, making this config file unnecessary:
//   https://github.com/JoshuaKGoldberg/bingo/issues/128
import {
	blockCodecov,
	blockCTATransitions,
	blockGitHubActionsCI,
	blockReleaseIt,
	blockVitest,
	createConfig,
} from "../create-typescript-app/lib/index.js";

export default createConfig({
	refinements: {
		addons: [
			blockCodecov({
				env: {
					CODECOV_TOKEN: "${{ secrets.CODECOV_TOKEN }}",
				},
			}),
			blockGitHubActionsCI({
				jobs: [
					{
						name: "Build Data",
						steps: [
							{ run: "pnpm build:data" },
							{ run: "node ./lib/data/index.mjs" },
						],
					},
				],
			}),
			blockReleaseIt({
				builders: [
					{
						order: 1,
						run: "pnpm build:data",
					},
				],
			}),
			blockVitest({
				coverage: {
					exclude: ["lib"],
				},
			}),
		],
		blocks: {
			add: [blockCTATransitions],
		},
	},
});
