import { expect, beforeEach, describe, vi, it } from 'vitest';
import { parse } from '../src/parse.js';
import fs from 'node:fs';

const createArgv = (argv: string[]) => [
  process.argv[0],
  process.argv[1],
  ...argv,
];

describe('execute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse the build file', () => {
    const result = parse('test/samples/basic.txt');
    expect(result).toMatchSnapshot();
  });
  it('should parse the build file and output based on the unit option', () => {
    const result = parse('test/samples/basic.txt', {
      unit: 'B',
    });
    expect(result).toMatchSnapshot();
  });

  it('should parse the middleware output', () => {
    const result = parse('test/samples/middleware.txt');
    expect(result.middleware).toBe(0);
  });
});
