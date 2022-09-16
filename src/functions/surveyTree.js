const byQuestion = (data) => {
  let tree = [];
  if ('pages' in data && data.pages) {
    for (let page of data.pages) {
      tree.push({
        type: 'page',
        value: page.name,
        title: (page.title) ? page.title : page.name
      })
      if ('elements' in page && page.elements && page.elements.length) {
        for (let element of page.elements) {
          tree.push({
            type: 'element',
            value: element.name,
            title: (element.title) ? element.title : element.name,
            choices: element.choices
          });
        }
      }
    }
  }
  return tree;
}

const byPage = (data) => {
  let tree = [];
  if ('pages' in data && data.pages) {
    for (let page of data.pages) {
      tree.push({
        type: 'page',
        value: page.name,
        title: ('title' in page && page.title) ? page.title : page.name
      });
    }
  }
  return tree;
}

const byGroup = (data) => {
  let groups = {};
  let tree = [];
  if ('pages' in data && data.pages) {
    for (let page of data.pages) {
      if ('elements' in page && page.elements && page.elements.length) {
        for (let element of page.elements) {
          if ('group' in element) {
            if (!(element.group in groups)) {
              tree.push({
                type: 'group',
                value: element.group,
                title: element.group
              });
              groups[element.group] = null;
            }
          }
        }
      }
    }
  }
  return tree;
}

const byTag = (data) => {
  let tags = [];
  let tree = [];
  if ('pages' in data && data.pages) {
    for (let page of data.pages) {
      if ('elements' in page && page.elements && page.elements.length) {
        for (let element of page.elements) {
          if ('tags' in element) {
            for (let tag of element.tags.split(/\s*,\s*/)) {
              if (!(tag in tags)) {
                tree.push({
                  type: 'tag',
                  value: tag,
                  title: tag
                })
                tags[tag] = null;
              }
            }
          }
        }
      }
    }
  }
  return tree;
}

export default {
  byQuestion,
  byPage,
  byGroup,
  byTag
};
