const input = [3, "a", 1, "b", 1, 1, 1, "a", "a", "a", "a", "a"];

function mostFrequentItem(items) {
  let freqMap = new Map();
  let maxCount = 0;

  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    const count = (freqMap.get(item) || 0) + 1;
    freqMap.set(item, count);

    const numOfCurrItem = freqMap.get(item);
    if (count > maxCount) {
      maxCount = count;
      mostFreqItem = item;
    }
  }

  return mostFreqItem;
}

console.log(mostFrequentItem(input));
