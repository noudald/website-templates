const question = document.getElementById('question');
const answer = document.answerForm.answer;

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

    chart.data.datasets[1].data = calibration;
    chart.update();

    currentQuestionIndex++;
    question.innerHTML = questionsRand[currentQuestionIndex][0];
  });
}
