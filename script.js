/***************************************
 ********** CONTROLLER ************
 **************************************/

var controller = (function (quizCtrl, UICtrl) {
  var selectedItems = UICtrl.getDomItems;
  UICtrl.addInputsDynamically();
  var createList = () => UICtrl.createQuestionList(quizController.getQuestionLocalStorage);
  createList();
  selectedItems.questInsertBtn.addEventListener('click', function () {

    var adminOptions = document.querySelectorAll('.admin-option');

    var questionAddedToLS = quizCtrl.addQuestionOnLocalStorage(
      selectedItems.newQuestionText,
      adminOptions
    );
    if(questionAddedToLS) {      
      createList();
    }
  });

  selectedItems.insertedQuestionsWrapper.addEventListener('click', (e) => {
    UICtrl.editQuestionList(
      e,
      quizCtrl.getQuestionLocalStorage,
      UICtrl.addInputsDynamically,
      createList
    );
  })

  selectedItems.questClearBtn.addEventListener('click', (e) => {
    UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
  })

  UICtrl.displayQuestion(
    quizCtrl.getQuestionLocalStorage,
    quizCtrl.getQuizProgress
  );

  UICtrl.displayProgress(
    quizCtrl.getQuestionLocalStorage,
    quizCtrl.getQuizProgress
  );

  selectedItems.quizOptionsWrapper.addEventListener('click', function(e) {
    
    var updatedOptionsDiv = selectedItems.quizOptionsWrapper.querySelectorAll('div');
    
    for (let [i, op] of updatedOptionsDiv.entries()) {      
      if(e.target.className === 'choice-' + i) {
        var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
        var answerResult = quizCtrl.checkAnswer(answer.textContent);

        UICtrl.newDesign(answerResult, answer);

        if(quizCtrl.isFinished()) {
          selectedItems.nextQuestionBtn.textContent = 'Finish'
        }

        var nextQuestion = function(questData, progerss) {
          if(quizCtrl.isFinished()) {
            quizCtrl.addPerson()
            UICtrl.finalResult(quizCtrl.getCurrentPersonData);
          } else {
            UICtrl.resetDesign();
            quizCtrl.getQuizProgress.questionIndex++;
            UICtrl.displayQuestion(
              quizCtrl.getQuestionLocalStorage,
              quizCtrl.getQuizProgress
            );
            UICtrl.displayProgress(
              quizCtrl.getQuestionLocalStorage,
              quizCtrl.getQuizProgress
            );
          }
        }

        selectedItems.nextQuestionBtn.onclick = function() {
          nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
        }
      }
    }
  });

  selectedItems.startQuizBtn.addEventListener('click', function() {
    UICtrl.getFullName(quizCtrl.getCurrentPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
  })

  selectedItems.lastNameInput.addEventListener('focus', function() {
    selectedItems.lastNameInput.addEventListener('keypress', function(e) {
      if(e.keyCode === 13) {
        UICtrl.getFullName(
          quizCtrl.getCurrentPersonData,
          quizCtrl.getQuestionLocalStorage,
          quizCtrl.getAdminFullName
        );
      }
    })
  });

  UICtrl.addResultOnPannel(quizCtrl.getPersonLocalStorage);

  selectedItems.resultsListWrapper.addEventListener('click', function(e) {    
    UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
    UICtrl.addResultOnPannel(quizCtrl.getPersonLocalStorage);
  })

  selectedItems.clearResultsBtn.addEventListener('click', (e) => {
    UICtrl.clearResults(quizCtrl.getPersonLocalStorage);
  });
  

})(quizController, UIController);
