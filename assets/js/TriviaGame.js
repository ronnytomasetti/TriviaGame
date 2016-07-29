/**
 * Trivia Game Object
 * Ronny Tomasetti
 * 2016 UCF Coding Bootcamp
 */

function TriviaGame()
{
    this.questionsBank = [];
    this.currentQuestionsArray = [];
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.unanswered = 0;
    this.timeAllowed = 10;
    this.timeRemaining = 0;

    /**
     *  TODO: IMPLEMENT THIS SOMEWHERE IN MY LOGIC IF POSSIBLE.
     *  Sets the time allowed variable for question timer.
     *
     */
    this.setTimeAllowed = function( value )
    {
        this.timeAllowed = value;
    };

    /**
    *  Retrieve json object containing trivia questions
    *  Save data retrieved in trivia.questionsBank[] array.
    *
    */
    this.retrieveQuestions = function()
    {
        var self = this;

        $.getJSON( 'assets/js/questions.json', function( data )
        {
            self.questionsBank = data.questions;
        });
    };

    /**
    *  Reset time remaining variable to match time allowed
    *
    */
    this.resetTimeRemaining = function()
    {
        this.timeRemaining = this.timeAllowed;
    };

    /**
    *  Reset trivia game counter variables for new round
    *
    */
    this.newRound = function()
    {
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.unanswered = 0;
        this.resetTimeRemaining();
    };

    this.randomizeNewQuestions = function( numberOfQuestions )
    {
        // Randomize order of questions array received from json file.
        var randomizedArray = this.questionsBank.sort( function( a, b ) { return 0.5 - Math.random() } );

        // Initialize new array to store number of questions requested.
        var generatedArray = [];

        // Run push/pop loop for the total required duration.
        for ( var i = 0; i < numberOfQuestions; i++ )
        {
            generatedArray.push( randomizedArray.pop() );
        }

        // Store the newly generated array.
        this.currentQuestionsArray = generatedArray;
    }
  
}
