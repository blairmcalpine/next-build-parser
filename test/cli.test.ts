import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import { cli } from '../src/cli.js';

describe('cli', () => {
  it('should write the output to a file if the --output flag is provided', () => {
    vi.spyOn(fs, 'writeFileSync');
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
});
