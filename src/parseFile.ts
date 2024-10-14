import type { PathOrFileDescriptor } from 'node:fs';
import fs from 'node:fs';
import { parse, type ParseOptions } from './parse.js';

export const parseFile = (
  file: PathOrFileDescriptor,
  options?: ParseOptions,
) => {
  const data = fs.readFileSync(file, 'utf8');
  return parse(data, options);
};
