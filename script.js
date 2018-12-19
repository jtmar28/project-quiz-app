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
    return {
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
                    }else{
                        alert('You missed to check correct answer, or you checked answer without value');
                    }
                }else{
                    alert('You must insert at least 2 options');
                }
            }else{
                alert('Please insert Question');
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
        adminOptions: document.querySelectorAll('admin-option')
    };
    return {
        getDomItems: domItems
    }
})();
// Controller
var controller = (function(quizCtrl, UICtrl){
    var selectedDomItems = UIController.getDomItems;
    selectedDomItems.questionInsertBtn.addEventListener('click', function(){
        quizController.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, selectedDomItems.adminOptions);
    });
})(quizController,UIController);