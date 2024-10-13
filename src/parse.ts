#!/usr/bin/env node

import fs from 'node:fs';
import { findMarkers } from './sanitize.js';
import {
  generateMiddleware,
  generateRoutes,
  generateRouteTypeMap,
  generateSharedByAll,
  generateSharedByAllTotal,
} from './route.js';
import { defaultSizeUnit, type SizeUnit } from './unit.js';

type ExecuteOptions = {
  unit?: SizeUnit;
};

export const parse = (inputFile: string, options?: ExecuteOptions) => {
  let data: string[];
  try {
    data = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);
  } catch (error) {
    console.error(`Error reading file ${inputFile}: ${error}`);
    process.exit(1);
  }
  const unit = options?.unit ?? defaultSizeUnit;

  const {
    sharedByAllMarker,
    routeTypeMapMarker,
    routeMarker,
    middlewareMarker,
  } = findMarkers(data);

  const routeRows = data.slice(routeMarker + 1, sharedByAllMarker);
  const sharedByAllRows = data.slice(
    sharedByAllMarker + 1,
    middlewareMarker ?? routeTypeMapMarker,
  );
  const routeTypeMapRows = data.slice(routeTypeMapMarker);
  const sharedByAllTotalRow = data[sharedByAllMarker]!;
  const middlewareRow =
    middlewareMarker !== undefined ? data[middlewareMarker] : undefined;

  const routeTypeMap = generateRouteTypeMap(routeTypeMapRows);
  const routes = generateRoutes(routeRows, routeTypeMap, unit);
  const sharedByAll = generateSharedByAll(sharedByAllRows, unit);
  const sharedByAllTotal = generateSharedByAllTotal(sharedByAllTotalRow, unit);
  const middleware = generateMiddleware(middlewareRow, unit);

  const output = {
    ...(middleware !== undefined ? { middleware } : {}),
    routes,
    sharedByAll,
    sharedByAllTotal,
    unit,
  };
  return output;
};
