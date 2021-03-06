

# simple-logging-loader

---

Deprecated - please use [babel-plugin-simple-logger](https://www.npmjs.com/package/babel-plugin-simple-logger) instead.

---

This loader looks for the string literal `"log"` after the opening bracket of a function and replaces it with `console.log(<function name>, arguments)`.

## Installation & Usage

**Install the package**
```bash
npm install -D simple-logging-loader
```

**Incorporate the loader**

```js
// webpack.config.js
...
{
	test: /\.(js)$/,
	exclude: /(node_modules)/,
	use: [
		{ loader: 'ng-annotate-loader' },
		{ loader: 'babel-loader', options: { presets: ['es2015', 'stage-0'] } },
		{ loader: 'simple-logging-loader' }
	]
},
...

```

**Test it out**

```js

function greeter(name) { 'log'
	return `Hello, ${name || 'world'}!`
}

console.log(greeter("Gus"))

// greeter ["Gus", callee: (...), Symbol(Symbol.iterator): ƒ]
// Hello, Gus!

const berater = name => {
	"log"
	return `I'm tired of your shit, ${name || 'world'}.`
}

console.log(berater())

// anonymous [undefined, callee: (...), Symbol(Symbol.iterator): ƒ]
// I'm tired of your shit, world.

```


Keep in mind:
* `"log"` must be the first string literal following the function's opening bracket `{`.
* This loader is best used early on, it cleans up after itself and understands arrow functions.
* This loader is a litle bit brittle at the moment, I'm working on refactoring it as a babel plugin, but do keep an eye out for edge cases where it doesn't work (for example, if you try to destructure an object in the parameters).

## Scratchwork

require at the top of the js loading chain - or maybe right after es5 transpilation.

simple example:

```js
module.exports = function simpleLoggingLoader(source) {
  return source.replace(/"log"/g, "console.log('logger', arguments)")
}
 ```

important to dos

*match single and double quotes*

```js

module.exports = function simpleLoggingLoader(source) {
  return source.replace(/"log"|'log'/g, "console.log('logger', arguments)")
}

```

*move the result of this loader behind other string literals*

Tell the user to always include this before other loaders that care about string literals

*include the function name in the log*

I want to match any of these

`^function(whitespace)<name>*(*)*{(whitespace)("|')log("|')$`

`^*<name>(whitespace)=(whitespace)function*(*)*{(whitespace)("|')log("|')$`

replace: `console.log(<name>, arguments)`

If the function is anonymous, I'll just log some placeholder

`^function*(*)*{(whitespace)("|')log("|')$`

`^*=>*{(whitespace)("|')log("|')$`

replace: `console.log("anonymous", arguments)`


```js

// declarations

  let regex = /(.*function\s+(.\w+)\s*\(.*\s*{)\s*["']log["']/ig
  source.replace(regex, `$1\n\tconsole.log("$2", arguments)`)

 // anonymous/expressions

  let regex = /(.*function\s*\(.*\s*{)\s*["']log["']/ig
  source.replace(regex, `$1\n\tconsole.log("anonymous", arguments)`)

  // es6

  let regex = /(.*=>\s*{)\s*["']log["']/ig
  source.replace(regex, `$1\n\tconsole.log("anonymous", arguments)`)

  // else

  let regex = /["']log["']/ig
  source.replace(regex, "")


```
> I can run many of these in sequence, as long as I clean up the "log" if there's a match.


*dont match commented-out "log"*

I guess this can't actually happen if I asset that `log` has to follow `(*)*{*("|')`

*don't break sourcemaps, make cacheable*

```js
  // module.exports = function(content) {
  //  this.callback(null, someSyncOperation(content), sourceMaps, ast);
  //  return; // always return undefined when calling callback()
  // }

  module.exports = function simpleLoggingLoader(source, inputSourceMap) {
    if (this.cacheable) this.cacheable()
    var { result, map } = businessLogic(this, source, inputSourceMap)
    this.callback(null, result, map)
    return
  }
```
