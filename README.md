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

## 📦 In Code

First, install the package, and then run `next build` to generate the output file:

```bash
npm install next-build-parser
npm run build > next-build.txt
```

Then, after you've  you can use it in your code:

```typescript
import { parse } from 'next-build-parser';

const output = parse('next-build.txt');
console.log(output);
```
