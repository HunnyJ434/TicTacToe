const Box = document.querySelectorAll('.box');
const PlayerOne = document.querySelector('#p1Score');
const tie = document.querySelector('#tie');
const PlayerTwo = document.querySelector('#p2Score');
const Computer = document.querySelector('.Computer');
let p1Score = 0;
let p2Score = 0;
let tieScore = 0;
let turn = true;
let vsComputer = false;
let ComputerTurn = true;
let dashboard = [false,false,false,false,false,false,false,false,false]; // to check if a move is already been played
let gameEnded = false;


document.querySelector('#nextRoundBtn').addEventListener('click', () =>{
    reset();
    if(vsComputer){
        turn = true;
        ComputerTurn = false;
    }
})

// Function observing the moves

for(let i = 0;i <= Box.length;i++){
    Box[i].addEventListener('click', () => {
        if(!gameEnded){
            if(turn){
                if(!dashboard[i]){ // executing the move if it's not already been played.
                    Box[i].innerHTML = '<i class="fa-solid fa-x"></i>';
                    turn = !turn;
                    dashboard[i] = true;
                    isGameOver();
                    if(vsComputer){
                        ComputerTurn = true;
                        ComputerMove();
                    }
                }
            }else{
                if(!dashboard[i]){
                    Box[i].innerHTML = '<i class="fa-solid fa-o"></i>';
                    turn = !turn;
                    dashboard[i] = true;
                    isGameOver();
                    if(vsComputer){
                        ComputerTurn = true;
                        ComputerMove();
                    }
                }
            }
        }
    })

    //if playing vs computer
    Computer.addEventListener('click', () => {
        reset();
        p1Score = 0
        p2Score = 0
        tieScore = 0
        PlayerOne.innerHTML = `${p1Score}`;
        PlayerTwo.innerHTML = `${p1Score}`;
        tie.innerHTML = 0;
        if(!vsComputer){
            Computer.innerHTML = "Multiplayer"
            vsComputer = true;
            ComputerTurn = false;
            PlayerTwo.previousSibling.innerHTML = "AI";
        }
        else{
            Computer.innerHTML = "Computer"
            vsComputer = false;
            ComputerTurn = true;
            PlayerTwo.previousSibling.innerHTML = "P2";
        }
        turn = true;
    }) 
 }

 // Function checks if game is over after every move.
function isGameOver(){
    checkHorrizontal();
    checkVertical();
    checkDiagonal();
    checktie();
 
}    

// checking for a tie.
function checktie(){
    if((dashboard.every((value) => { // if every move is played and game is not ended yet, then it's a tie.
        return value;})) && !gameEnded)
    {
        tieScore++;
        tie.innerHTML = `${tieScore}`;
        tie.style.color = 'grey';
        gameEnded = true;
    }
}

// checks all rows
function checkHorrizontal(i = 0,j = 2){ // starts with default parameter values
    let count = 0;
    while(!(i > j)){ // checks one row for potential win for player one
        count += Box[i].innerHTML === '<i class="fa-solid fa-x"></i>'; // count is inc for every cross on the board
        i++;
    }
    if(count === 3){
        if(vsComputer && ComputerTurn){ // for computer to decide if it's winning
            return true;
        }
        else{
            playerOneWon(j-2,j+1,1);
        }
    }
    else{ 
        count = 0;
        i = j - 2;
        while(!(i > j)){// checks same row for potential player two win
            count += Box[i].innerHTML === '<i class="fa-solid fa-o"></i>';
            i++;
        }
        if(count === 3){
            if(vsComputer && ComputerTurn){
                return true;
            }
            else{
                playerTwoWon(j-2,j+1,1);
            }
        }
    }
    j+= 3;
    i = j - 2;
    if(i <= 8){ // recursive function to check for other rows.
        checkHorrizontal(i,j);
    }   
}

