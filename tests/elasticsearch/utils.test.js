const expect = require('chai').expect;
const {
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
} = require('../../libs/elasticsearch/utils');

describe('getFlattenedMappingPropertiesByType', () => {
  it('should ', () => {
    const result = getFlattenedMappingPropertiesByType();
    expect(result).to.equal(false);
  });
});
describe('omitPrivateKeys', () => {
  it('should ', () => {
    const input = {
      repo: {
        _id: 123,
        name: 'test_repo'
      }
    };
    const expected = {
      repo: {
        name: 'test_repo'
      }
    };
    const result = omitPrivateKeys(input);
    expect(result).to.deep.equal(expected);
  });
});
describe('parseResponse', () => {
  it('should ', () => {
    const input = {
      "took" : 3,
      "timed_out" : false,
      "_shards" : {
        "total" : 5,
        "successful" : 5,
        "skipped" : 0,
        "failed" : 0
      },
      "hits" : {
        "total" : 1,
        "max_score" : 3.6521344,
        "hits" : [
          {
            "_index" : "repos20181025_232139",
            "_type" : "repo",
            "_id" : "gsa_gsa_cap_drupal_core",
            "_score" : 3.6521344,
            "_source" : {
              "name" : "CAP-Drupal_Core"
            }
          }
        ]
      },
      aggregations: {
        agg: {
          max_cnt: 10
        }
      }
    };
    const expected = {
      total: 1,
      data: [
        {
          searchScore: 3.6521344,
          name: "CAP-Drupal_Core"
        }
      ],
      aggregations: {
        agg: {
          max_cnt: 10
        }
      }
    };
    const result = parseResponse(input);
    expect(result).to.deep.equal(expected);
  });
});
describe('createFieldSearchQuery', () => {
  it.skip('should ', () => {
    const result = createFieldSearchQuery();
    expect(result).to.equal(false);
  });
});
describe('_addMatchPhraseForFullText', () => {
  it.skip('should ', () => {
    const result = _addMatchPhraseForFullText();
    expect(result).to.equal(false);
  });
});
describe('_addMatchForFullText', () => {
  it.skip('should ', () => {
    const result = _addMatchForFullText();
    expect(result).to.equal(false);
  });
});
describe('_addCommonCutoffForFullText', () => {
  it.skip('should ', () => {
    const result = _addCommonCutoffForFullText();
    expect(result).to.equal(false);
  });
});
describe('_addFullTextQuery', () => {
  it.skip('should ', () => {
    const result = _addFullTextQuery();
    expect(result).to.equal(false);
  });
});
describe('_processFilterValue', () => {
  it.skip('should ', () => {
    const result = _processFilterValue();
    expect(result).to.equal(false);
  });
});
describe('_addStringFilter', () => {
  it.skip('should ', () => {
    const result = _addStringFilter();
    expect(result).to.equal(false);
  });
});
describe('_addNestedFilter', () => {
  it.skip('should ', () => {
    const result = _addNestedFilter();
    expect(result).to.equal(false);
  });
});
describe('_addStringFilters', () => {
  it.skip('should ', () => {
    const result = _addStringFilters();
    expect(result).to.equal(false);
  });
});
describe('_getRanges', () => {
  it.skip('should ', () => {
  const result = _getRanges();
    expect(result).to.equal(false);
  });
});
describe('_processDate', () => {
  it.skip('should ', () => {
  const result = _processDate();
    expect(result).to.equal(false);
  });
});
describe('_addRangeFilter', () => {
  it.skip('should ', () => {
    const result = _addRangeFilter();
    expect(result).to.equal(false);
  });
});
describe('_addDateRangeFilters', () => {
  it.skip('should ', () => {
    const result = _addDateRangeFilters();
    expect(result).to.equal(false);
  });
});
describe('_addSizeFromParams', () => {
  it.skip('should ', () => {
    const result = _addSizeFromParams();
    expect(result).to.equal(false);
  });
});
describe('_addIncludeExclude', () => {
  it.skip('should ', () => {
    const result = _addIncludeExclude();
    expect(result).to.equal(false);
  });
});
describe('_addFieldFilters', () => {
  it.skip('should ', () => {
    const result = _addFieldFilters();
    expect(result).to.equal(false);
  });
});
describe('_getSortValues', () => {
  it.skip('should ', () => {
    const result = _getSortValues();
    expect(result).to.equal(false);
  });
});
describe('_getSortOptions', () => {
  it.skip('should ', () => {
    const result = _getSortOptions();
    expect(result).to.equal(false);
  });
});
describe('_addSortOrder', () => {
  it.skip('should ', () => {
    const result = _addSortOrder();
    expect(result).to.equal(false);
  });
});
describe('createReposSearchQuery', () => {
  it.skip('should ', () => {
    const result = createReposSearchQuery();
    expect(result).to.equal(false);
  });
});
describe('getTermTypes', () => {
  it.skip('should ', () => {
    const result = getTermTypes();
    expect(result).to.equal(false);
  });
});
describe('searchTermsQuery', () => {
  it.skip('should ', () => {
    const result = searchTermsQuery();
    expect(result).to.equal(false);
  });
});
describe('getQueryByTerm', () => {
  it.skip('should ', () => {
    const result = getQueryByTerm();
    expect(result).to.equal(false);
  });
});
describe('getLanguagesSearchQuery', () => {
  it.skip('should ', () => {
    const result = getLanguagesSearchQuery();
    expect(result).to.equal(false);
  });
});
