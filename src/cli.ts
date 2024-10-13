#!/usr/bin/env node

import { parse } from './parse.js';
import {
  parseOutputFileArg,
  parsePrimaryArg,
  parseUnitArg,
} from './sanitize.js';
import fs from 'node:fs';

export const cli = (argv: string[]) => {
  const inputFile = parsePrimaryArg(argv);
  const unit = parseUnitArg(argv);
  const outputFile = parseOutputFileArg(argv);
  const result = parse(inputFile, { unit });
  if (outputFile) {
    try {
      fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(`Error writing to file ${outputFile}: ${error}`);
      process.exit(1);
    }
  } else {
    console.log(result);
  }
};

if (!process.env.TEST) {
  cli(process.argv);
}
