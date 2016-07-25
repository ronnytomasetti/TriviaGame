/**
 * Trivia Game Logic
 * Ronny Tomasetti
 * 2016 UCF Coding Bootcamp
 */

/* Declare new global TriviaGame object */
var game = {};
/* Trivia questions template stored in index.html */
var qTemplate;
/* Trivia answers template stored in index.html */
var aTemplate;
/* Declare global time interval variable */
var timer;

$( document ).ready( function()
{

  /**
   *  Starts a new game
   *
   *  Initializes global game objects.
   *  Calls function to retrieve json containing questions.
   *  Binds one click event listener to start button.
   *
   *  @param (button) start-button object clicked
   *  @return undefined
   */
   function startGame()
   {

    /* Initialize global game variables */
    game = new TriviaGame();

    qTemplate = $( '#question-template' ).html();
    aTemplate = $( '#answers-template' ).html();
    rTemplate = $( '#results-template' ).html();

    /* Start retrieving questions json */
    game.retrieveQuestions();

    /* Bind event listener to start button */
    $( 'button.start-button' ).one( 'click', startRound );

   }
   /* END startGame() ---------------------------- */

  /**
   *  Starts a new round
   *
   *  Hides start button.
   *  Call for new round.
   *  Ends with call to displayNextQuestion() function.
   *
   *  @param ()
   *  @return undefined
   *
   */
   function startRound()
   {

    /* Hide start button */
    $( 'button.start-button' ).addClass( 'hide' );

    /* Initiate new round */
    game.newRound();

    displayQuestion();

   }
   /* END startRound() ---------------------------- */

  /**
   *  Displays the next question
   *
   *  Clone template in order to create question.
   *  Adds current question and choices to new question template.
   *  Appends new question to trivia-cards div.
   *  Starts timer.
   *
   *  @param ()
   *  @return undefined
   *
   */
   function displayQuestion()
   {

    /* Store copy of question template */
    var questionTemplate = $( qTemplate ).clone();

    /* Grab question string and choices array from trivia game object */
    var question = game.questionsBank[ game.currentQuestion ].question;
    var choices = game.questionsBank[ game.currentQuestion ].choices;

    /* Set up html for current question */
    $( questionTemplate ).find( '#question' )
                         .html( question );

    /* Loop through choices array in order to set up html and click listeners */
    $.each( choices, function( index, value )
    {

      $( questionTemplate ).find( '#' + index )
                           .html( value )
                           .click( checkAnswer );

    });
    /* END .each() loop */

    $( '#trivia-cards' ).children().remove();

    /* Add question to div with id trivia-cards */
    $( '#trivia-cards' ).append( questionTemplate );

    /* Time starts now!! */
    startTimer();

   }
   /* END displayQuestion() ---------------------------- */

  /**
   *  Checks answer after every question
   *
   *  Clear previous questions timer.
   *  Unbinds click event from choices.
   *  Compare user's answer with correct answer.
   *
   *  @param (object) element clicked
   *  @return undefined
   *
   */
   function checkAnswer()
   {

    clearTimer();

    /* NOTE: THIS IS PROBABLY USELESS SINCE LATER ON IN THE CODE 
              I'M REMOVING ALL CHILDREN FROM TRIVIA CARD DIV!!! */
    $( '#trivia-cards' ).children()
                        .unbind( 'click', checkAnswer );

    var userChoice = $( this ).attr( 'id' );
    var correctAnswer = game.questionsBank[ game.currentQuestion ].answer;

    console.log("THIS IN CHECKANSWER(): " + $( this ).attr( 'id' ) );

    if ( userChoice == correctAnswer ) /* Player answered correctly */
    {
      game.correctAnswers++;
      displayAnswer( true );
    }
    else if ( userChoice != correctAnswer && userChoice <= 3 ) /* Player answered in time but was incorrect */
    {
      game.incorrectAnswers++;
      displayAnswer( false );
    }
    else /* Player did not answer question in time */
    {
      game.unanswered++;
      displayAnswer( false );
    }

   }
   /* END checkAnswer() ---------------------------- */

  /**
   *  Displays the answer to previous question
   *
   *  If more questions are available, shows next question.
   *  Else, show final results of trivia round.
   *
   *  @param (bool) true, if user answered question correctly
   *  @return undefined
   *
   */
   function displayAnswer( isCorrect )
   {
    /* Store copy of answer template */
    var answerTemplate = $( aTemplate ).clone();

    var answer = game.questionsBank[ game.currentQuestion ].answer;
    var answerString = game.questionsBank[ game.currentQuestion ].choices[ answer ];

    $( answerTemplate ).find( '#result' )
                       .text( ( isCorrect ? "CORRECT!" : "WRONG!" ) );

    $( answerTemplate ).find( '#correct-answer' )
                       .text( answerString );

    $( '#trivia-cards' ).children().remove();
    $( '#trivia-cards' ).append( answerTemplate );

    game.currentQuestion++;

    if ( game.currentQuestion == game.questionsBank.length )
      setTimeout( endRound, 3000 );
    else
      setTimeout( displayQuestion, 3000 );
   }
   /* END displayAnswer() ---------------------------- */

  /**
   *  Ends the current trivia round
   *
   *  Print results of previous trivia round
   *  Displays new round button to restart
   *
   *  @param ()
   *  @return undefined
   *
   */
   function endRound()
   {

    var resultsTemplate = $( rTemplate ).clone();

    $( resultsTemplate ).find( '#correct' )
                        .text( game.correctAnswers );
    $( resultsTemplate ).find( '#incorrect' )
                        .text( game.incorrectAnswers );
    $( resultsTemplate ).find( '#unanswered' )
                        .text( game.unanswered );

    $( '#trivia-cards' ).children().remove();

    $( '#trivia-cards' ).append( resultsTemplate );

    $( 'button.start-button' ).text( 'Restart Trivia' )
                              .removeClass( 'hide' )
                              .one( 'click', startRound );

   }
   /* END endRound() ---------------------------- */

  /**
   *  Sets new timer object
   *
   *  @param ()
   *  @return undefined
   *
   */
   function startTimer()
   {
    $( '.circle-timer' ).TimeCircles({ time: { Days: { show: false },
                                               Hours: { show: false },
                                               Minutes: { show: false },
                                               Seconds: { color: "#ff8080" }
                                             }
                                           });

    // $( '.circle-timer' ).TimeCircles( { count_past_zero: false } );
    $( '.circle-timer' ).TimeCircles( { direction: "Both" } );
    // $( '.circle-timer' ).TimeCircles( { use_background: false } );

    $( '.circle-timer' ).attr( 'data-timer', game.timeAllowed.toString() );
    $( '.circle-timer' ).TimeCircles().start();

    /* Set new timing interval */
    timer = setInterval( updateTimeRemaining, 1000 );

   }
   /* END startTimer() ---------------------------- */

  /**
   *  Updates time remaining variable.
   *  Checks if time allowed equals zero, if true fires checkAnswer().
   *
   *  @param ()
   *  @return undefined
   *
   */
   function updateTimeRemaining()
   {

    game.timeRemaining--;

    if ( game.timeRemaining == 0 )
      checkAnswer();

   }
   /* END updateTimer() ---------------------------- */

   function clearTimer()
   {

    $( '.circle-timer' ).TimeCircles().destroy();

    clearInterval( timer );

    game.resetTimeRemaining();

   }

  /** --------------------------
   *  APPLICATION ENTRY POINT *
   ------------------------- **/
   startGame();

});
