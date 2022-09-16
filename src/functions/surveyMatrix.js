const arrayAvg = (arr) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

export function surveyMatrix(data) {

  let i = 0;
  let min = 0;
  let max = 0;
  let avg = 0;
  let scores = [];
  let tag = '';
  let group = '';
  let question = '';
  let _tags = '';
  const pages = {};
  const tags = {};
  const groups = {};
  const questions = {};

  if ('pages' in data && data.pages) {
    for (let page of data.pages) {
      if (!(page.name in pages)) {
        pages[page.name] = {choices: 0, min: [], max: [], avg: []};
      }
      if ('elements' in page && page.elements && page.elements.length) {
        for (let element of page.elements) {
          if ('tags' in element && element.tags) {
            _tags = element.tags.split(/\s*,\s*/);
            for (tag of _tags) {
              if (!(tag in tags)) {
                tags[tag] = {choices: 0, min: [], max: [], avg: []};
              }
            }
          } else {
            _tags = null;
          }
          if ('group' in element && element.group) {
            group = element.group;
            if (!(group in groups)) {
              groups[group] = {choices: 0, min: [], max: [], avg: []};
            }
          } else {
            group = null;
          }
          if ('choices' in element && element.choices) {
            question = element.name;
            scores = [];
            i = 0;
            for (let choice of element.choices) {
              if (typeof choice === 'object' && 'score' in choice) {
                scores.push(parseInt(choice.score));
              }
              i++;
            }
            min = (scores.length) ? Math.min(...scores) : 0;
            max = (scores.length) ? Math.max(...scores) : 0;
            avg = (scores.length) ? arrayAvg(scores) : 0;
            questions[question] = {
              choices: i,
              min: min,
              max: max,
              avg: avg
            };
            pages[page.name] = {
              choices: i,
              min: min,
              max: max,
              avg: avg
            };
            if (_tags) {
              for (tag of _tags) {
                tags[tag].choices += i;
                tags[tag].min.push(min);
                tags[tag].max.push(max);
                tags[tag].avg.push(avg);
              }
            }
            if (group) {
              groups[group].choices += i;
              groups[group].min.push(min);
              groups[group].max.push(max);
              groups[group].avg.push(avg);
            }
          }
        }
      }
    }
    Object.keys(tags).forEach((key) => {
      tags[key].min = Math.min(...tags[key].min);
      tags[key].max = Math.max(...tags[key].max);
      tags[key].avg = arrayAvg(tags[key].avg);
    });
    Object.keys(groups).forEach((key) => {
      groups[key].min = Math.min(...groups[key].min);
      groups[key].max = Math.max(...groups[key].max);
      groups[key].avg = arrayAvg(groups[key].avg);
    });
  }

  return {
    pages: pages,
    tags: tags,
    groups: groups,
    questions: questions
  };
}
