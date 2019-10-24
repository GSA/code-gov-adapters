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

describe('Elasticsearch Utilities', () => {
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
    it('should ', () => {
      const expected = {
        query: {
          match: {
            message: 'test'
          }
        }
      };
  
      const result = createFieldSearchQuery({
        queryType: 'match',
        field: 'message',
        value: 'test'
      });
  
      expect(result).to.deep.equal(expected);
    });
  });
  // below tests have not been fully implemented
  describe.skip('getFlattenedMappingPropertiesByType', () => {
    it('should ', () => {
      const result = getFlattenedMappingPropertiesByType();
      expect(result).to.equal();
    });
  });
  describe.skip('_addMatchPhraseForFullText', () => {
    it('should ', () => {
      const result = _addMatchPhraseForFullText();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_addMatchForFullText', () => {
    it('should ', () => {
      const result = _addMatchForFullText();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_addCommonCutoffForFullText', () => {
    it('should ', () => {
      const result = _addCommonCutoffForFullText();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_addFullTextQuery', () => {
    it('should ', () => {
      const result = _addFullTextQuery();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_processFilterValue', () => {
    it('should ', () => {
      const result = _processFilterValue();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_addStringFilter', () => {
    it('should ', () => {
      const result = _addStringFilter();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_addNestedFilter', () => {
    it('should ', () => {
      const result = _addNestedFilter();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_addStringFilters', () => {
    it('should ', () => {
      const result = _addStringFilters();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_getRanges', () => {
    it('should ', () => {
    const result = _getRanges();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_processDate', () => {
    it('should ', () => {
    const result = _processDate();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_addRangeFilter', () => {
    it('should ', () => {
      const result = _addRangeFilter();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_addDateRangeFilters', () => {
    it('should ', () => {
      const result = _addDateRangeFilters();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_addSizeFromParams', () => {
    it('should ', () => {
      const result = _addSizeFromParams();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_addIncludeExclude', () => {
    it('should ', () => {
      const result = _addIncludeExclude();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_addFieldFilters', () => {
    it('should ', () => {
      const result = _addFieldFilters();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_getSortValues', () => {
    it('should ', () => {
      const result = _getSortValues();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_getSortOptions', () => {
    it('should ', () => {
      const result = _getSortOptions();
      expect(result).to.equal(false);
    });
  });
  describe.skip('_addSortOrder', () => {
    it('should ', () => {
      const result = _addSortOrder();
      expect(result).to.equal(false);
    });
  });
  describe.skip('createReposSearchQuery', () => {
    it('should ', () => {
      const result = createReposSearchQuery();
      expect(result).to.equal(false);
    });
  });
  describe.skip('getTermTypes', () => {
    it('should ', () => {
      const result = getTermTypes();
      expect(result).to.equal(false);
    });
  });
  describe.skip('searchTermsQuery', () => {
    it('should ', () => {
      const result = searchTermsQuery();
      expect(result).to.equal(false);
    });
  });
  describe.skip('getQueryByTerm', () => {
    it('should ', () => {
      const result = getQueryByTerm();
      expect(result).to.equal(false);
    });
  });
  describe.skip('getLanguagesSearchQuery', () => {
    it('should ', () => {
      const result = getLanguagesSearchQuery();
      expect(result).to.equal(false);
    });
  });
});
