/**
 * Build URL paths and navigation columns from a nested tree (see src/_data/tree.yml).
 */

/**
 * @param {Array<{ id: string, title: string, children?: Array }>} tree
 * @returns {{ paths: Record<string,string>, index: Record<string,{id:string,title:string,parentId:string|null,childIds:string[]}>, roots: string[] }}
 */
function buildNavFromTree(tree) {
  /** @type {Record<string, string>} */
  const paths = {};
  /** @type {Record<string, { id: string, title: string, parentId: string | null, childIds: string[] }>} */
  const index = {};
  const roots = [];

  /**
   * @param {Array<{ id: string, title: string, children?: Array }>} nodes
   * @param {string} parentPath
   * @param {string | null} parentId
   */
  function walk(nodes, parentPath, parentId) {
    for (const node of nodes) {
      const { id, title, children = [] } = node;
      const urlPath = parentPath ? `${parentPath}/${id}` : id;
      paths[id] = `/${urlPath}/`;
      index[id] = {
        id,
        title,
        parentId,
        childIds: children.map((c) => c.id),
      };
      if (parentId === null) {
        roots.push(id);
      }
      walk(children, urlPath, id);
    }
  }

  walk(tree, "", null);
  return { paths, index, roots };
}

/**
 * @param {string} id
 * @param {Record<string, { parentId: string | null }>} index
 */
function pathChain(id, index) {
  const chain = [];
  let cur = id;
  while (cur) {
    chain.unshift(cur);
    cur = index[cur]?.parentId ?? null;
  }
  return chain;
}

/**
 * Miller-style columns: one column per ancestor level, items are siblings at that level.
 * @param {string} currentId
 * @param {ReturnType<typeof buildNavFromTree>} nav
 */
function navColumns(currentId, nav) {
  const { index, roots, paths } = nav;
  const chain = pathChain(currentId, index);
  return chain.map((activeId, i) => {
    const itemIds = i === 0 ? roots : index[chain[i - 1]].childIds;
    const items = itemIds.map((nid) => ({
      id: nid,
      title: index[nid].title,
      href: paths[nid],
    }));
    return { activeId, items };
  });
}

/**
 * @param {string} currentId
 * @param {ReturnType<typeof buildNavFromTree>} nav
 */
function navChildren(currentId, nav) {
  const { index, paths } = nav;
  const ids = index[currentId]?.childIds ?? [];
  return ids.map((nid) => ({
    id: nid,
    title: index[nid].title,
    href: paths[nid],
  }));
}

module.exports = { buildNavFromTree, navColumns, navChildren, pathChain };
