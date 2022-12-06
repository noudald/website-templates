const question = document.getElementById('question');
const answer = document.answerForm.answer;


function sampleWithReplacement(arr) {
  const sample = new Array(arr.length);

  for (var i = 0; i < arr.length; i++) {
    sample[i] = arr[Math.floor(Math.random() * arr.length)];
  }

  return sample;
}


function bootstrapResults(results, nsim=10000) {
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

  console.log(bsResults);
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

    bootstrapResults(results);

    chart.data.datasets[1].data = calibration;
    chart.data.datasets[2].data = calibration;
    chart.data.datasets[3].data = calibration;
    chart.update();

    currentQuestionIndex++;
    question.innerHTML = questionsRand[currentQuestionIndex][0];
  });
}
