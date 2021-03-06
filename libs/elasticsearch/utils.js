const _ = require('lodash');
const Bodybuilder = require('bodybuilder');
const { getConfig } = require('./config');
const moment = require('moment');
const DATE_FORMAT = 'YYYY-MM-DD';
const REPO_RESULT_SIZE_MAX = 1000;
const REPO_RESULT_SIZE_DEFAULT = 10;
const TERM_RESULT_SIZE_MAX = 100;
const TERM_RESULT_SIZE_DEFAULT = 5;
const ELASTICSEARCH_SORT_ORDERS = ['asc', 'desc'];
const ELASTICSEARCH_SORT_MODES = ['min', 'max', 'sum', 'avg', 'median'];

/**
 * Flaten Elasticsearch mappings by type. (depricated)
 * @param {object} mapping The Elasticsearch index mappings. https://www.elastic.co/guide/en/elasticsearch/reference/6.3/mapping.html
 * @returns {object} Flattened Elasticsearch mapping object grouped by type.
 */
function getFlattenedMappingPropertiesByType(mapping) {
  let props = {};

  const _recurseMappingTree = (mappingTree, pathArr) => {
    if (mappingTree["properties"]) {
      //We need to add any nested objects for groupings.
      if (mappingTree["type"] == "nested") {
        if (!props[mappingTree["type"]]) {
          props[mappingTree["type"]] = [];
        }
        props[mappingTree["type"]].push(pathArr.join("."));
      }
      _recurseMappingTree(mappingTree["properties"], pathArr);
    } else if (mappingTree["type"]) {
      if (!props[mappingTree["type"]]) {
        props[mappingTree["type"]] = [];
      }
      props[mappingTree["type"]].push(pathArr.join("."));
    } else {
      Object.keys(mappingTree).forEach((key) => {
        _recurseMappingTree(mappingTree[key], pathArr.concat(key));
      });
    }
  };

  _recurseMappingTree(mapping, []);
  return props;
}

/**
 * Delete private object keys ( prefixed with `_` ) from objects in passed collection.
 * @param {object} collection - list of objects to have keys deleted
 * @returns {object} An object with all fields prefixed by `_` deleted.
 */
function omitPrivateKeys (collection) {
  const omitFn = (value) => {
    if (value && typeof value === 'object') {
      Object.keys(value).forEach((key) => {
        if (key[0] === '_') {
          delete value[key];
        }
      });
    }
  };
  return _.cloneDeepWith(collection, omitFn);
}

/**
 * Parse the hits and source data from an Elasticsearch response object.
 * @param {object} response Elasticsearch reponse object.
 * @returns {object} Object with extracted data from _source and total items in result set.
 */
function parseResponse (response) {
  let hits = [];
  let aggregations = [];

  if (response.hasOwnProperty('hits') && response.hits.hasOwnProperty('hits')) {
    hits = response.hits.hits;
  }

  if(response.hasOwnProperty('aggregations')) {
    aggregations = response.aggregations;
  }

  if (hits.length > 0) {
    return {
      total: response.hits.total,
      data: hits.map(hit => _.merge({ searchScore: hit._score }, omitPrivateKeys(hit._source))),
      aggregations
    };
  }

  return { total: 0, data: [], aggregations };
}

/**
 *
 * @param {object} param
 * @param {string} param.queryType The type of Elasticsearch query to make (Eg. match) - https://www.elastic.co/guide/en/elasticsearch/reference/6.3/full-text-queries.html
 * @param {string} param.field The index field you want to search against
 * @param {string} param.value The field value to search for.
 * @returns {object} Elasticsearch query object generated by BodyBuilder (https://www.npmjs.com/package/bodybuilder)
 */
function createFieldSearchQuery ({ queryType, field, value }) {
  let body = new Bodybuilder();

  body.query(queryType, field, value);
  let query = body.build('v2');

  return query;
}

function _addMatchPhraseForFullText ({ body, queryParams, field, boost }) {
  let query = { 'match_phrase': {} };
  query['match_phrase'][field] = {
    'query': queryParams.q
  };

  if (boost) {
    query['match_phrase'][field]['boost'] = boost;
  }

  body.query('bool', 'should', query);
}

function _addMatchForFullText ({ body, queryParams, field }) {
  let query = { 'match': {} };
  query['match'][field] = queryParams.q;

  body.query('bool', 'should', query);
}

