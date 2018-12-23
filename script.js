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
    return {
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
        }
    }
})();
//UI Controller
var UIController =(function(){
    var domItems = {
        //Admin Panel Elements
        questionInsertBtn: document.getElementById('question-insert-btn'),
        newQuestionText: document.getElementById('new-question-text'),
        adminOptions: document.querySelectorAll('.admin-option'),
        adminOptionsContainer: document.querySelector('.admin-options-container'),
        insertedQuestionsWrapper: document.querySelector('.inserted-questions-wrapper'),
        questionUpdateBtn: document.getElementById('question-update-btn'),
        questionDeleteBtn: document.getElementById('question-delete-btn'),
        questsClearBtn: document.getElementById('questions-clear-btn')
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
})(quizController,UIController);