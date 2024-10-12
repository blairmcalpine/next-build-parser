import { expect, beforeEach, describe, vi, it, afterEach } from 'vitest';
import { execute } from '../index.js';

const createArgv = (argv: string[]) => [
  process.argv[0],
  process.argv[1],
  ...argv,
];

describe('next-build-parser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse the output file', () => {
    const result = execute(createArgv(['test.txt']));
    expect(result).toBe('blair');
  });
});
