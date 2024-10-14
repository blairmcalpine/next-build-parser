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
