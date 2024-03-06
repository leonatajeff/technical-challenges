// The task is to implement a simpler version of gson/jackson (specifically parsing)
// JSON parsing.
// We'll start with a simplified version of JSON:
// strings, numbers, booleans, objects, and arrays
// to start: let's just do strings and objects
// after that let's extend to arrays
// As you're parsing, we want to not allow invalid json
// As another simplification: you always will get an object in i.e. something starting with '{'
// examples that would expect to work:
// {"key meaningful"    :         "value", "key2":{"foo is a sentence": "bar"}} IS VALID
// {} is valid
// {"key1", "value"}
// {"key1": "value}
// {"key": "value", "key": "value2"} IS INVALID
// {"key": "value", "key": "value2", } IS INVALID

// input is a string
// output is a JSON-like DS