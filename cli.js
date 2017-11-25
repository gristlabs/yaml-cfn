#!/usr/bin/env node
"use strict";

const {readFile} = require('fs');
const {yamlDump, yamlParse} = require('.');

function main(filePath) {
  return readFile(filePath, 'utf8', (err, text) => {
    if (err) {
      console.log(`Error reading ${filePath}: ${err}`);
      return;
    }
    let isYaml, data;
    try {
      data = JSON.parse(text);
      isYaml = false;
    } catch (e) {
      data = yamlParse(text);
      isYaml = true;
    }
    console.log(isYaml ?
      JSON.stringify(data, null, 2) :
      yamlDump(data));
  });
}

if (require.main === module) {
  if (process.argv.length !== 3) {
    console.log(`Usage: ${process.argv[1]} <JSON-or-YAML-file>`);
    process.exit(1);
  } else {
    main(process.argv[2]);
  }
}
