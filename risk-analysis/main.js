const question = document.getElementById('question');
const answer = document.answerForm.answer;


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