// checks all column
function checkVertical(){
    let count = 0;
    for(let i = 0;i <= 2;i++){
        for(let j = i; j <= i + 6; j+=3){
            count += Box[j].innerHTML === '<i class="fa-solid fa-x"></i>';
        }
        if(count === 3){
            if(vsComputer && ComputerTurn){
                return true;
            }
            else{
                playerOneWon(i,i+7,3)
            }
        }
        count = 0;
        for(let j = i; j <= i + 6; j+=3){
            count += Box[j].innerHTML === '<i class="fa-solid fa-o"></i>';
        }
        if(count === 3){
            if(vsComputer && ComputerTurn){
                return true;
            }
            else{
                playerTwoWon(i,i+7,3)
            }
        }
        count = 0;
    }

}
// checks both Diagonals
function checkDiagonal(){
    // checking first Diagonal
        if(Box[0].innerHTML === '<i class="fa-solid fa-x"></i>'
            && Box[4].innerHTML === '<i class="fa-solid fa-x"></i>'
            && Box[8].innerHTML === '<i class="fa-solid fa-x"></i>')
        {
            if(vsComputer && ComputerTurn){
                return true;
            }
            else{
                playerOneWon(0,9,4);
            }
        }
        else if (Box[0].innerHTML === '<i class="fa-solid fa-o"></i>'
                 && Box[4].innerHTML === '<i class="fa-solid fa-o"></i>'
                 && Box[8].innerHTML === '<i class="fa-solid fa-o"></i>')
        {
            if(vsComputer && ComputerTurn){
                return true;
            }
            else{
                playerTwoWon(0,9,4);
            }
        }
    // checking second Diagonal
        if(Box[2].innerHTML === '<i class="fa-solid fa-x"></i>'
        && Box[4].innerHTML === '<i class="fa-solid fa-x"></i>'
        && Box[6].innerHTML === '<i class="fa-solid fa-x"></i>')
    {
        if(vsComputer && ComputerTurn){
            return true;
        }
        else{
            playerOneWon(2,7,2);
        }
    }
    else if (Box[2].innerHTML === '<i class="fa-solid fa-o"></i>'
             && Box[4].innerHTML === '<i class="fa-solid fa-o"></i>'
             && Box[6].innerHTML === '<i class="fa-solid fa-o"></i>')
    {
        if(vsComputer && ComputerTurn){
            return true;
        }
        else{
            playerTwoWon(2,7,2);
        }
    }

}

function ComputerMove(){
    if(!gameEnded && ComputerTurn){
        let move = isPlayerWinning(true); // checks if it's winning
        if(move === -1){
            move = isPlayerWinning(false); // else, checks if other player is winning.
        }
        if(move === -1){ // otherwise, it moves randomly
            move = getRandomInt();
        }
        if(!dashboard[move]){
            Box[move].innerHTML = '<i class="fa-solid fa-o"></i>';
            dashboard[move] = true;
            ComputerTurn = false;
            PlayerTurn = true;
            turn = !turn;
            isGameOver();
        }
        else{
        ComputerMove(); // recursive until it finds a move.
        }
    }
 }

 //hypothetical plays a move and check if the player is winning after that move.
 function isPlayerWinning(position){
    let isWinning = false;
    let winPosition = -1;
    for(let i = 0; i <=8;i++){
        if(!dashboard[i]){
            if(position){
                Box[i].innerHTML = '<i class="fa-solid fa-o"></i>';
            }
            else{
            Box[i].innerHTML = '<i class="fa-solid fa-x"></i>';
            }
            isWinning = checkHorrizontal() || checkVertical() || checkDiagonal();
            Box[i].innerHTML = '';
            if(isWinning){
                winPosition = i;
                break;
            }
        }
    }
    return winPosition;
} 

function playerOneWon(initial, final, inc){
    for(let i = initial; i < final;i+= inc){
        Box[i].innerHTML = '<i class="fa-solid fa-x winnerClass"></i>'
    }
    p1Score++;
    PlayerOne.innerHTML = `${p1Score}`;
    PlayerOne.style.color = 'green';
    PlayerTwo.style.color = 'red';
    PlayerOne.style.transform = "translateY(-0.1em)";
    PlayerTwo.style.transform = "translateY(-0.1em)";
    gameEnded = true;
}

function playerTwoWon(initial, final, inc){
    for(let i = initial; i < final;i+= inc){
        Box[i].innerHTML = '<i class="fa-solid fa-o winnerClass"></i>'
    }
    p2Score++;
    PlayerTwo.style.color = 'green';
    PlayerOne.style.color = 'red';
    PlayerTwo.innerHTML = `${p2Score}`;
    gameEnded = true;
}


function reset(){
    turn = !turn;
    for(let i = 0; i < dashboard.length;i++){
        Box[i].innerHTML = "";
        dashboard[i] = false;
    }
    gameEnded = false;
    PlayerOne.style.color = "#151b29"
    PlayerTwo.style.color = "#151b29"
    PlayerOne.style.transform = "translateY(0.1em)";
    PlayerTwo.style.transform = "translateY(0.1em)";
    tie.style.color = "#151b29"
}

function getRandomInt() {
    return Math.floor(Math.random() * 8.4);
}
