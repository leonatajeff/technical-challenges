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
  let state: string = 'BEFORE_BRACKET';
  /*
  State Machine:
    BEFORE_BRACKET              
    BEFORE_KEY      IN_KEY      AFTER_KEY
    BEFORE_VALUE    IN_VALUE    AFTER_VALUE
    BEFORE_COMMA                AFTER_COMMA
  After a closed value, there must be a bracket closing it or a comma if it is before a key.
  */

  input = input.trim(); // guarantees '{...}'

  let startIndex: string = input.charAt(0);
  let endIndex: string = input.charAt(input.length-1);

  if (input === 'INVALID') return 'INVALID';

  if (startIndex !== '{' && endIndex !== '}') return 'INVALID';


  let i: number = 0;
  let key: string = '';
  let value: string | object = '';

  while (i < input.length) {
    let val: string = input.charAt(i);

    switch (state) {
      case 'BEFORE_BRACKET': // 1
        if (val === '{') {
          state = 'BEFORE_KEY';
        }
        break;
      case 'BEFORE_KEY': // 2
        if (val === ' ') {
          //input = input.slice(0, i) + input.slice(i + 1);
        } else if (val === '"') {
          state = 'IN_KEY';
        }
        break;
      case 'BEFORE_VALUE': // 3
        if (val === ' ') {
          //input = input.slice(0, i) + input.slice(i + 1);
        } else if (val === '"') { // value is a string
          state = 'IN_VALUE';
        } else if (val === '{') { // value is an object
          state = 'IN_VALUE';
          const closingBracketLocation: number = findClosingBracketIndex(input.slice(i));
          if (closingBracketLocation === -1) return 'INVALID';

          value = gson(input.slice(i, closingBracketLocation+1)); // find the closing bracket.
          state = 'AFTER_VALUE';
        } 
        break;

      case 'IN_KEY': // 4
        if (val === '"') {
          state = 'AFTER_KEY';
        } else {
          key = key.concat(val);
        }
        break;
      case 'IN_VALUE': // 5
        if (val === '"') {
          // add key pair:
          console.log(`The key is ${key}, value is ${value}`);
          if (map[key]) {
            return 'INVALID';
          }

          map[key] = value;
          console.log(`The map is ${JSON.stringify(map)}`);

          key = '';
          value = '';
          state = 'AFTER_VALUE';

        } else {
          value += val;
        }
        break;
      case 'AFTER_KEY': // 6
        if (val === ' ') {
          //input = input.slice(0, i) + input.slice(i + 1);
        } else if (val === ':') {
          state = 'BEFORE_VALUE';
        } else {
          return 'INVALID';
        }
        break;
      case 'AFTER_VALUE': // 7
        console.log(`The current character is ${val}`);
        if (val === ' ') {
          //input = input.slice(0, i) + input.slice(i + 1);
        } else if (val === ',') {
          state = 'BEFORE_COMMA'; // Key has to come after comma
          console.log(`COMMA DETECTED: current character is ${i} with ${val}`);
          
        } else if (val === '}') {
          return map;
        }
        break;
      case 'BEFORE_COMMA': // 8
      console.log(`current character is ${i} with ${val}`);
        if (val === ' ') {
          console.log(`white space`);

          //input = input.slice(0, i) + input.slice(i + 1);
        } else if (val === '"') {
          console.log(`entering a key`);
          i--; // we encountered a key so we will step back and set it to before key
          state = 'BEFORE_KEY';
        } else {
          return 'INVALID';
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
  let index: number = 0;
  let bracketCount: number = 1;

  while (index < s.length || bracketCount > 0) {
    let c = s.charAt(index);
    if (c === '{') {
      bracketCount++;
    } else if (c === '}') {
      bracketCount--;
    }

    index++;
  }

  if (bracketCount > 0) {
    index = -1;
  }

  return index;
}

const jsonString1 = '{"name": "John", "age": "30"}';
console.log("the first test: " + JSON.stringify(gson(jsonString1))); // Should log: { name: 'John', age: '30' }

const jsonString2 = '{"name": "John", "details": {"age": "30", "city": "New York"}}';
console.log("the second test: " + JSON.stringify(gson(jsonString2))); // Should log: { name: 'John', details: { age: '30', city: 'New York' } }
