import { z } from 'zod';
import { sanitizeRow } from './sanitize.js';
import { convertSizeUnit, type SizeUnit, sizeUnitSchema } from './unit.js';

const routeMapSchema = z.array(z.string()).min(2);

export const generateRouteTypeMap = (rows: string[]) => {
  return rows.reduce(
    (acc, row) => {
      const columns = sanitizeRow(row);
      const result = routeMapSchema.safeParse(columns);
      if (!result.success) {
        console.error(
          `Invalid route type description for row ${row}: ${result.error.message}`,
        );
        process.exit(1);
      }
      acc[result.data[0]!] = result.data[1]!.replace('(', '').replace(')', '');
      return acc;
    },
    {} as Record<string, string>,
  );
};

const routeSchema = z.tuple([
  z.string(),
  z.string(),
  z.string(),
  z.number(),
  sizeUnitSchema,
  z.number(),
  sizeUnitSchema,
]);

export const generateRoutes = (
  rows: string[],
  routeTypeMap: Record<string, string>,
  unit: SizeUnit,
) => {
  return rows.map((row) => {
    const columns = sanitizeRow(row);
    const result = routeSchema.safeParse(columns);
    if (!result.success) {
      console.error(
        `Invalid route definition for row ${row}: ${result.error.message}`,
      );
      process.exit(1);
    }
    const routeType = routeTypeMap[result.data[1]];
    if (!routeType) {
      console.error(
        `Unknown route type icon for row ${row}: ${result.data[1]}`,
      );
      process.exit(1);
    }
    return {
      routeTypeIcon: result.data[1],
      routeType,
      route: result.data[2],
      size: convertSizeUnit(result.data[3], result.data[4], unit),
      firstLoad: convertSizeUnit(result.data[5], result.data[6], unit),
    };
  });
};

const sharedByAllSchema = z.tuple([
  z.string(),
  z.string(),
  z.number(),
  sizeUnitSchema,
]);

const OTHER_SHARED_CHUNKS_TOTAL_LABEL = 'other shared chunks (total)';

export const generateSharedByAll = (rows: string[], unit: SizeUnit) => {
  return rows.map((row) => {
    if (row.includes(OTHER_SHARED_CHUNKS_TOTAL_LABEL)) {
      row = row.replace(OTHER_SHARED_CHUNKS_TOTAL_LABEL, 'Other');
    }
    const columns = sanitizeRow(row);
    const result = sharedByAllSchema.safeParse(columns);
    if (!result.success) {
      console.error(
        `Invalid 'shared by all' definition for row ${row}: ${result.error.message}`,
      );
      process.exit(1);
    }
    return {
      chunk: result.data[1],
      size: convertSizeUnit(result.data[2], result.data[3], unit),
    };
  });
};

const sharedByAllTotalSchema = z.tuple([
  z.string(),
  z.string(),
  z.string(),
  z.string(),
  z.string(),
  z.string(),
  z.string(),
  z.number(),
  sizeUnitSchema,
]);

export const generateSharedByAllTotal = (row: string, unit: SizeUnit) => {
  const columns = sanitizeRow(row);
  const result = sharedByAllTotalSchema.safeParse(columns);
  if (!result.success) {
    console.error(
      `Invalid 'shared by all total' definition for row ${row}: ${result.error.message}`,
    );
    process.exit(1);
  }
  return convertSizeUnit(result.data[7], result.data[8], unit);
};

const middlewareSchema = z.tuple([
  z.string(),
  z.literal('Middleware'),
  z.number(),
  sizeUnitSchema,
]);

export const generateMiddleware = (row: string | undefined, unit: SizeUnit) => {
  if (!row) {
    return undefined;
  }
  const columns = sanitizeRow(row);
  const result = middlewareSchema.safeParse(columns);
  if (!result.success) {
    console.error(
      `Invalid 'middleware' definition for row ${row}: ${result.error.message}`,
    );
    process.exit(1);
  }
  return convertSizeUnit(result.data[2], result.data[3], unit);
};
