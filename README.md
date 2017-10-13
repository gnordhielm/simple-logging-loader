
# simple-logging-loader

This loader looks for the string literal `"log"` after the opening bracket of a function and replaces it with `console.log(<function name>, arguments)`.