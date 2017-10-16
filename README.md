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




