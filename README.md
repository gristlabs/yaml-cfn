# collect-js-deps

[![Build Status](https://travis-ci.org/gristlabs/yaml-schema-cfn.svg?branch=master)](https://travis-ci.org/gristlabs/yaml-schema-cfn)
[![npm version](https://badge.fury.io/js/yaml-schema-cfn.svg)](https://badge.fury.io/js/yaml-schema-cfn)

> Parser and schema for CloudFormation YAML template tags.

Implements support for AWS-specific CloudFormation YAML schema.

The implementation and tests are based on the official AWS Python client
[aws-cli](https://github.com/aws/aws-cli). It supports all intrinsic CloudFormation functions listed in
[AWS docs](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html)
as of October 2017.

## Installation

```
npm install --save-dev yaml-schema-cfn
```

## Usage

```
const { yamlParse, yamlDump } = require('yaml-schema-cfn');

const input = `
Key:
  - !GetAtt Foo.Bar
  - !Equals [!Ref Baz, "hello"]
`;

const parsed = {
  "Key": [
    {"Fn::GetAtt": ["Foo", "Bar"]},
    {"Fn::Equals": [{"Ref": "Baz"}, "hello"]}
  ]
};

assert.deepEqual(yamlParse(input), parsed);
assert.deepEqual(yamlParse(yamlDump(parsed)), parsed);
```

The module uses [js-yaml](https://github.com/nodeca/js-yaml). The schema it uses is also exported,
and may be used e.g. like so:
```
const { schema } = require('yaml-schema-cfn');
const yaml = require('js-yaml');
yaml.safeLoad(input, { schema: schema })
```
