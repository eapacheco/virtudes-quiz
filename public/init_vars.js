// State control constants
const START = 0
const INFO = 1
const QUIZ = 2
const RESULT = 3
const STATE_COUNT = 4

// Declaring categories
const EXCELENCIA_MORAL = 0
const CONHECIMENTO = 1
const DOMINIO_PROPRIO = 2
const PERSEVERANCA = 3
const DEVOCAO = 4
const FRATERNIDADE = 5
const AMOR = 6

// Question orders
const ASCENDING = 1
const DESCENDING = 2

// Score calculation constants
const MAX_GROUP_SCORE = 25
const MAX_QUESTION_SCORE = 5
const MIN_QUESTION_SCORE = 1

// Info constants
const INFO_DATA = [
    'Vamos te ajudar a compreender suas virtudes!',
    'O resultado no final, independe de tempo.',
    'Você pode fazer o teste quantaas vezes quiser.',
]

// Define variables
var currentState
var curQuestion
var scores
