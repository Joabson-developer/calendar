# Calendar

## Install and watch Sass

Installs the global Sass command-line tool and starts watching the `scss/style.scss` file, compiling it to `css/style.css` whenever changes are detected.

```bash
npm install -g sass
sass --watch scss/style.scss:css/style.css
```

## Install and watch TypeScript

Installs the global TypeScript command-line tool and starts watching the `script/main.ts` file, compiling it to ECMAScript 2022 whenever changes are detected.

```bash
npm install -g tsc
tsc --target es2022 --watch script/main.ts
```
