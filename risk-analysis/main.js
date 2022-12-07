const question = document.getElementById('question');
const answer = document.answerForm.answer;

// Random with seed, see https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript.
function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;

  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }

  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);

  return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function sfc32(a, b, c, d) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;

    var t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;

    return (t >>> 0) / 4294967296;
  }
}

var seed = cyrb128('Risk Analysis');
Math.random = sfc32(seed[0], seed[1], seed[2], seed[3]);


function sampleWithReplacement(arr) {
  const sample = new Array(arr.length);


  for (var i = 0; i < arr.length; i++) {
    sample[i] = arr[Math.floor(Math.random() * arr.length)];
  }

  return sample;
}


function bootstrapResults(results, nsim=100) {
  const bsResults = [
    [], [], [], [], [], [], [], [], [], [], []
  ];

  for (var i = 0; i < nsim; i++) {
    const sample = sampleWithReplacement(results);

    for (var j = 0; j <= 10; j++) {
      const trueCount = sample.filter(e => (e[0] == j) && e[1]).length;
      const totalCount = sample.filter(e => (e[0] == j)).length;

      if (totalCount > 0) {
        bsResults[j].push(trueCount / totalCount);
      }
    }
  }

  const bsQ025 = new Array(11);
  const bsQ975 = new Array(11);
  const bsMedian = new Array(11);

  for (var j = 0; j <= 10; j++) {
    bsResults[j].sort();

    const n = bsResults[j].length;
    if (n == 0) {
      bsQ025[j] = j/10.0;
      bsQ975[j] = j/10.0;
      bsMedian[j] = j/10.0;
    } else {
      bsQ025[j] = bsResults[j][Math.floor(0.025 * n)];
      bsQ975[j] = bsResults[j][Math.floor(0.975 * n)];
      bsMedian[j] = bsResults[j][Math.floor(0.5 * n)];
    }
  }

  return [bsQ025, bsMedian, bsQ975];
}


function shuffleArray(arr) {
  // Fisher-Yates shuffle
  let curIndex = arr.length;
  let randIndex = 0;

  while (curIndex != 0) {
    randIndex = Math.floor(Math.random() * curIndex);
    curIndex--;

    [arr[curIndex], arr[randIndex]] = [arr[randIndex], arr[curIndex]];
  }

  return arr;
}

const questionsRand = shuffleArray(questions);

currentQuestionIndex = 0;
question.innerHTML = questionsRand[currentQuestionIndex][0];

var results = [];
for (var i = 0; i < answer.length; i++) {
  answer[i].addEventListener('change', function() {
    results.push([parseInt(this.value), questionsRand[currentQuestionIndex][1]]);
    this.checked = false;

    const calibration = [...Array(11).keys()].map(i =>  {
      const trueCount = results.filter(e => (e[0] == i) && e[1]).length;
      const totalCount = results.filter(e => (e[0] == i)).length;
      if (totalCount == 0) {
        return 0.0;
      } else {
        return trueCount / totalCount;
      }
    });

    const [bsQ025, bsMedian, bsQ975] = bootstrapResults(results);

    chart.data.datasets[1].data = bsMedian;
    chart.data.datasets[2].data = bsQ025;
    chart.data.datasets[3].data = bsQ975;
    chart.update();

    currentQuestionIndex++;
    question.innerHTML = questionsRand[currentQuestionIndex][0];
  });
}
