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

function gson(input: string): object | string {
  let map: { [key: string]: object | string } = {};
  let state: string = "BEFORE_BRACKET";
  /*
  State Machine:
    BEFORE_BRACKET              
    BEFORE_KEY      IN_KEY      AFTER_KEY
    BEFORE_VALUE    IN_VALUE    AFTER_VALUE
    BEFORE_COMMA                
  After a closed value, there must be a bracket closing it or a comma if it is before a key.
  */

  input = input.trim(); // guarantees '{...}'

  let startIndex: string = input.charAt(0);
  let endIndex: string = input.charAt(input.length - 1);

  if (input === "INVALID") return "INVALID";

  if (startIndex !== "{" && endIndex !== "}") return "INVALID";

  let i: number = 0;
  let key: string = "";
  let value: string | object = "";

  while (i < input.length) {
    let val: string = input.charAt(i);

    switch (state) {
      case "BEFORE_BRACKET": // 1
        if (val === "{") {
          state = "BEFORE_KEY";
        }
        break;
      case "BEFORE_KEY": // 2
        if (val === " ") {
          //input = input.slice(0, i) + input.slice(i + 1);
        } else if (val === '"') {
          state = "IN_KEY";
        }
        break;
      case "BEFORE_VALUE": // 3
        if (val === " ") {
          //input = input.slice(0, i) + input.slice(i + 1);
        } else if (val === '"') {
          // value is a string
          state = "IN_VALUE";
        } else if (val === "{") {
          // value is an object
          state = "IN_VALUE";
          const closingBracketLocation: number =
            i + findClosingBracketIndex(input.slice(i));

          if (closingBracketLocation === -1) return "INVALID";

          value = gson(input.slice(i, closingBracketLocation + 1)); // find the closing bracket.

          // add key pair:
          if (map[key] || value === "INVALID") {
            return "INVALID";
          }

          map[key] = value;

          key = "";
          value = "";

          state = "AFTER_VALUE";

          i = closingBracketLocation;
        }
        break;

      case "IN_KEY": // 4
        if (val === '"') {
          state = "AFTER_KEY";
        } else {
          key = key.concat(val);
        }
        break;
      case "IN_VALUE": // 5
        if (val === '"') {
          // add key pair:
          if (map[key]) {
            return "INVALID";
          }

          map[key] = value;

          key = "";
          value = "";
          state = "AFTER_VALUE";
        } else if (val === ",") {
          return "INVALID";
        } else {
          value += val;
        }
        break;
      case "AFTER_KEY": // 6
        if (val === " ") {
          //input = input.slice(0, i) + input.slice(i + 1);
        } else if (val === ":") {
          state = "BEFORE_VALUE";
        } else {
          return "INVALID";
        }
        break;
      case "AFTER_VALUE": // 7
        if (val === " ") {
          //input = input.slice(0, i) + input.slice(i + 1);
        } else if (val === ",") {
          state = "BEFORE_COMMA"; // Key has to come after comma
        } else if (val === "}") {
          return map;
        }
        break;
      case "BEFORE_COMMA": // 8
        if (val === " ") {
          //input = input.slice(0, i) + input.slice(i + 1);
        } else if (val === '"') {
          i--; // we encountered a key so we will step back and set it to before key
          state = "BEFORE_KEY";
        } else {
          return "INVALID";
        }
        break;
      default:
        break;
    }

    i++;
  }

  return map;
}

function findClosingBracketIndex(s: string): number {
  let index: number = 1;
  let bracketCount: number = 1;
  let result: number = 0;

  while (bracketCount > 0 && index < s.length) {
    let c = s.charAt(index);

    if (c === "{") {
      bracketCount++;
    } else if (c === "}") {
      bracketCount--;

      if (bracketCount === 0) result = index;
    }
    index++;
  }

  if (bracketCount > 0) {
    result = -1;
  }

  return result;
}

const jsonString1 = '{"name": "John", "age": "30"}';
console.log("the first test: " + JSON.stringify(gson(jsonString1))); // Should log: { name: 'John', age: '30' }

const jsonString2 =
  '{"name": "John", "details": {"age": "30", "city": "New York"}}';
console.log("the second test: " + JSON.stringify(gson(jsonString2))); // Should log: { name: 'John', details: { age: '30', city: 'New York' } }

const jsonString3 =
  '{"name": "John", "details": {"age": "30", "city": {"testval": "lmao", "tes": "lol"}}, "extra": "none"}';
console.log("the third test: " + JSON.stringify(gson(jsonString3))); // Should log: { name: 'John', details: { age: '30', city: 'New York' } }

// Missing value
const jsonString4 =
  '{"name": "John", "age": "30", "address": {"city": "New York", "zip"}}';
console.log(gson(jsonString4)); // Should return "INVALID"

// Duplicate keys
const jsonString5 = '{"name": "John", "age": "30", "name": "Doe"}';
console.log(gson(jsonString5)); // Should return "INVALID"

// Leading comma
const jsonString6 =
  '{"name": "John", "age": "30", , "address": {"city": "New York", "zip": "10001"}}';
console.log(gson(jsonString6)); // Should return "INVALID"

// Unclosed quotes
const jsonString7 =
  '{"name": "John, "age": "30", "address": {"city": "New York", "zip": "10001"}}';
console.log(gson(jsonString7)); // Should return "INVALID"
