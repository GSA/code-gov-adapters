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
    const testData = {
      "properties" : {
        "additionalInformation" : {
          "type" : "object",
          "dynamic" : "true"
        },
        "agency" : {
          "properties" : {
            "acronym" : {
              "type" : "keyword",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "normalizer" : "lowercase"
                }
              }
            },
            "codeUrl" : {
              "type" : "keyword",
              "normalizer" : "lowercase"
            },
            "complianceDashboard" : {
              "type" : "boolean"
            },
            "fallback_file" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "name" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "normalizer" : "lowercase"
                }
              },
              "analyzer" : "englishfulltext"
            },
            "requirements" : {
              "properties" : {
                "agencyWidePolicy" : {
                  "type" : "float"
                },
                "inventoryRequirement" : {
                  "type" : "float"
                },
                "openSourceRequirement" : {
                  "type" : "float"
                },
                "overallCompliance" : {
                  "type" : "float"
                },
                "schemaFormat" : {
                  "type" : "float"
                }
              }
            },
            "website" : {
              "type" : "keyword",
              "normalizer" : "lowercase"
            }
          }
        },
        "contact" : {
          "properties" : {
            "URL" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "email" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "normalizer" : "lowercase"
                }
              },
              "analyzer" : "englishfulltext"
            },
            "name" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "normalizer" : "lowercase"
                }
              },
              "analyzer" : "englishfulltext"
            },
            "phone" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "normalizer" : "lowercase"
                }
              },
              "analyzer" : "englishfulltext"
            },
            "twitter" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "normalizer" : "lowercase"
                }
              },
              "analyzer" : "englishfulltext"
            }
          }
        },
        "date" : {
          "properties" : {
            "created" : {
              "type" : "date",
              "ignore_malformed" : true
            },
            "lastModified" : {
              "type" : "date",
              "ignore_malformed" : true
            },
            "metadataLastUpdated" : {
              "type" : "date",
              "ignore_malformed" : true
            }
          }
        },
        "description" : {
          "type" : "text",
          "analyzer" : "englishfulltext"
        },
        "disclaimerText" : {
          "type" : "text",
          "analyzer" : "englishfulltext"
        },
        "disclaimerURL" : {
          "type" : "keyword",
          "normalizer" : "lowercase"
        },
        "downloadURL" : {
          "type" : "keyword",
          "normalizer" : "lowercase"
        },
        "events" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "normalizer" : "lowercase"
            }
          },
          "analyzer" : "englishfulltext"
        },
        "homepageURL" : {
          "type" : "keyword",
          "normalizer" : "lowercase"
        },
        "laborHours" : {
          "type" : "integer"
        },
        "languages" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "normalizer" : "lowercase"
            }
          },
          "analyzer" : "englishfulltext"
        },
        "measurementType" : {
          "properties" : {
            "ifOther" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "normalizer" : "lowercase"
                }
              },
              "analyzer" : "englishfulltext"
            },
            "method" : {
              "type" : "keyword"
            }
          }
        },
        "name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "normalizer" : "lowercase"
            }
          },
          "analyzer" : "englishfulltext"
        },
        "organization" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "normalizer" : "lowercase"
            }
          },
          "analyzer" : "englishfulltext"
        },
        "partners" : {
          "type" : "nested",
          "include_in_root" : true,
          "properties" : {
            "email" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword"
                }
              },
              "analyzer" : "englishfulltext"
            },
            "name" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword"
                }
              },
              "analyzer" : "englishfulltext"
            }
          }
        },
        "permissions" : {
          "properties" : {
            "exemptionText" : {
              "type" : "text",
              "analyzer" : "englishfulltext"
            },
            "licenses" : {
              "type" : "nested",
              "properties" : {
                "URL" : {
                  "type" : "keyword",
                  "normalizer" : "lowercase"
                },
                "name" : {
                  "type" : "text",
                  "fields" : {
                    "keyword" : {
                      "type" : "keyword",
                      "normalizer" : "lowercase"
                    }
                  },
                  "analyzer" : "englishfulltext"
                }
              }
            },
            "usageType" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "normalizer" : "lowercase"
                }
              },
              "analyzer" : "englishfulltext"
            }
          }
        },
        "relatedCode" : {
          "type" : "nested",
          "properties" : {
            "URL" : {
              "type" : "keyword",
              "normalizer" : "lowercase"
            },
            "codeName" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "codeURL" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "isGovernmentRepo" : {
              "type" : "boolean"
            },
            "name" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "normalizer" : "lowercase"
                }
              },
              "analyzer" : "englishfulltext"
            }
          }
        },
        "repoID" : {
          "type" : "keyword",
          "normalizer" : "lowercase"
        },
        "repositoryURL" : {
          "type" : "keyword"
        },
        "reusedCode" : {
          "type" : "nested",
          "properties" : {
            "URL" : {
              "type" : "keyword",
              "normalizer" : "lowercase"
            },
            "name" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "normalizer" : "lowercase"
                }
              },
              "analyzer" : "englishfulltext"
            }
          }
        },
        "score" : {
          "type" : "integer"
        },
        "status" : {
          "type" : "keyword",
          "normalizer" : "lowercase"
        },
        "tags" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "normalizer" : "lowercase"
            }
          },
          "analyzer" : "englishfulltext"
        },
        "targetOperatingSystems" : {
          "type" : "keyword",
          "normalizer" : "lowercase"
        },
        "vcs" : {
          "type" : "keyword",
          "normalizer" : "lowercase"
        },
        "version" : {
          "type" : "keyword",
          "normalizer" : "lowercase"
        }
      }
    };

    const expectedData = {
      "object": [
        'additionalInformation'
      ],
      "keyword": [
        'agency.acronym',
        'agency.codeUrl',
        'agency.website',
        'disclaimerURL',
        'downloadURL',
        'homepageURL',
        'measurementType.method',
        'permissions.licenses.URL',
        'relatedCode.URL',
        'repoID',
        'repositoryURL',
        'reusedCode.URL',
        'status',
        'targetOperatingSystems',
        'vcs',
        'version'
      ],
      "boolean": [
        'agency.complianceDashboard',
        'relatedCode.isGovernmentRepo'
      ],
      "text": [
        'agency.fallback_file',
        'agency.name',
        'contact.URL',
        'contact.email',
        'contact.name',
        'contact.phone',
        'contact.twitter',
        'description',
        'disclaimerText',
        'events',
        'languages',
        'measurementType.ifOther',
        'name',
        'organization',
        'partners.email',
        'partners.name',
        'permissions.exemptionText',
        'permissions.licenses.name',
        'permissions.usageType',
        'relatedCode.codeName',
        'relatedCode.codeURL',
        'relatedCode.name',
        'reusedCode.name',
        'tags'
      ],
      "float": [
        'agency.requirements.agencyWidePolicy',
        'agency.requirements.inventoryRequirement',
        'agency.requirements.openSourceRequirement',
        'agency.requirements.overallCompliance',
        'agency.requirements.schemaFormat'
      ],
      "date": [
        'date.created',
        'date.lastModified',
        'date.metadataLastUpdated'
      ],
      "integer": [
        'laborHours',
        'score'
      ],
      "nested": [
        'partners',
        'permissions.licenses',
        'relatedCode',
        'reusedCode'
      ]
    };

    const result = getFlattenedMappingPropertiesByType(testData);

    expect(result).to.deep.equal(expectedData);
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
