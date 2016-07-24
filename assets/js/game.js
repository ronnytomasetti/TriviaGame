/*
* Trivia Game
* Ronny Tomasetti
* 2016 UCF Coding Bootcamp
*/

/* HOMEWORK INSTRUCTIONS:
* Show start button to start game.
* Show first question with choices.
* Start 30 sec timer for that one question.
* Player will choose an answer.
* Game will show results of their choice and automatically move on to the next question.
* At end of game, results will be printed (correct, incorrect, unanswered). 
* timer stops
* New game button doesn't reload page.
* */

var template = $('#question-template').html();

$('button.start-button').click( function()
{
		// Clone the template
    var item = $(template).clone();
    
    //Find the 
    $(item).find('.first').html("hhahahahaha");
    
    //Change 'bar' to '-Bar'
    $(item).find('.bar').html("silly");
    
    //Append to the source
    $('#trivia-card').append(item);
});

var trivia =
{
	questionsBank: [],
	correctAnswers: 0,
	incorrectAnswers: 0,
	unanswered: 0
}

$( document ).ready( function()
{
	/*
	 *	Retrieve questions json object
	 *	Save data retrieved in trivia.questionsBank[] array.
	 *
	 *	@param ()
	 *	@return void 
	 */
	function retrieveQuestions()
	{
		$.getJSON( 'assets/js/questions.json', function( data )
		{	
			trivia.questionsBank = $( data.questions );
		});
	}

	function newPlayerSelection( event )
	{
		player = characters[ $( this ).attr( 'data-id' ) ];

		$( this ).appendTo( '#player-character' )
						 .addClass( 'player' );

		$( '#characters-select' ).children()
														 .unbind( 'click', newPlayerSelection );

		$( '#characters-select' ).children()
														 .appendTo( '#enemy-select' )
														 .addClass( 'enemy' )
														 .one( 'click', newEnemySelected );

		var $attackButton = $( '<button>' ).addClass( 'button disabled' )
																			 .text( 'ATTACK!' );

		$( '#player-character').append($attackButton);
		$( '.action-console' ).html( 'Select an enemy to battle!' );
	} // END newPlayerSelection()

	function newEnemySelected( event )
	{
		cpu = characters[ $( this ).attr( 'data-id' ) ];

		$( this ).appendTo( '#cpu-character' )
						 .addClass( 'defender' );

		$( '#enemy-select' ).children()
												.unbind( 'click', newEnemySelected );

		$( '.button' ).removeClass('disabled')
									.on( 'click', playerAttacking );

		$( '.action-console' ).html( 'Press ATTACK! to fight ' + cpu.name );
	} // End newEnemySelected()

	function playerAttacking()
	{
		player.xp++; // Player experience points increased by 1 every time they strike.
		cpu.hp -= player.ap * player.xp; // Calculate cpu taking hit by player attack power.

		if ( cpu.hp <= 0 )
		{
			postBattle( true );
			return;
		}

		player.hp -= cpu.cap; // Calculate player taking hit by cpu counter attack power.

		// Update hp variables.
		$( '#player-character .player .hp' ).html( player.hp );
		$( '#cpu-character .defender .hp' ).html( cpu.hp );

		$( '.action-console' ).html( 'You attacked ' + cpu.name + ' for ' + player.ap * player.xp + ' damage!' + '<br>'
																	+ cpu.name + ' attacked you back for ' + cpu.cap + ' damage!' );

		if ( player.hp <= 0 )
		{
			postBattle( false );
		}
	} // End playerAttacking()

	function postBattle( withWin )
	{
		$( '.button' ).addClass( 'disabled' )
									.unbind( 'click', playerAttacking );

		if (withWin)
		{
			$( '#cpu-character .defender' ).remove();

			if ( $( '#enemy-select' ).has( '.enemy' ).length == 0 )
			{
				endGameWith( true );
				return;
			}

			$( '#enemy-select' ).children()
													.one( 'click', newEnemySelected );

			$( '.action-console' ).html( 'You have defeated ' + cpu.name + '!<br>Choose your next opponent...' );
		}
		else
		{
			$( '#player-character .player' ).remove();
			$( '.action-console' ).html( "You've been defeated by " + cpu.name + ".<br>GAME OVER!!!" );
			endGameWith( false );
		}
	} // End postBattle()

	function endGameWith( playerWin )
	{
		if ( playerWin )
		{
			$( '.action-console' ).html( 'YOU WIN!!!<br>Game Over!' );
		}

		$( '.button' ).removeClass( 'disabled' )
									.text( 'Restart Game' );

		$( '.button' ).one( 'click', function() { location.reload() });
	} // END endGameWith()

	retrieveQuestions();
}); // END $(document).ready()
