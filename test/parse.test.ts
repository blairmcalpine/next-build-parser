import { expect, describe, it } from 'vitest';
import { parse } from '../src/parse.js';
import fs from 'node:fs';

describe('parse', () => {
  describe('routes', () => {
    it('should output based on the unit option', () => {
      const file = fs.readFileSync('test/samples/basic.txt', 'utf8');
      const { routes } = parse(file, {
        unit: 'B',
      });
      const routeSizes = routes.map((route) => route.size);
      const routeFirstLoads = routes.map((route) => route.firstLoad);
      expect(routeSizes).toMatchSnapshot();
      expect(routeFirstLoads).toMatchSnapshot();
    });

    it('should output the correct route type', () => {
      const file = fs.readFileSync('test/samples/basic.txt', 'utf8');
      const { routes } = parse(file);
      const routeTypes = routes.map((route) => route.type);
      expect(routeTypes).toMatchSnapshot();
    });

    it('should output the correct route icon', () => {
      const file = fs.readFileSync('test/samples/basic.txt', 'utf8');
      const { routes } = parse(file);
      const routeIcons = routes.map((route) => route.icon);
      expect(routeIcons).toMatchSnapshot();
    });

    it('should output the correct route name', () => {
      const file = fs.readFileSync('test/samples/basic.txt', 'utf8');
      const { routes } = parse(file);
      const routePaths = routes.map((route) => route.name);
      expect(routePaths).toMatchSnapshot();
    });
  });

  describe('shared', () => {
    it('should output based on the unit option', () => {
      const file = fs.readFileSync('test/samples/basic.txt', 'utf8');
      const { shared } = parse(file, {
        unit: 'B',
      });
      expect(shared).toMatchSnapshot();
    });
    it('should output the correct names', () => {
      const file = fs.readFileSync('test/samples/basic.txt', 'utf8');
      const { shared } = parse(file);
      const sharedNames = shared.map((shared) => shared.name);
      expect(sharedNames).toMatchSnapshot();
    });
    it('should output the correct shared by all total', () => {
      const file = fs.readFileSync('test/samples/basic.txt', 'utf8');
      const { sharedTotal } = parse(file);
      expect(sharedTotal).toMatchSnapshot();
    });
    it('should output the correct other chunks', () => {
      const file = fs.readFileSync('test/samples/other-shared.txt', 'utf8');
      const { shared } = parse(file);
      const otherChunks = shared.filter((shared) => shared.name === 'other');
      expect(otherChunks).toMatchSnapshot();
    });
  });
  describe('middleware', () => {
    it('should output based on the unit option', () => {
      const file = fs.readFileSync('test/samples/middleware.txt', 'utf8');
      const { middleware } = parse(file, {
        unit: 'B',
      });
      expect(middleware).toMatchSnapshot();
    });
  });
});
