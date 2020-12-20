/***************************************
 ********** QUIZ CONTROLLER ************
 **************************************/
var quizController = (function () {
  /**Question Constructor */
  function Question(id, questionText, options, correctAnswer) {
    this.id = id;
    this.questionText = questionText;
    this.options = options;
    this.correctAnswer = correctAnswer;
  }

  var questionLocalStorage = {
    setQuestionCollection: function (newCollection) {
      localStorage.setItem('questionCollection', JSON.stringify(newCollection));
    },
    getQuestionCollection: function () {
      return JSON.parse(localStorage.getItem('questionCollection'));
    },
    removeQuestionCollection: function () {
      localStorage.removeItem('questionCollection');
    },
  };

  if (questionLocalStorage.getQuestionCollection() === null) {
    questionLocalStorage.setQuestionCollection([]);
  }

  var quizProgress = {
    questionIndex: 0
  }

  /********Person Contructor*********/
  function Person(id, firstName, lastName, score) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.score = score;
  }

  var currentPersonData = {
    fullName: [],
    score: 0
  }

  var adminFullName = ['John', 'Smith'];

  var personLocalStorage = {
    setPersonData: function(newPersonData) {      
      localStorage.setItem('personData', JSON.stringify(newPersonData));
    },
    getPersonData() {
      return JSON.parse(localStorage.getItem('personData'));
    },
    removePersonData: function() {
      localStorage.removeItem('personData');
    }
  }

  if(personLocalStorage.getPersonData() === null) {
    personLocalStorage.setPersonData([])
  }

  return {
    getQuizProgress: quizProgress,

    getQuestionLocalStorage: questionLocalStorage,

    getPersonLocalStorage: personLocalStorage,

    addQuestionOnLocalStorage: function (newQuestionText, opts) {
      var optionsArr = [],
        corrAns,
        questionId = 0,
        newQuestion,
        getStoredQuests;

      for (let op of opts) {
        if (op.value) {
          optionsArr.push(op.value);
        }
        if (op.previousElementSibling.checked && op.value) {
          corrAns = op.value;
        }
      }

      getStoredQuests = questionLocalStorage.getQuestionCollection();

      if (getStoredQuests?.length > 0) {
        questionId = getStoredQuests[getStoredQuests.length - 1].id + 1;
      } else {
        questionId = 0;
      }

      if (newQuestionText.value === '') {
        alert('Please provide a question text');
        return;
      }

      if (optionsArr.length < 2) {
        alert('Please provide at least two options');
        return;
      }

      if (!corrAns) {
        alert('Please choose a correct answer or fill the empty answer!');
        return;
      }

      newQuestion = new Question(
        questionId,
        newQuestionText.value,
        optionsArr,
        corrAns
      );

      //   getStoredQuests = lsCollection;
      getStoredQuests.push(newQuestion);
      questionLocalStorage.setQuestionCollection(getStoredQuests);

      newQuestionText.value = '';
      for (let op of opts) {
        op.value = '';
        op.previousElementSibling.checked = false;
      }
      return true;
      // console.log(questionLocalStorage.getQuestionCollection());
    },
    checkAnswer: function (answer) {
      if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === answer) {
        currentPersonData.score++;
        return true;
      } else {
        return false;
      }
    },
    isFinished: function() {
      return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
    },
    addPerson() {
      var newPerson, personId, personData;
      if(personLocalStorage.getPersonData().length > 0) {
        personId = personLocalStorage.getPersonData()[
          personLocalStorage.getPersonData().length - 1
        ].id + 1;
      } else {
        personId = 0;
      }
      newPerson = new Person(
        personId,
        currentPersonData.fullName[0],
        currentPersonData.fullName[1],
        currentPersonData.score
      );
      personData = personLocalStorage.getPersonData();
      personData.push(newPerson)
      personLocalStorage.setPersonData(personData);      
    },

    getCurrentPersonData: currentPersonData,

    getAdminFullName: adminFullName
  };
})();
