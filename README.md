# Code.gov Adapters
[![CircleCI](https://circleci.com/gh/GSA/code-gov-adapters/tree/master.svg?style=svg)](https://circleci.com/gh/GSA/code-gov-adapters/tree/master)
[![Maintainability](https://api.codeclimate.com/v1/badges/e1477b41ad84c1828f5d/maintainability)](https://codeclimate.com/github/GSA/code-gov-adapters/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e1477b41ad84c1828f5d/test_coverage)](https://codeclimate.com/github/GSA/code-gov-adapters/test_coverage)

A collection of adapters used by Code.gov.

## Adapters

Any number of adapters can be added, for any use. Primary adapters will be for Elasticsearch and databases.

### Elasticsearch

The primary adapter for Code.gov. This adapter will expose a limited amount of Elasticsearch's API.

1. createIndex
2. deleteIndex
3. indexExists
4. indexDocument
5. updateDocument
6. deleteDocument
7. getIndexesForAlias
8. initIndexMapping
9. initIndexSettings
10. search

## Install

```
npm i @code.gov/code-gov-adapters
```

## Contributing

Here’s how you can help contribute to code.gov:

- Source Code Policy

  - To provide feedback on the [Federal Source Code Policy](https://sourcecode.cio.gov/), follow [this issue tracker](https://github.com/WhiteHouse/source-code-policy/issues)

- Code.gov
  - To provide feedback on code-gov-adapters, please checkout our [Contributing Guildelines](CONTRIBUTING.md).
  - To contribute to the Code.gov harvester, go to the [code-gov-harvester] repo at (https://github.com/GSA/code-gov-harvester)
  - To contribute to the Code.gov integrations, go to the [code-gov-integrations] repo at (https://github.com/GSA/code-gov-integrations)
  - To contribute to the Code.gov data, go to the [code-gov-data] repo at (https://github.com/GSA/code-gov-data)
  - Checkout [code-gov](https://github.com/GSA/code-gov) for a list of additional project repositories. If you aren't sure where your question or idea fits, this is a good place to share it.

## Generating License Data

To update the `dependency_licenses.json` file, run `npm run licenses`.

## License

As stated in [CONTRIBUTING](CONTRIBUTING.md):

> [..] this project is in the worldwide public domain (in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/)).

> All contributions to this project will be released under the CC0
> dedication. By submitting a pull request, you are agreeing to comply
> with this waiver of copyright interest.
