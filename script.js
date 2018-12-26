//Quiz Controller
var quizController = (function(){
    //Question Contructor
    function Question(id,questionText,options,correctAnswer){
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
    var questionLocalStorage = {
        setQuestionCollection: function(newCollection){
            localStorage.setItem("questionCollection", JSON.stringify(newCollection));
        },
        getQuestionCollection: function(){
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function(){
            localStorage.removeItem('questionCollection');
        }
    }
    if(questionLocalStorage.getQuestionCollection() === null){
        questionLocalStorage.setQuestionCollection([]);
    }
    var quizProgress = {
        questionIndex: 0
    }
    //Person Contructor
    function Person(id,firstname,lastname,score){
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.score = score;
    }
    var currentPersonData = {
        fullname : [],
        score: 0
    };
    var adminFullName = ['John', 'Smith'];

    var personLocalStorage = {
        setPersonData: function(newPersonData){
            localStorage.setItem('personData', JSON.stringify(newPersonData));

        },
        getPersonData: function(){
            return JSON.parse(localStorage.getItem('personData'));
        },
        removePersonData: function(){
            localStorage.removeItem('personData');
        }
    }
    if(personLocalStorage.getPersonData === null){
        personLocalStorage.setPersonData([]);
    }
    return {
        getQuizProgress: quizProgress,
        getQuestionLocalStorage: questionLocalStorage,
        addQuestionOnLocalStorage: function(newQuestionText, options){
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuestions, isChecked;
            if(questionLocalStorage.getQuestionCollection() === null){
                questionLocalStorage.setQuestionCollection([]);
            }
            optionsArr = [];
            isChecked = false;
            for(var i =0; i < options.length; i++){
                if(options[i].value !== ""){
                    optionsArr.push(options[i].value);
                }
                if(options[i].previousElementSibling.checked && options[i].value !== ""){
                    corrAns = options[i].value;
                    isChecked = true;
                }
            }
            //[{id: 0} {id: 1}]
            if(questionLocalStorage.getQuestionCollection().length > 0){
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            }else{
                questionId =0;
            }
            if(newQuestion.value !== ""){
                if(optionsArr.length > 1){
                    if(isChecked){
                        newQuestion = new Question(questionId, newQuestionText.value, optionsArr, corrAns);
                        getStoredQuestions = questionLocalStorage.getQuestionCollection();
                        getStoredQuestions.push(newQuestion);
                        questionLocalStorage.setQuestionCollection(getStoredQuestions);
                        newQuestionText.value = "";
                        for(var x = 0; x < options.length; x++){
                            options[x].value = "";
                            options[x].previousElementSibling.checked = false;
                        }
                        return true;
                    }else{
                        alert('You missed to check correct answer, or you checked answer without value');
                        return false;
                    }
                }else{
                    alert('You must insert at least 2 options');
                    return false;
                }
            }else{
                alert('Please insert Question');
                return false;
            }
        },
        checkAnswer: function(ans){
            if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer=== ans.textContent){
                currentPersonData.score++;
                return true;
            }else{
                return false;
            }
        },
        isFinished: function(){
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
        },
        addPerson: function(){
            var newPerson, personid, personData;
            if(personLocalStorage.getPersonData().length > 0){
                personid = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
            }else{
                personid = 0;
            }
            newPerson = new Person(personid, currentPersonData.fullname[0], currentPersonData.fullname[1], currentPersonData.score);
            personData = personLocalStorage.getPersonData();
            personData.push(newPerson);
            personLocalStorage.setPersonData(personData);
        },
        getCurrPersonData: currentPersonData,
        getAdminFullName: adminFullName,
        getPersonLocalStorage: personLocalStorage
    }
})();
//UI Controller
var UIController =(function(){
    var domItems = {
        //Admin Panel Elements
        adminPanelSection: document.querySelector('.admin-panel-container'),
        questionInsertBtn: document.getElementById('question-insert-btn'),
        newQuestionText: document.getElementById('new-question-text'),
        adminOptions: document.querySelectorAll('.admin-option'),
        adminOptionsContainer: document.querySelector('.admin-options-container'),
        insertedQuestionsWrapper: document.querySelector('.inserted-questions-wrapper'),
        questionUpdateBtn: document.getElementById('question-update-btn'),
        questionDeleteBtn: document.getElementById('question-delete-btn'),
        questsClearBtn: document.getElementById('questions-clear-btn'),
        resultsListWrapper: document.querySelector('.results-list-wrapper'),
        clearResultsBtn: document.getElementById('results-clear-btn'),
        //Quiz section
        quizSection: document.querySelector('.quiz-container'),
        askedQuestionText: document.getElementById('asked-question-text'),
        quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
        progressBar: document.querySelector('progress'),
        progressPar: document.getElementById('progress'),
        instantAnsContainer: document.querySelector('.instant-answer-container'),
        instantAnsText: document.getElementById('instant-answer-text'),
        instantAnsDiv: document.getElementById('instant-answer-wrapper'),
        emotionIcon: document.getElementById('emotion'),
        nextQuestBtn: document.getElementById('next-question-btn'),
        //Landing Page
        landingPageSection: document.querySelector('.landing-page-container'),
        startQuizBtn: document.getElementById('start-quiz-btn'),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),
        //Final Result
        finalScoreText: document.getElementById('final-score-text'),
        finalResultSection: document.querySelector('.final-result-container')
    };
    return {
        getDomItems: domItems,
        addInputsDynamically: function(){
            var addInput = function(){
                var inputHTML, z;
                z = document.querySelectorAll('.admin-option').length;
                inputHTML = `<div class="admin-option-wrapper"><input type="radio" class="admin-option-${z}" name="answer" value="${z}"><input type="text" class="admin-option admin-option-${z}" value=""></div>`;
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            }   
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },
        createQuestionList: function(getQuestions){
            var questHTML, numberingArr;
            domItems.insertedQuestionsWrapper.innerHTML = "";
            numberingArr = [];
            for(var i = 0; i < getQuestions.getQuestionCollection().length; i++){
                numberingArr.push(i + 1);
                questHTML = `<p><span>${numberingArr[i]}. ${getQuestions.getQuestionCollection[i].questionText}</span><button id="question-${getQuestions.getQuestionCollection[i].id}">Edit</button></p>`;
                domItems.insertedQuestionsWrapper.insertAdjacentHTML('afterbegin', questHTML);
            }
        },
        editQuestList: function(event,storageQuestionList, addInputsDynamically,updateQuestionListFn){
            var getid, getStorageQuestionList, foundItem, placeInArr, optionHTML;
            if('question-'.indexOf(event.target.id)){
                getid = parseInt(event.target.id.split('-')[1]);
                getStorageQuestionList = storageQuestionList.getQuestionCollection;
                for(var i = 0; i < getStorageQuestionList.length; i++){
                    if(getStorageQuestionList[i].id === getid){
                        foundItem = getStorageQuestionList[i];
                        placeInArr = i;
                    }
                }
                domItems.newQuestionText.value = foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML = '';
                optionHTML = '';
                for(var x = 0; x < foundItem.options.length; x++){
                    optionHTML += `<div class="admin-option-wrapper">
                    <input type="radio" class="admin-option-${x}" name="answer" value="${x}">
                    <input type="text" class="admin-option admin-option-${x}" value="${foundItem.options[x]}">
                </div>`;
                }
                domItems.adminOptionsContainer.innerHTML = optionHTML;
                domItems.questionUpdateBtn.style.visibility = 'visible';
                domItems.questionDeleteBtn.style.visibility = 'visible';
                domItems.questionInsertBtn.style.visibility = 'hidden';
                domItems.questsClearBtn.style.pointerEvents ='none';
                addInputsDynamically();
                var backDefaultView = function(){
                    var updatedOptions;
                    domItems.newQuestionText.value = '';
                    updatedOptions= document.querySelectorAll('.admin-option');
                    for(var i = 0; i < updatedOptions.length; i++){
                        updatedOptions[i].value = '';
                        updatedOptions[i].previousElementSibling.checked = false;
                    }
                    domItems.questionUpdateBtn.style.visibility = 'hidden';
                        domItems.questionDeleteBtn.style.visibility = 'hidden';
                        domItems.questionInsertBtn.style.visibility = 'visible';
                        domItems.questsClearBtn.style.pointerEvents ='';
                        updateQuestionListFn(storageQuestionList);
                }
                var updateQuestion = function(){
                    var newOptions,optionEls;
                    newOptions = [];
                    optionEls = document.querySelectorAll('.admin-option');
                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correctAnswer = '';
                    for(var i =0; i < optionEls.length;i++){
                        if(optionEls[i].value !== ''){
                            newOptions.push(optionEls[i].value);
                            if(optionEls[i].previousElementSibling.checked){
                                foundItem.correctAnswer = optionEls[i].value;
                            }

                        }
                    }
                    foundItem.options = newOptions;
                    if(foundItem.questionText !== ''){
                        if(foundItem.options.length > 1){
                            if(foundItem.correctAnswer !== ''){
                                getStorageQuestionList.splice(placeInArr, 1, foundItem);
                                storageQuestionList.setQuestionCollection(getStorageQuestionList);
                                backDefaultView();
                            }else{
                                alert('You missed to check correct answer, or you checked answer without value');
                            }
                            
                        }else{
                            alert('You must insert at least two options');
                        }
                    }else{
                        alert('Please insert Question');
                    }
                    
                }
                domItems.questionUpdateBtn.onclick = updateQuestion;
                var deleteQuestion = function(){
                    getStorageQuestionList.splice(placeInArr,1);
                    storageQuestionList.setQuestionCollection(getStorageQuestionList);
                    backDefaultView();
                }

                domItems.questionDeleteBtn.onclick = deleteQuestion;
            }
        },
        clearQuestionList: function(storageQuestionList){
            if(storageQuestionList.getQuestionCollection !== null){
                if(storageQuestionList.getQuestionCollection.length > 0){
                    var conf = confirm('Warning: You will lose entire question list');
                    if(conf){
                        storageQuestionList.removeQuestionCollection();
                        domItems.insertedQuestionsWrapper.innerHTML = '';
                    }
                }
            }
        },
        displayQuestion: function(storageQuestionList,progress){
            var newOptionHTML, characterArr;
            characterArr = ['A','B','C','D','E','F']
            if(storageQuestionList.getQuestionCollection.length > 0){
                domItems.askedQuestionText.textContent = storageQuestionList.getQuestionCollection()[progress.questionIndex].questionText;
                domItems.quizOptionsWrapper.innerHTML = '';
                for(var i = 0; i < storageQuestionList.getQuestionCollection()[progress.questionIndex].options.length; i++){
                    newOptionHTML = `<div class="choice-${i}"><span class="choice-${i}">${characterArr[i]}</span><p  class="choice-${i}">${storageQuestionList.getQuestionCollection()[progress.questionIndex].options[i]}</p></div>`;
                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
            }
        },
        displayProgress: function(storageQuestionList, progress){
            domItems.progressBar.max = storageQuestionList.getQuestionCollection().length;
            domItems.progressBar.value = progress.questionIndex + 1;
            domItems.progressPar.textContent = (progress.questionIndex + 1) + '/' + storageQuestionList.getQuestionCollection().length;
        },
        newDesign: function(ansResult, selectedAnswer){
            var twoOptions, index;
            index = 0;
            if(ansResult){
                index = 1;
            }
            twoOptions = {
                instAnswerText: ['This is a wrong answer', 'This is a correct answer'],
                instantAnswerClass: ['red','green'],
                emotionType: ['images/sad.png', 'images/happy.png'],
                optionsSpanBg: ['rgba(200, 0, 0, .7)','0, 250, 0, .2']
            };
            domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none;";
            domItems.instantAnsContainer.style.opacity = "1";
            domItems.instantAnsText.textContent = twoOptions.instantAnsText[index];
            domItems.instantAnsDiv.className = twoOptions.instantAnswerClass[index];
            domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]);
            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionsSpanBg[index];
        },
        resetDesign: function(){
            domItems.quizOptionsWrapper.style.cssText = "";
            domItems.instantAnsContainer.style.opacity = "0";
        },
        getFullName: function(currPerson, storageQuestList, admin){
            if(domItems.firstNameInput.value !== '' && domItems.lastNameInput.value !== ''){
                if(!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])){
                    if(storageQuestList.getQuestionCollection.length > 0){
                        currPerson.fullname.push(domItems.firstNameInput.value);
                        currPerson.fullname.push(domItems.lastNameInput.value);
                        domItems.landingPageSection.style.display = 'none';
                        domItems.quizSection.style.display = 'block';
                    }else{
                        alert('Quiz is not ready, please contact administrator');
                    }
                }else{
                    domItems.landingPageSection.style.display = 'none';
                    domItems.adminPanelSection.style.display = 'block';
                }
            }else{
                alert('Please, enter your first name and last name');
            }
            
        },
        finalResult: function(currPerson){
            domItems.finalScoreText.textContent = currPerson.fullname[0] + ' ' + currPerson.fullname[1] + ', your final score is ' +
            currPerson.score;
            domItems.quizSection.style.display = 'none';
            domItems.finalResultSection.style.display = 'block';
        },
        addResultOnPanel: function(userData){
            var resultHTML;
            domItems.resultsListWrapper.innerHTML ='';
            for(var i =0; i < userData.getPersonData().length; i++){
                resultHTML = `<p class="person person-${i}"><span class="person-${i}">${userData.getPersonData()[i].firstname} ${userData.getPersonData()[i].lastname} - ${userData.getPersonData()[i].score} Points</span><button id="delete-result-btn_${userData.getPersonData()[i].id}" class="delete-result-btn">Delete</button></p>`;
                domItems.resultsListWrapper.insertAdjacentHTML('afterbegin', resultHTML);
            }
        },
        deleteResult: function(event, userData){
            var getId, personsArr;
            personsArr = userData.getPersonData();
            if('delete-result-btn_'.indexOf(event.target.id)){
                getId = parseInt(event.target.id.split('_')[1]);
                for(var i =0; i < personsArr.length; i++){
                    if(personsArr[i].id === getId){
                        personsArr.splice(i, 1);
                        userData.setPersonData(personsArr);
                    }
                }
            }
        },
        clearResultList: function(userData){
            var conf;
            if(userData.getPersonData() !== null){
                if(userData.getPersonData().length > 0){
                    conf = confirm('Warning: You will lose entire result list');
                    if(conf){
                        userData.removePersonData();
                        domItems.resultsListWrapper.innerHTML = '';
                    }
                }
            }
        }
    }
})();
// Controller
var controller = (function(quizCtrl, UICtrl){
    var selectedDomItems = UIController.getDomItems;
    UIController.addInputsDynamically();
    UIController.createQuestionList(quizCtrl.getQuestionLocalStorage);
    selectedDomItems.questionInsertBtn.addEventListener('click', function(){
        var adminOptions = document.querySelectorAll('.admin-option');
        var checkBoolean = quizController.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
        if(checkBoolean){
            UIController.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }
    });
    selectedDomItems.insertedQuestionsWrapper.addEventListener('click', function(e){
        UICtrl.editQuestList(e,quizController.getQuestionLocalStorage, addInputsDynamically, UICtrl.createQuestionList);
    });
    selectedDomItems.questsClearBtn.addEventListener('click', function(){
        UIController.clearQuestionList(quizController.getQuestionLocalStorage);
    });
    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    selectedDomItems.quizOptionsWrapper.addEventListener('click', function(e){
        var updateOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');
        for(var i = 0; i < updateOptionsDiv.length; i++){
            if(e.target.className === 'choice-'+ i){
                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
                var answerResult = quizCtrl.checkAnswer(answer);
                UICtrl.newDesign(answerResult, answer);
                if(quizCtrl.isFinished()){
                    selectedDomItems.nextQuestBtn.textContent = 'Finish';
                }
                var nextQuestion = function(questData, progress){
                    if(quizCtrl.isFinished){
                        //Finish Quiz
                        quizCtrl.addPerson();
                        UICtrl.finalResult(quizCtrl.getCurrPersonData);
                    }else{
                        UICtrl.resetDesign();
                        quizCtrl.getQuizProgress.questionIndex++;
                        UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                    }
                }
                selectedDomItems.nextQuestBtn.onclick = function(){
                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                }
            }
        }
    });
    selectedDomItems.startQuizBtn.addEventListener('click', function(){
        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
    });
    selectedDomItems.lastNameInput.addEventListener('focus', function(){
        selectedDomItems.lastNameInput.addEventListener('keypress', function(e){
            if(e.keyCode === 13){
                UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
            }
        }); 
    });
    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    selectedDomItems.resultsListWrapper.addEventListener('click', function(e){
        UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
        UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    });
    selectedDomItems.clearResultsBtn.addEventListener('click', function(){
        UICtrl.clearResultList(quizCtrl.getPersonLocalStorage);
    });
})(quizController,UIController);