/**
 * Trivia Game Object
 * Ronny Tomasetti
 * 2016 UCF Coding Bootcamp
 */

function TriviaGame()
{
  this.questionsBank = [];
  this.currentQuestion = 0;
  this.correctAnswers = 0;
  this.incorrectAnswers = 0;
  this.unanswered = 0;
  this.timeAllowed = 10;
  this.timeRemaining = 0;

  this.getCorrectAnswers = function()
  {
    return this.correctAnswers;
  }

  this.getIncorrectAnswers = function()
  {
    return this.incorrectAnswers;
  }

  this.getUnanswered = function()
  {
    return this.unanswered;
  }

  this.setTimeAllowed = function(value)
  {
    this.timeAllowed = value;
  }

  /**
  *  Retrieve json object containing trivia questions
  *  Save data retrieved in trivia.questionsBank[] array.
  *
  *  @param ()
  *  @return undefined
  *
  */
  this.retrieveQuestions = function()
  {
    var self = this;
    $.getJSON( 'assets/js/questions.json', function( data )
    { 
      self.questionsBank = $( data.questions );
    });
  }

  /**
  *  Reset time remaining variable to match time allowed
  *
  *  @param ()
  *  @return undefined
  *
  */
  this.resetTimeRemaining = function()
  {
    this.timeRemaining = this.timeAllowed;
  }

  /**
  *  Reset trivia game counter variables for new round
  *
  *  @param ()
  *  @return undefined
  *
  */
  this.newRound = function()
  {
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.unanswered = 0;
    this.resetTimeRemaining();
  }
  
}
