import { z } from 'zod';

export const sizeUnits = [
  'B',
  'kB',
  'MB',
  'GB',
  'TB',
  'PB',
  'EB',
  'ZB',
  'YB',
] as const;

export const sizeUnitSchema = z
  .enum(sizeUnits)
  .describe(`One of: ${sizeUnits.join(', ')}`);
export type SizeUnit = z.infer<typeof sizeUnitSchema>;

export const defaultSizeUnit = 'kB' satisfies SizeUnit;

export const convertSizeUnit = (size: number, from: SizeUnit, to: SizeUnit) => {
  const fromIndex = sizeUnits.indexOf(from);
  const toIndex = sizeUnits.indexOf(to);
  const exponent = fromIndex - toIndex;
  const result = size * Math.pow(1024, exponent);
  return Math.round((result + Number.EPSILON) * 100) / 100;
};