function _addCommonCutoffForFullText ({ body, queryParams, field, boost }) {
  let query = { 'common': {} };

  query['common'][field] = {
    'query': queryParams.q,
    'cutoff_frequency': 0.001,
    'low_freq_operator': 'and'
  };

  if (boost) {
    query['common'][field]['boost'] = boost;
  }

  body.query('bool', 'should', query);
}

function _addFullTextQuery ({ body, searchQuery }) {
  const searchFields = [
    'name^5',
    'name.keyword^10',
    'description^2',
    'agency.acronym',
    'agency.name',
    'agency.name.keyword^5',
    'permissions.usageType',
    'tags^3',
    'tags.keyword^3',
    'languages',
    'languages.keyword^3'
  ];

  body.query('multi_match', 'fields', searchFields, { 'query': searchQuery }, { 'type': 'best_fields' });
}

/**
 * Process the value to used as a filter.
 * If value is a number then convert it to one or if a string convert it to lowercase.
 * @param {any} value The value to process. Should be a number or a string
 */
function _processFilterValue(value) {
  if(isNaN(parseFloat(value))) {
    return value.toLowerCase();
  }

  return parseFloat(value);
}

/**
 * Add string filters to the Elasticsearch query body.
 *
 * @param {object} filters
 * @param {object} filters.body Bodybuilder instance
 * @param {string} filters.fieldType The data type of the field to filter by
 * @param {string} filters.field The field to filter by
 * @param {string} filters.filterValue The value to filter by
 * @param {object} filters.filterMappings Mappings of filter properties to Elasticsearch fields. These values are set in the package's config.
 */
function _addStringFilter ({ body, fieldType, field, filterValue, filterMappings }) {

  // query params could be used multiple times. Express converts them into an Array
  // Eg. http://localhost:3000/api/repos?q=API&license=cc0&license=gpl
  // This is turned into queryParams['permissions.license'] = ['cc0', 'gpl']
  if (filterValue instanceof Array) {
    body.filter('bool', (f) => {
      filterValue.forEach((item) => f.orFilter('term', filterMappings[fieldType][field]['term'], _processFilterValue(item)));  
      return f;
    });
  } else {
    body.filter('term', filterMappings[fieldType][field]['term'], _processFilterValue(filterValue));
  }
}

/**
 * Add nested query / filters to the Elasticsearch query body.
 *
 * Additional reading on nested queries and datatype:
 * https://www.elastic.co/guide/en/elasticsearch/reference/5.6/nested.html
 * https://www.elastic.co/guide/en/elasticsearch/reference/5.6/query-dsl-nested-query.html
 *
 * @param {object} filter
 * @param {object} filter.body Bodybuilder instance
 * @param {string} filter.fieldType The data type of the field to filter by
 * @param {string} filter.field The field to filter by
 * @param {string} filter.filterValue The value to filter by
 * @param {object} filter.filterMappings Mappings of filter properties to Elasticsearch fields. These values are set in the package's config.
 */
function _addNestedFilter({ body, fieldType, field, filterValue, filterMappings }) {
  body.query('nested', 'path', filterMappings[fieldType][field]['path'], q => {
    filterMappings[fieldType][field]['terms'].forEach(term => q.orQuery('term', term, filterValue.toLowerCase()));
    return q;
  });
}

/**
 * Adds all filters needed for the Elasticsearch query.
 * @param {object} filterParams
 * @param {object} filterParams.body Bodybuilder instance
 * @param {object} filterParams.queryParams search and filter parameters
 */
function _addStringFilters ({ body, queryParams, filterMappings }) {

  Object.keys(filterMappings['keyword']).forEach(field => {
    if (queryParams[field]) {
      _addStringFilter({ body, fieldType: 'keyword', field, filterValue: queryParams[field], filterMappings });
    }
  });

  Object.keys(filterMappings['nested']).forEach(field => {
    if (queryParams[field]) {
      _addNestedFilter({ body, fieldType: 'nested', field, filterValue: queryParams[field], filterMappings });
    }
  });
}

function _getRanges({ field, queryParams }) {
  let lteRange;
  let gteRange;
  if(queryParams.hasOwnProperty(field + '_lte')) {
    lteRange = queryParams[field + '_lte'];
  }
  if(queryParams.hasOwnProperty(field + '_gte')) {
    gteRange = queryParams[field + '_gte'];
  }
  return {
    lteRange,
    gteRange
  };
}
function _processDate(date) {
  const tmpDate = moment(date);
  if (tmpDate.isValid()) {
    try {
      return tmpDate.utc().format(DATE_FORMAT);
    } catch(error) {
      throw error;
    }
  }
  throw new Error('Invalid date.');
}

