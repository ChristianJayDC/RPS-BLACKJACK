let userScore = 0;
let computerScore = 0;
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector(".score-board");
const result_p = document.querySelector(".result > p");
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissor_div = document.getElementById("s");

function getComputerChoice(){
    const choices = ['r', 'p', 's'];
    const randomNum = Math.floor(Math.random() *3);
    return choices[randomNum];
}

function convertWord(letter){
    if (letter === "r") return "Gapo";
    if (letter == "p") return "Papel";
    return "Gunting";
}

function win(user, computer){
    const userDiv = document.getElementById(user);
    userScore++;
    userScore_span.innerHTML = userScore;
    result_p.innerHTML = `${convertWord(user)} ka daog mo ang ${convertWord(computer)}.`.fontcolor("green");
    userDiv.classList.add('green-glow');
    setTimeout(() => userDiv.classList.remove('green-glow'), 500)
}

function loss(user, computer){
    const userDiv = document.getElementById(user);
    computerScore++;
    computerScore_span.innerHTML = computerScore;
    result_p.innerHTML = `${convertWord(user)} ka daog ka kang ${convertWord(computer)}.`.fontcolor("red");
    userDiv.classList.add('red-glow');
    setTimeout(() => userDiv.classList.remove('red-glow'), 500)
}

function draw(user, computer){
    const userDiv = document.getElementById(user);
    result_p.innerHTML = `${convertWord(user)} ka ${convertWord(computer)} man sya. kaya patas lang.`
    userDiv.classList.add('gray-glow');
    setTimeout(() => userDiv.classList.remove('gray-glow'), 500)
}

function game(userChoice){
    const computerChoice = getComputerChoice();
    switch(userChoice + computerChoice) {
        case "rs":
        case "pr":
        case "sp":
            win(userChoice, computerChoice);
            break;
        case "rp":
        case "ps":
        case "sr":
            loss(userChoice, computerChoice);
            break;
        case "rr":
        case "pp":
        case "ss":
            draw(userChoice, computerChoice);
            break;
    }
}

function main() {
    rock_div.addEventListener('click', function() {
        game("r")
    })
    
    paper_div.addEventListener('click', function() {
        game("p")
    })
    
    scissor_div.addEventListener('click', function(){
        game("s")
    })
}

main();



// Blackjack function 
let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']
const hitSound = new Audio('static/sounds/swish.m4a')
const winSound = new Audio('static/sounds/cheer.mp3')
const lossSound = new Audio('static/sounds/aww.mp3')
const patasSound = new Audio('static/sounds/patas.mp3')

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

function blackjackHit(){

    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
    
}

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer){
    if(activePlayer['score'] <= 21){
        let cardImage = document.createElement('img');
        cardImage.src = `static/image/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal() {
    //2 Player
    // showResult(computeWinner());

    if (blackjackGame['turnsOver'] === true) {

        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    
        for(i=0; i < yourImages.length; i++){
            yourImages[i].remove();
        }
    
        for(i=0; i < dealerImages.length; i++){
            dealerImages[i].remove();
        }
    
        YOU['score'] = 0;
        DEALER['score'] = 0;
    
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
        document.querySelector('#blackjack-result').textContent = 'Kastahi noy';
        document.querySelector('#blackjack-result').style.color = 'white';

        blackjackGame['turnsOver'] = false;
    }
    
    
}

function updateScore(card, activePlayer){
    if(card === 'A'){
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        }
        else{
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    }
    else{
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = 'LIMIT (21)';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
    else{
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {

    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {

        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }   

    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);        
}

function computeWinner(){
    let winner;

    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackjackGame['wins']++;
            winner = YOU;
        } 
        else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;
        }
        else if (YOU['score'] === DEALER['score']){
            blackjackGame['draws']++;
        }
    }
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        winner = DEALER;
    }
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
    }

    return winner;
}

function showResult(winner) {

    let message, messageColor;

    if (blackjackGame['turnsOver'] === true) {

        if (winner === YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'Gana ka! YAAH ugma ka?';
            messageColor = 'green';
            winSound.play();
        }
        else if (winner === DEALER) {
            document.querySelector('#loses').textContent = blackjackGame['losses'];
            message = 'Daog ka! HAHA malungkot ka?';
            messageColor = 'yellow';
            lossSound.play();
        }
        else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'Patas lang ang laban noy!';
            messageColor = 'white';
            patasSound.play();
        }
    
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}