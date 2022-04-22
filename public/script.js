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
        0, // EXCELENCIA_MORAL
        0, // CONHECIMENTO
        0, // DOMINIO_PROPRIO
        0, // PERSEVERANCA
        0, // DEVOCAO
        0, // FRATERNIDADE
        0, // AMOR
    ]

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
        questionTitle.innerHTML = `${curQuestion + 1}.&emsp;${QUESTIONS[curQuestion].title}`
        questionCount.textContent = curQuestion + 1
        questionTotal.textContent = QUESTIONS.length
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

    curQuestion--
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

        let { category, order } = QUESTIONS[curQuestion]

        if (order == ASCENDING) {
            scores[category] += ele.value
        } else {
            scores[category] += MAX_QUESTION_SCORE + MIN_QUESTION_SCORE - ele.value
        }

        // End of questions
        if (curQuestion == QUESTIONS.length - 1) {
            nextState()
            return;
        }

        curQuestion++
        displayStatePage()
    }, 800);
}

// Set markers list with results
function setUpMarkersList() {
    total = Array.prototype.reduce.call(scores, (prev, cur) => prev + cur, 0)

    Array.prototype.forEach.call(resultValueCell, (cell, idx) => {
        cell.textContent = toPercentage(scores[idx], MAX_GROUP_SCORE)
    })

    resultMediaCell.textContent = toPercentage(total, QUESTIONS.length * MAX_QUESTION_SCORE)
}


// Utilitary functions
function toPercentage(partial, total, precision = 4) {
    percent = (partial / total)

    return (100 * percent).toPrecision(precision) + '%'
}