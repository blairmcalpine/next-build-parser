import { expect, describe, it } from 'vitest';
import { parseFile } from '../src/parseFile.js';

describe('parseFile', () => {
  it('should parse the build file', () => {
    const result = parseFile('test/samples/basic.txt');
    expect(result).toMatchSnapshot();
  });
});
