import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import { cli } from '../src/cli.js';
import * as parseModule from '../src/parse.js';

describe('cli', () => {
  it('should write the output to a file if the --output flag is provided', () => {
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    cli([
      'node',
      'index.js',
      'test/samples/basic.txt',
      '--output',
      'output.json',
    ]);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'output.json',
      expect.any(String),
    );
  });
  it('should respsect the --unit flag', () => {
    vi.spyOn(parseModule, 'parse');
    cli(['node', 'index.js', 'test/samples/basic.txt', '--unit', 'B']);
    expect(parseModule.parse).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ unit: 'B' }),
    );
  });
});
