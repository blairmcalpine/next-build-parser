#!/usr/bin/env node

import { findMarkers } from './sanitize.js';
import {
  generateMiddleware,
  generateRoutes,
  generateRouteTypeMap,
  generateSharedByAll,
  generateSharedByAllTotal,
} from './route.js';
import { defaultSizeUnit, type SizeUnit } from './unit.js';

export type ParseOptions = {
  unit?: SizeUnit;
};

export const parse = (nextBuildOutput: string, options?: ParseOptions) => {
  const data = nextBuildOutput.split('\n').filter(Boolean);
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
  const shared = generateSharedByAll(sharedByAllRows, unit);
  const sharedTotal = generateSharedByAllTotal(sharedByAllTotalRow, unit);
  const middleware = generateMiddleware(middlewareRow, unit);

  const output = {
    ...(middleware !== undefined ? { middleware } : {}),
    routes,
    shared,
    sharedTotal,
    unit,
  };
  return output;
};