function _addRangeFilter ({ body, field, lteRange, gteRange }) {
  let ranges = {};

  if(lteRange) {
    try {
      ranges['lte'] = _processDate(lteRange);
    } catch(error) {
      console.log(`[ERROR] Field: ${field} - RangeType: lte - Value: ${lteRange} - ${error}`);
    }
  }

  if(gteRange) {
    try {
      ranges['gte'] = _processDate(gteRange);
    } catch(error) {
      console.log(`[ERROR] Field: ${field} - RangeType: gte - Value: ${gteRange} - ${error}`);
    }
  }

  body.filter('range', field, ranges);
}

/**
 * Adds date range filters to Elasticsearch query body.
 * @param {*} param0
 * @param {object} param0.body Bodybuilder instance
 * @param {object} param0.queryParams search and filter parameters
 */
function _addDateRangeFilters ({ body, queryParams, filterMappings }) {
  const possibleRangeProps = Object.keys(filterMappings['date']);

  possibleRangeProps.forEach((dateField) => {
    const field = filterMappings['date'][dateField]['term'];
    const { lteRange, gteRange } = _getRanges({ field, queryParams });
    if (lteRange || gteRange) {
      _addRangeFilter({ body, field, lteRange, gteRange });
    }
  });
}

function _addSizeFromParams ({ body, queryParams }) {
  queryParams.size = queryParams.size || REPO_RESULT_SIZE_DEFAULT;
  let size = queryParams.size > REPO_RESULT_SIZE_MAX ? REPO_RESULT_SIZE_MAX : queryParams.size;
  let from = queryParams.from || 0;
  body.size(size);
  body.from(from);
}

function _addIncludeExclude ({ body, queryParams }) {
  let include = queryParams.include || null;
  let exclude = queryParams.exclude || null;
  let _source = {};
  const _enforceArray = (obj) => {
    if (!(obj instanceof Array)) {
      if (typeof (obj) === 'string') {
        return [obj];
      } else {
        return [];
      }
    } else {
      return obj;
    }
  };

  if (include) {
    _source.include = _enforceArray(include);
  }
  if (exclude) {
    _source.exclude = _enforceArray(exclude);
  }

  if (Object.keys(_source).length) {
    body.rawOption('_source', _source);
  }
}

/**
 * This adds all of our data field filters to a bodybuilder object
 *
 * @param {any} body An instance of a Bodybuilder class
 * @param {any} q The query parameters a user is searching for
 */
function _addFieldFilters ({ body, queryParams }) {
  const { filterMappings } = getConfig();

  _addStringFilters({ body, queryParams, filterMappings });
  _addDateRangeFilters({ body, queryParams, filterMappings });
}

function _getSortValues(querySortParams) {
  const sortValues = [];
  querySortParams.split(',').forEach(value => {
    if (value) {
      const [field, direction] = value.split('__');

      const { sortMappings } = getConfig();

      sortValues.push([sortMappings[field]['field'], direction ]);
    }
  });
  return sortValues;
}

function _getSortOptions(sortValue) {
  let sortOptions = {};

  sortValue.slice(1).forEach(item => {
    if (ELASTICSEARCH_SORT_ORDERS.includes(item)) {
      sortOptions.order = item;
    }
    if (ELASTICSEARCH_SORT_MODES.includes(item)) {
      sortOptions.mode = item;
    }
  });

  return sortOptions;
}

/**
 * Adds sorting depending on query input parameters. This functions mutates the body parameter being passed.
 *
 * @param {any} body An instance of a Bodybuilder class
 * @param {any} queryParams The query parameters a user is searching for
 */
function _addSortOrder ({ body, queryParams }) {
  const defaultSortDirection = 'asc';

  if(queryParams.hasOwnProperty('sort')) {
    if(ELASTICSEARCH_SORT_ORDERS.includes(queryParams.sort)) {
      body.sort(_setDefaultSort(queryParams.sort));
    } else {
      const sortValues = _getSortValues(queryParams.sort);

      sortValues.forEach(sortValue => {
        const sortField = sortValue[0];

        body.sort(`${sortField}`,
          sortValue.length > 1
            ? _getSortOptions(sortValue)
            : defaultSortDirection);
      });
    }
  } else {
    body.sort(_setDefaultSort());
  }
}

