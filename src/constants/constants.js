const ROLES = {
  admin: 'Admin',
  user: 'User',
  subscriber: 'Subscriber'
}

const ASSET_TYPES = {
  tool: 'Tool',
  article: 'Article',
  book: 'Book',
  course: 'Course',
  framework: 'Framework',
  guide: 'Guide',
  platform: 'Platform',
  report: 'Report',
  research: 'Research',
  infographic: 'Infographic'
};

const SURVEY_BINDING_TYPES = {
  group: 'Bind to group by score',
  page: 'Bind to page by score',
  question_choice: 'Bind to question by choice',
  question_score: 'Bind to question by score',
  tag: 'Bind to question by tag'
};

export default {
  ROLES,
  ASSET_TYPES,
  SURVEY_BINDING_TYPES
};
