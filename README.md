# next-build-parser

🚀 A quick and easy tool to parse the output of the [Next.js](https://github.com/vercel/next.js) `next build` command into machine readable JSON, to fit whatever needs you may have.

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
import { readFileSync } from "node:fs"

const file = readFileSync('next-build.txt', 'utf8');
const output = parse(file, {
  unit: 'MB',
});
console.log(output);
```

or using the more convenient `parseFile` function:

```typescript
import { parseFile } from 'next-build-parser';

const output = parseFile('next-build.txt', {
  unit: 'MB',
});
console.log(output);
```

## ➡️ Output

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

# FAQs

- What is the difference between `firstLoad` and `size`?

  `size` is the gzipped size of the route only, assuming the user has already downloaded the shared JS.
  This is representative of the download size for a user that has alreaedy visited another route, but is visiting this one for the first time.

  `firstLoad` is the total gzipped size of that route, which includes the shared JS. Other included files are typically shared layout files.
  This is representative of the download size for a user that is visiting this route for the first time, and has not visited any other route before this.

- Why isn't `firstLoad` the sum of `size` and `sharedTotal`?

  This is usually because there is some other JS included in `sharedTotal` but not exclusive to this route, for example any client-side JS in Next.js layout files.