/**
 * Sets the default sort body to be sent to Elasticsearch. The default fields are:
 *
 * 1. score - This is the data quality score. Sort direction defaults to `desc`.
 * 2. _score - This is the builtin Elasticsearch search score. Sort direction defaults to `desc`.
 * 3. name.keyword - This is the keyword representation of the repo.name field. Sort direction defaults to `asc`.
 * @param {string} sortDirection The direction for the sort ('asc', 'desc').
 * @returns {Array} A JS Array with the sorting objects expected by the Bodybuilder lib. https://bodybuilder.js.org/docs/#sort
 */
function _setDefaultSort(sortDirection=undefined) {
  return [
    { "score": sortDirection || 'desc' },
    { "_score": sortDirection || 'desc' },
    { "name.keyword": sortDirection || 'asc' }
  ];
}

/**
 * Create the search query for the repos index on Elasticsearch.
 * @param {*} queryParams
 */
function createReposSearchQuery ({ queryParams }) {
  let body = new Bodybuilder();

  if (queryParams.q) {
    _addFullTextQuery({ body, searchQuery: queryParams.q});
  }

  const filters = Object.keys(queryParams).filter(key => key !== 'q');

  if(filters.length > 0) {
    _addFieldFilters({ body, queryParams });
  }

  _addSizeFromParams({ body, queryParams });

  _addIncludeExclude({ body, queryParams });

  _addSortOrder({ body, queryParams });

  let query = body.build('v2');

  return query;
}

function getTermTypes({ queryParams, termTypesToSearch }) {
  let termTypes = termTypesToSearch;
  if (queryParams.term_type) {
    if (queryParams.term_type instanceof Array) {
      termTypes = queryParams.term_type;
    } else {
      termTypes = [queryParams.term_type];
    }
  }

  return termTypes;
}

// This gives me hives. It needs to be refactored
function searchTermsQuery ({ queryParams, termTypesToSearch }) {
  // TODO: use BodyBuilder more
  let body = new Bodybuilder();

  // add query terms (boost when phrase is matched)
  if (queryParams.term) {
    body.query('match', 'term_suggest', queryParams.term);
    body.query('match_phrase', 'term_suggest', { query: queryParams.term });
  }

  // set the term types (use defaults if not supplied)
  const termTypes = getTermTypes({ queryParams, termTypesToSearch });
  termTypes.forEach((termType) => {
    body.orFilter('term', 'term_type', termType);
  });

  // build the query and add custom fields (that bodyparser can't handle)
  let functionQuery = body.build('v2');

  // boost exact match
  if (queryParams.term) {
    functionQuery.query.bool.should = {
      'match': {
        'term': queryParams.term
      }
    };
  }

  // add scoring function - is this really necessary?
  functionQuery.functions = [{
    'field_value_factor': {
      'field': 'count_normalized',
      'factor': 0.25
    }
  }];
  functionQuery.boost_mode = 'multiply';

  let size = queryParams.size || TERM_RESULT_SIZE_DEFAULT;
  size = size > TERM_RESULT_SIZE_MAX ? TERM_RESULT_SIZE_MAX : size;
  let from = queryParams.from ? queryParams.from : 0;

  let query = {
    'query': { 'function_score': functionQuery },
    'size': size,
    'from': from
  };
  return query;
}

function getQueryByTerm({ term=null, termType, size=10, from=0 }) {
  let body = new Bodybuilder();

  if(term) {
    body.query('match', 'term', term);
  }

  body.query('match', 'term_type', termType);
  body.size(size);
  body.from(from);

  return body.build();

}

function getLanguagesSearchQuery(options) {
  const termType = "languages";
  const size = options.size || 100;
  const from = options.from || 0;
  let term;

  if (options.language) {
    term = options.language;
  }

  return getQueryByTerm({ term, termType, size, from });
}
module.exports = {
  getFlattenedMappingPropertiesByType,
  omitPrivateKeys,
  parseResponse,
  createFieldSearchQuery,
  _addMatchPhraseForFullText,
  _addMatchForFullText,
  _addCommonCutoffForFullText,
  _addFullTextQuery,
  _processFilterValue,
  _addStringFilter,
  _addNestedFilter,
  _addStringFilters,
  _getRanges,
  _processDate,
  _addRangeFilter,
  _addDateRangeFilters,
  _addSizeFromParams,
  _addIncludeExclude,
  _addFieldFilters,
  _getSortValues,
  _getSortOptions,
  _addSortOrder,
  createReposSearchQuery,
  getTermTypes,
  searchTermsQuery,
  getQueryByTerm,
  getLanguagesSearchQuery
};
