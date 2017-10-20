/**
 * This test is based on the test in the official AWS python client:
 * https://github.com/aws/aws-cli/blob/develop/tests/unit/customizations/cloudformation/test_yamlhelper.py
 */
"use strict";

/* global describe, it */

const assert = require('assert');
const { yamlParse, yamlDump } = require('../index');


describe('yaml-schema', function() {
  const yamlWithTags = `
  Resource:
      Key1: !Ref Something
      Key2: !GetAtt Another.Arn
      Key3: !Equals [!Base64 YetAnother, "hello"]
      Key4: !Sub {"a": "1"}
      Key5: !GetAtt OneMore.Outputs.Arn
      Key6: !Condition OtherCondition
  `;

  const parsedYamlDict = {
    "Resource": {
      "Key1": {
        "Ref": "Something"
      },
      "Key2": {
        "Fn::GetAtt": ["Another", "Arn"]
      },
      "Key3": {
        "Fn::Equals": [
          {"Fn::Base64": "YetAnother"},
          "hello"
        ]
      },
      "Key4": {
        "Fn::Sub": {
          "a": "1"
        }
      },
      "Key5": {
        "Fn::GetAtt": ["OneMore", "Outputs.Arn"]
      },
      "Key6": {
        "Condition": "OtherCondition"
      }
    }
  };

  it("should parse yaml with tags", function() {
    const output = yamlParse(yamlWithTags);
    assert.deepEqual(output, parsedYamlDict);

    // Make sure formatter and parser work well with each other.
    const formatted = yamlDump(output);
    const outputAgain = yamlParse(formatted);
    assert.deepEqual(output, outputAgain);
  });

  it("should handle GetAtt even if invalid", function() {
    // This tests is as it exists in the python test at https://github.com/aws/aws-cli.
    // This is an invalid syntax for !GetAtt. But make sure the code does not crash when we encouter this syntax.
    // Let CloudFormation interpret this value at runtime.
    const input = `
    Resource:
      Key: !GetAtt ["a", "b"]
    `;
    const output = {
      "Resource": {
        "Key": {
          "Fn::GetAtt": ["a", "b"]
        }
      }
    };

    const actualOutput = yamlParse(input);
    assert.deepEqual(actualOutput, output);
  });

  it("should handle json with tabs", function() {
    const template = '{\n\t"foo": "bar"\n}';
    const output = yamlParse(template);
    assert.deepEqual(output, {'foo': 'bar'});
  });

  it("should handle the example from the README", function() {
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
  });
});
