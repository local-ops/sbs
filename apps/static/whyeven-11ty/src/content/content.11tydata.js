module.exports = {
  tags: ["whyeven-page"],
  layout: "shell.njk",
  eleventyComputed: {
    permalink(data) {
      const p = data.whyeven.paths[data.id];
      if (!p) {
        throw new Error(
          `Unknown tree id "${data.id}" — add it to src/_data/tree.yml`,
        );
      }
      return p;
    },
    title(data) {
      return data.title || data.whyeven.index[data.id]?.title || data.id;
    },
  },
};
