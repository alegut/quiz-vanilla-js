/***************************************
 ********** UI CONTROLLER ************
 **************************************/
var UIController = (function () {
  var domItems = {
    /***********Admin Panel Elements*******/
    questInsertBtn: document.getElementById('question-insert-btn'),
    questUpdateBtn: document.getElementById('question-update-btn'),
    questDeleteBtn: document.getElementById('question-delete-btn'),
    questClearBtn: document.getElementById('questions-clear-btn'),
    clearResultsBtn: document.getElementById('results-clear-btn'),
    nextQuestionBtn: document.getElementById('next-question-btn'),
    adminPannelSection: document.querySelector('.admin-panel-container'),
    newQuestionText: document.getElementById('new-question-text'),
    adminOptions: document.querySelectorAll('.admin-option'),
    adminOptionsContainer: document.querySelector('.admin-options-container'),
    insertedQuestionsWrapper: document.querySelector(
      '.inserted-questions-wrapper'
    ),
    resultsListWrapper: document.querySelector('.results-list-wrapper'),
    /********Quiz Section****** */
    quizSection: document.querySelector('.quiz-container'),
    askedQuestionText: document.getElementById('asked-question-text'),
    quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
    progressBar: document.querySelector('progress'),
    progressPar: document.getElementById('progress'),
    instAnsContainer: document.querySelector('.instant-answer-container'),
    instAnsText: document.getElementById('instant-answer-text'),
    instAnsDiv: document.getElementById('instant-answer-wrapper'),
    emotionIcon: document.getElementById('emotion'),
    /************Landing Page Elements*********/
    landingPageSection: document.querySelector('.landing-page-container'),
    startQuizBtn: document.getElementById('start-quiz-btn'),
    firstNameInput: document.getElementById('firstname'),
    lastNameInput: document.getElementById('lastname'),
    /***********Final Result Elements**********/
    finalScoreText: document.getElementById('final-score-text'),
    finalScoreContainer: document.querySelector('.final-result-container'),
  };

  return {
    getDomItems: domItems,

    addInputsDynamically: function () {
      var addInput = function () {
        var index = document.querySelectorAll('.admin-option').length;

        var inputHTML = `<div class="admin-option-wrapper">
                  <input type="radio" class="admin-option-${index}" name="answer" value="${index}">
                  <input type="text" class="admin-option admin-option-${index}" value="">
              </div>`;

        domItems.adminOptionsContainer.insertAdjacentHTML(
          'beforeend',
          inputHTML
        );

        domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener(
          'focus',
          addInput
        );

        domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
          'focus',
          addInput
        );
      };

      domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
        'focus',
        addInput
      );
    },

    createQuestionList: function (getQuestions) {
      var questionHTML;

      domItems.insertedQuestionsWrapper.innerHTML = '';
      for (let [i, q] of getQuestions.getQuestionCollection().entries()) {
        questionHTML = `<p><span>${i + 1}. ${
          q.questionText
        }</span><button id="question-${q.id}">Edit</button></p>`;
        domItems.insertedQuestionsWrapper.insertAdjacentHTML(
          'afterBegin',
          questionHTML
        );
      }
    },
    editQuestionList: (
      event,
      storageQuestionList,
      addInpsDynfn,
      updateQuestListFn
    ) => {
      var getId,
        getEditedQuestion,
        optionHTML = '';
      getStorageQuestionList = storageQuestionList.getQuestionCollection();
      if (event.target.id) {
        getId = +event.target.id.split('-')[1];
        getEditedQuestion = getStorageQuestionList.find(
          (el) => el.id === getId
        );

        domItems.newQuestionText.value = getEditedQuestion.questionText;
        domItems.adminOptionsContainer.innerHTML = '';
        for (let [i, op] of getEditedQuestion.options.entries()) {
          optionHTML += `<div class="admin-option-wrapper">
                <input type="radio" class="admin-option-${i}" name="answer" value="${i}">
                <input type="text" class="admin-option admin-option-${i}" value="${op}">
                </div>`;
          console.log(optionHTML);
        }
        domItems.adminOptionsContainer.innerHTML = optionHTML;
        domItems.questUpdateBtn.style.visibility = 'visible';
        domItems.questDeleteBtn.style.visibility = 'visible';
        domItems.questInsertBtn.style.visibility = 'hidden';
        domItems.questClearBtn.style.pointerEvents = 'none';
        addInpsDynfn();

        var backDefaultView = function () {
          var updatedOptions = (optionElements = document.querySelectorAll(
            '.admin-option'
          ));
          domItems.newQuestionText.value = '';

          for (let op of updatedOptions) {
            console.log(op);
            op.value = '';
            op.previousElementSibling.checked = false;
          }
          domItems.questUpdateBtn.style.visibility = 'hidden';
          domItems.questDeleteBtn.style.visibility = 'hidden';
          domItems.questInsertBtn.style.visibility = 'visible';
          domItems.questClearBtn.style.pointerEvents = 'all';

          updateQuestListFn(storageQuestionList);
        };

        updateQuestion = () => {
          var newOptions = [],
            optionElements = document.querySelectorAll('.admin-option');
          getEditedQuestion.questionText = domItems.newQuestionText.value;
          getEditedQuestion.correctAnswer = '';
          for (let op of optionElements) {
            if (op.value) newOptions.push(op.value);
            if (op.previousElementSibling.checked) {
              getEditedQuestion.correctAnswer = op.value;
            }
          }
          getEditedQuestion.options = newOptions;

          if (getEditedQuestion.questionText === '') {
            alert('Please provide a question text');
            return;
          }

          if (newOptions.length < 2) {
            alert('Please provide at least two options');
            return;
          }

          if (!getEditedQuestion.correctAnswer) {
            alert('Please choose a correct answer or fill the empty answer!');
            return;
          }

          getStorageQuestionList.splice(getId, 1, getEditedQuestion);
          storageQuestionList.setQuestionCollection(getStorageQuestionList);

          backDefaultView();
        };

        domItems.questUpdateBtn.onclick = updateQuestion;

        var deleteQuestion = function () {
          const newArr = getStorageQuestionList.filter(
            (item) => item.id !== getId
          );
          storageQuestionList.setQuestionCollection(newArr);
          backDefaultView();
        };

        domItems.questDeleteBtn.onclick = deleteQuestion;
      }
    },
    clearQuestList: function (storageQuestList) {
      console.log(storageQuestList);
      if (storageQuestList?.getQuestionCollection().length > 0) {
        var conf = confirm("Warning! You'll lose entire question list!");
        if (conf) {
          storageQuestList.removeQuestionCollection();
          domItems.insertedQuestionsWrapper.innerHTML = '';
        }
      }
    },

    displayQuestion: function (storegeQuestList, progress) {
      console.log(progress);
      if (storegeQuestList?.getQuestionCollection().length > 0) {
        domItems.askedQuestionText.textContent = storegeQuestList.getQuestionCollection()[
          progress.questionIndex
        ].questionText;
        domItems.quizOptionsWrapper.innerHTML = '';
        var options = '';
        for (let [index, op] of storegeQuestList
          .getQuestionCollection()
          [progress.questionIndex].options.sort(() => Math.random() - 0.5).entries()) {
          options += `<div class="choice-${index}"><span class="choice-${index}">A</span><p  class="choice-${index}">${op}</p></div>`;
        }
        domItems.quizOptionsWrapper.insertAdjacentHTML('afterBegin', options);
      }
    },
    displayProgress: function (storegeQuestList, progress) {
      var current = progress.questionIndex + 1;
      var total = storegeQuestList.getQuestionCollection().length;
      domItems.progressBar.max = total;
      domItems.progressBar.value = current;
      domItems.progressPar.textContent = current + '/' + total;
    },

    newDesign: function (ansResult, selectedAnswer) {
      var twoOptions = {
        instAnswerText: ['This is a wrong answer', 'This is a correct answer'],
        instantAnsClass: ['red', 'green'],
        emotionType: ['images/sad.png', 'images/happy.png'],
        optionsSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 200, 0, .7)'],
      };
      domItems.quizOptionsWrapper.style.cssText =
        'opacity: 0.6; pointer-events: none';
      domItems.instAnsContainer.style.opacity = '1';
      domItems.instAnsText.textContent = twoOptions.instAnswerText[+ansResult];
      domItems.instAnsDiv.className = twoOptions.instantAnsClass[+ansResult];
      domItems.emotionIcon.setAttribute(
        'src',
        twoOptions.emotionType[+ansResult]
      );
      selectedAnswer.previousElementSibling.style.backgroundColor =
        twoOptions.optionsSpanBg[+ansResult];
    },
    resetDesign: function () {
      domItems.quizOptionsWrapper.style.cssText = '';
      domItems.instAnsContainer.style.opacity = '0';
    },
    getFullName: function (currPerson, storageQuestList, admin) {
      if (
        domItems.firstNameInput.value == '' ||
        domItems.lastNameInput.value == ''
      ) {
        alert('Please, enter your first and last name');
        return;
      }
      if (
        !(
          domItems.firstNameInput.value === admin[0] &&
          domItems.lastNameInput.value === admin[1]
        )
      ) {

        if (storageQuestList.getQuestionCollection().length <= 0) {
          alert('Quiz in not ready, please contact to admin');
          return;
        }

        currPerson.fullName.push(domItems.firstNameInput.value);
        currPerson.fullName.push(domItems.lastNameInput.value);
        console.log(currPerson);

        domItems.landingPageSection.style.display = 'none';
        domItems.quizSection.style.display = 'block';
      } else {
        domItems.landingPageSection.style.display = 'none';
        domItems.adminPannelSection.style.display = 'block';
      }
    },
    finalResult: function(currPerson) {
      domItems.finalScoreText.textContent =
        currPerson.fullName[0] + ' ' + currPerson.fullName[1] + ', your final score is ' + currPerson.score;
         domItems.quizSection.style.display = 'none';
         domItems.finalScoreContainer.style.display = 'block';
    },
    addResultOnPannel: function(userData) {
      console.log(userData.getPersonData());
      domItems.resultsListWrapper.innerHTML = '';
      var personsList = '';
      for (let [index, person] of userData.getPersonData().entries()) {
        console.log(person);
        personsList += `<p class="person person-${person.id}"><span class="person-${person.id}">${person.firstName} ${person.lastName} - ${person.score} Points</span><button id="delete-result-btn_${person.id}" class="delete-result-btn">Delete</button></p>`;
      }
      domItems.resultsListWrapper.insertAdjacentHTML('afterBegin', personsList);
    },
    deleteResult: function(event, userData) {
      var getId, personsArr;

      personsArr = userData.getPersonData();
      
      if('delete-result-btn_'.indexOf(event.target.id)) {
        getId = parseInt(event.target.id.split('_')[1]);
        console.log(getId); 

      }

      for (let [index, person] of personsArr.entries()) {
        console.log(index, person);
        if (person.id === getId) {
          personsArr.splice(index, 1);
          userData.setPersonData(personsArr);
        }
      }
      console.log(personsArr);
    },
    clearResults: function(personLs) {
      console.log(personLs);
      if(confirm('Are you sure, you want to delete all results?')) {
        personLs.removePersonData();
        domItems.resultsListWrapper.innerHTML = '';
      }      
    }
  };
})();
