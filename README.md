# next-build-parser

🚀 A quick and easy tool to parse the output of [Next.js](https://github.com/vercel/next.js)' `next build` command into machine readable JSON, to fit whatever needs you may have.

# Usage

## 💻 As a CLI

Assuming you have a `build` package.json script that runs `next build`, you can run:

```bash
npm run build > next-build.txt
npx next-build-parser next-build.txt
```

This will output a JSON object to stdout. If you would like to output it to a file, you can run:

```bash
npx next-build-parser next-build.txt --output output.json
```

For other CLI options, run:

```bash
npx next-build-parser --help
```

## 📦 In Code

First, install the package, and then run `next build` to generate the output file:

```bash
npm install next-build-parser
npm run build > next-build.txt
```

Then you can use it in your code:

```typescript
import { parse } from 'next-build-parser';

const output = parse('next-build.txt');
console.log(output);
```

# Output

The output is a JSON object with the following structure:

```typescript
type Output = {
  routes: {
    name: string; // The name of the route, e.g. /blog
    type: string; // The type of the route, e.g. Dynamic, Static, etc.
    icon: string; // The icon of the route type, e.g. λ
    size: number; // The gzipped size of the route in the specified unit, e.g. 1000
    firstLoad: number; // The gzipped size of the first load JS in the specified unit, e.g. 1000
  }[];
  shared: {
    name: string; // The name of the chunk, e.g. chunks/472-9100b5fcfec8f88c.js
    size: number; // The gzipped size of the chunk in the specified unit, e.g. 1000
  }[];
  sharedTotal: number; // The total gzipped size of all the shared chunks in the specified unit, e.g. 1000
  unit: string; // The unit of the size, e.g. B, KB, MB, etc
  middleware?: number; // The gzipped size of the middleware in the specified unit, e.g. 1000
};
```
