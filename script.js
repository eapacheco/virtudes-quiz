// Define container
const startBox = document.getElementsByClassName('start').item(0)
const infoBox = document.getElementsByClassName('info').item(0)
const quizBox = document.getElementsByClassName('quiz').item(0)
const resultBox = document.getElementsByClassName('result').item(0)

// Define dynamically filled elements
const questionTitle = document.getElementsByClassName('quiz-title').item(0)
const questionCount = document.getElementsByClassName('quiz-count').item(0)
const questionTotal = document.getElementsByClassName('quiz-total').item(0)

// All option buttons
const optionButtons = htmlToArray(document.getElementsByClassName('quiz-btn-option'))

// All result table value cells
const resultValueCell = htmlToArray(document.getElementsByClassName('result-table--value'))
// Only the media cell
const resultMediaCell = document.getElementsByClassName('result-table--media').item(0)


/**
 * SEE: Constants and initial state variables were defined in init_vars.js
 */

init()

// Define initial state
function init() {
    // Reset flow control
    currentState = START
    curQuestion = 0
    scoreGroups = [
        [], // EXCELENCIA_MORAL
        [], // CONHECIMENTO
        [], // DOMINIO_PROPRIO
        [], // PERSEVERANCA
        [], // DEVOCAO
        [], // FRATERNIDADE
        [], // AMOR
    ]


    questions = shuffle(questions)
    displayStatePage()
}

// Hide / Show pages given the current state index
function displayStatePage() {
    startBox.style.display = currentState == START ? "flex" : "none"
    infoBox.style.display = currentState == INFO ? "flex" : "none"
    quizBox.style.display = currentState == QUIZ ? "flex" : "none"
    resultBox.style.display = currentState == RESULT ? "flex" : "none"

    // Write current question
    if (currentState == QUIZ) {
        questionTitle.innerHTML = `${curQuestion + 1}.&emsp;${questions[curQuestion].title}`
        questionCount.textContent = curQuestion + 1
        questionTotal.textContent = questions.length
    } else if (currentState == RESULT) {
        setUpMarkersList()
        setUpResultChart()
    }
}

// Go to next page
function nextState() {
    currentState++
    displayStatePage()
}

// Go to next page
function previousQuestion() {
    if (curQuestion == 0) {
        currentState--
        displayStatePage()
        return;
    }

    // Remove latest answer
    curQuestion--
    let { category } = questions[curQuestion]
    scoreGroups[category].pop()
    displayStatePage()
}

// Answer question
function answerQuestion(ele) {
    optionButtons.forEach((btn) => btn.disabled = true)
    ele.classList.add('clicked');

    const afterAnimation = () => {
        optionButtons.forEach((btn) => btn.disabled = false)

        let { category, order } = questions[curQuestion]
        value = parseInt(ele.value)

        if (order == ASCENDING) {
            // Natural value order: 1, 2, 3, 4, 5
            scoreGroups[category].push(value)
        } else {
            // Inverse value order: 5, 4, 3, 2, 1
            scoreGroups[category].push(MAX_QUESTION_SCORE + MIN_QUESTION_SCORE - value)
        }

        // End of questions
        if (curQuestion == questions.length - 1) {
            nextState()
            return;
        }

        curQuestion++
        displayStatePage()
    }

    // Wait for button transition
    window.setTimeout(function () {
        ele.classList.remove('clicked')

        window.setTimeout(function () {
            afterAnimation()
        }, ANIMATION_DELAY / 2);

    }, ANIMATION_DELAY / 2);
}

// Set markers list with results
function setUpMarkersList() {
    resultValueCell.forEach((cell, idx) => {
        cell.textContent = scaleToHundred(
            sum(scoreGroups[idx]),
            scoreGroups[idx].length * MAX_QUESTION_SCORE
        )
    })

    resultMediaCell.textContent = scaleToHundred(
        sum(scoreGroups, (value) => sum(value)),
        sum(scoreGroups, (value) => value.length) * MAX_QUESTION_SCORE)
}

// Set chart with results
function setUpResultChart() {
    new Chart("result_chart", {
        type: "line",
        data: {
            labels: CATEGORY_TITLES.map((str) => str.substring(0, 6)),
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(98, 71, 170, 1.0)",
                borderColor: "rgba(98, 71, 170, 0.1)",
                data: scoreGroups.map((group) => scaleToHundred(sum(group), group.length * MAX_QUESTION_SCORE))
            }]
        },
        options: {
            scales: {
                y: { min: 0, max: 100, }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'FÉ',
                    position: 'bottom',
                },
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        title: (tooltipItems) => {
                            return CATEGORY_TITLES[tooltipItems[0].dataIndex];
                        },
                        label: (context) => {
                            return context.parsed.y + " pontos";
                        }
                    }
                }
            }
        }
    });
}

// Utilitary functions
function scaleToHundred(partial, total) {
    ratio = (100 / total)

    return (partial * ratio).toFixed(0)
}

// Shuffle array
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5)
}

// Sum all values of the array
function sum(arr, mapCur = (cur) => cur) {
    return arr.reduce((acc, cur) => acc + mapCur(cur), 0)
}

// Copy html element from collection into array
function htmlToArray(htmlCollection) {
    var array = [];
    for (let i = 0; i < htmlCollection.length; i++) {
        array.push(htmlCollection[i]);
    }

    return array
}