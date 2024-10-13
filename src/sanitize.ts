import { z } from 'zod';
import { defaultSizeUnit, sizeUnitSchema } from './unit.js';

export const sanitizeRow = (row: string) => {
  return row
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((cell) => (isNaN(Number(cell)) ? cell : Number(cell)));
};

const ROUTE_LABEL = 'Route (app)';
const SHARED_BY_ALL_LABEL = 'First Load JS shared by all';

export const findMarkers = (data: string[]) => {
  const routeMarker = data.findIndex((line) => line.includes(ROUTE_LABEL));
  if (routeMarker === -1) {
    console.error(`No line containing "${ROUTE_LABEL}" found.`);
    process.exit(1);
  }
  const sharedByAllMarker = data.findIndex((line) =>
    line.includes(SHARED_BY_ALL_LABEL),
  );
  if (sharedByAllMarker === -1) {
    console.error(`No line containing "${SHARED_BY_ALL_LABEL}" found.`);
    process.exit(1);
  }
  const routeTypeMapMarker = data.findIndex(
    (line, index) =>
      index > sharedByAllMarker &&
      !line.startsWith(' ') &&
      !line.includes('Middleware'),
  );
  if (routeTypeMapMarker === -1) {
    console.error(
      `No line describing route types found after "${SHARED_BY_ALL_LABEL}".`,
    );
    process.exit(1);
  }
  let middlewareMarker: number | undefined = data.findIndex(
    (line, index) => index > sharedByAllMarker && line.includes('Middleware'),
  );
  if (middlewareMarker === -1) {
    middlewareMarker = undefined;
  }

  return {
    routeMarker,
    sharedByAllMarker,
    routeTypeMapMarker,
    middlewareMarker,
  };
};

const parseArg = <S extends z.ZodSchema>(
  argv: string[],
  argName: number | string,
  schema: S,
  options?: { defaultValue?: z.infer<S> },
): z.infer<S> => {
  let arg: string | undefined;
  if (typeof argName === 'number') {
    arg = argv[argName];
  } else {
    const argIndex = argv.indexOf(argName);
    arg = argIndex > 0 ? argv[argIndex + 1] : options?.defaultValue;
  }
  const result = schema.safeParse(arg);
  if (!result.success) {
    if (typeof argName === 'string') {
      console.error(
        `Invalid ${argName} option: ${arg}. Values must be fit the following description: ${schema.description}`,
      );
    } else {
      const dots = '... '.repeat(argName - 2);
      console.error(
        `Argument ${argName - 1} is invalid.\nUsage: next-build-parser ${dots}${schema.description}`,
      );
    }
    process.exit(1);
  }
  return result.data;
};

export const parseOutputFileArg = (argv: string[]) =>
  parseArg(
    argv,
    '--output',
    z.string().optional().describe('Any string type.'),
  );

export const parseUnitArg = (argv: string[]) =>
  parseArg(argv, '--unit', sizeUnitSchema, { defaultValue: defaultSizeUnit });

export const parsePrimaryArg = (argv: string[]) =>
  parseArg(argv, 2, z.string().describe('<Output file of next build>'));
