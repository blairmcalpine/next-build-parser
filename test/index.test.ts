import { expect, beforeEach, describe, vi, it } from 'vitest';
import { execute } from '../src/index.js';
import fs from 'node:fs';

const createArgv = (argv: string[]) => [
  process.argv[0],
  process.argv[1],
  ...argv,
];

describe('next-build-parser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse the build file', () => {
    const result = execute(createArgv(['test/basic.txt']));
    expect(result).toMatchSnapshot();
  });
  it('should parse the build file and output based on the --output flag', () => {
    const result = execute(createArgv(['test/basic.txt', '--unit', 'B']));
    expect(result).toMatchSnapshot();
  });

  it('should write the output to a file if the --output flag is provided', () => {
    vi.spyOn(fs, 'writeFileSync');
    execute(createArgv(['test/basic.txt', '--output', 'output.json']));
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'output.json',
      expect.any(String),
    );
  });

  it('should parse the middleware output', () => {
    const result = execute(createArgv(['test/middleware.txt']));
    expect(result.middleware).toBe(0);
  });
});
