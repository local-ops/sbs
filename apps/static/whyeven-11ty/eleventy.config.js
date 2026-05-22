const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");
const markdownItFootnote = require("markdown-it-footnote");
const { buildNavFromTree, navColumns, navChildren } = require("./lib/nav-build.js");

const TREE_PATH = path.join(__dirname, "src", "_data", "tree.yml");

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
  const treeRaw = fs.readFileSync(TREE_PATH, "utf8");
  const tree = /** @type {Array<{ id: string, title: string, children?: unknown[] }>} */ (
    yaml.load(treeRaw)
  );
  const whyeven = buildNavFromTree(tree);

  eleventyConfig.addGlobalData("whyeven", whyeven);
  eleventyConfig.addGlobalData("siteTitle", "whyeven");
  eleventyConfig.addGlobalData(
    "siteTagline",
    "Persönliche Wissensbasis — Kategorien wählen, tiefer navigieren.",
  );
  eleventyConfig.addGlobalData("whyevenRootList", () =>
    whyeven.roots.map((nid) => ({
      id: nid,
      title: whyeven.index[nid].title,
      href: whyeven.paths[nid],
    })),
  );

  eleventyConfig.addPassthroughCopy("src/css");

  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(markdownItFootnote);
  });

  eleventyConfig.addFilter("whyevenNavColumns", (id) => {
    if (!id) return [];
    return navColumns(id, whyeven);
  });

  eleventyConfig.addFilter("whyevenNavChildren", (id) => {
    if (!id) return [];
    return navChildren(id, whyeven);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
