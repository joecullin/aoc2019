const sequenceGenerator = ({ start, length }) => {
  const validPhases = Array.from({ length }, (_, i) => i + start);

  // Following https://en.wikipedia.org/wiki/Heap's_algorithm
  let all = [];
  const permutationGenerator = ({ k, A }) => {
    if (!k) {
      k = A.length;
    }
    if (k === 1) {
      all.push([...A]);
    } else {
      permutationGenerator({ k: k - 1, A });
      const swap = ([a, b]) => {
        const temp = A[a];
        A[a] = A[b];
        A[b] = temp;
      };
      for (let i = 0; i < k - 1; i++) {
        const positions = k % 2 === 0 ? [i, k - 1] : [0, k - 1];
        swap(positions);
        permutationGenerator({ k: k - 1, A });
      }
    }
  };
  permutationGenerator({ A: validPhases });
  return all;
};

module.exports = sequenceGenerator;
