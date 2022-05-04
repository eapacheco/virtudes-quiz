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
const optionButtons = document.getElementsByClassName('quiz-btn-option')

// All result table value cells
const resultValueCell = document.getElementsByClassName('result-table--value')
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
    scores = [
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
    scores[category].pop()
    displayStatePage()
}

// Answer question
function answerQuestion(ele) {
    Array.prototype.forEach.call(optionButtons, (btn) => btn.disabled = true)
    ele.classList.add('clicked');

    // Wait for button transition
    window.setTimeout(function () {
        ele.classList.remove('clicked')
        Array.prototype.forEach.call(optionButtons, (btn) => btn.disabled = false)

        let { category, order } = questions[curQuestion]
        value = parseInt(ele.value)

        if (order == ASCENDING) {
            // Natural value order: 1, 2, 3, 4, 5
            scores[category].push(value)
        } else {
            // Inverse value order: 5, 4, 3, 2, 1
            scores[category].push(MAX_QUESTION_SCORE + MIN_QUESTION_SCORE - value)
        }

        // End of questions
        if (curQuestion == questions.length - 1) {
            nextState()
            return;
        }

        curQuestion++
        displayStatePage()
    }, 800);
}

// Set markers list with results
function setUpMarkersList() {
    total = scores.reduce((acc, cur) => acc + cur.reduce((acc, cur) => acc + cur, 0), 0)

    Array.prototype.forEach.call(resultValueCell, (cell, idx) => {
        cell.textContent = toPercentage(
            scores[idx].reduce((acc, cur) => acc + cur, 0),
            scores[idx].length * MAX_QUESTION_SCORE
        )
    })

    resultMediaCell.textContent = toPercentage(total, questions.length * MAX_QUESTION_SCORE)
}


// Utilitary functions
function toPercentage(partial, total, precision = 4) {
    percent = (partial / total)

    return (100 * percent).toPrecision(precision) + '%'
}

// Shuffle array
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5)
}