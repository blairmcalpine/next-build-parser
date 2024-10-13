#!/usr/bin/env node

import fs from 'node:fs';
import {
  findMarkers,
  parseOutputFileArg,
  parsePrimaryArg,
  parseUnitArg,
} from './sanitize.js';
import {
  generateMiddleware,
  generateRoutes,
  generateRouteTypeMap,
  generateSharedByAll,
  generateSharedByAllTotal,
} from './route.js';

export const execute = (argv: string[]) => {
  const inputFile = parsePrimaryArg(argv);
  const unit = parseUnitArg(argv);
  const outputFile = parseOutputFileArg(argv);
  console.log({ outputFile });

  let data: string[];
  try {
    data = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);
  } catch (error) {
    console.error(`Error reading file ${inputFile}: ${error}`);
    process.exit(1);
  }

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

  const output: Record<string, unknown> = {
    routes,
    sharedByAll,
    sharedByAllTotal,
    unit,
  };

  if (middleware !== undefined) {
    output.middleware = middleware;
  }

  if (outputFile) {
    try {
      fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    } catch (error) {
      console.error(`Error writing to file ${outputFile}: ${error}`);
      process.exit(1);
    }
  } else {
    console.log(output);
  }
  return output;
};
