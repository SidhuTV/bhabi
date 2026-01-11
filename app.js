// Simple Bhabi starter: single-player vs computer, highest-rank wins each trick.
// Deck: standard 52 cards. Ranks A high (14), 2 low (2).
// Game flow: New Game -> Deal (5 each) -> Player clicks a card to play -> Computer plays random card -> Compare -> Update score -> Repeat until hands empty

const SUITS = ['♠','♥','♦','♣'];
const RANKS = [
  {r:'2', v:2},{r:'3', v:3},{r:'4', v:4},{r:'5', v:5},{r:'6', v:6},{r:'7', v:7},
  {r:'8', v:8},{r:'9', v:9},{r:'10', v:10},{r:'J', v:11},{r:'Q', v:12},{r:'K', v:13},{r:'A', v:14}
];

let deck = [];
let playerHand = [];
let computerHand = [];
let playerScore = 0;
let computerScore = 0;

const newGameBtn = document.getElementById('newGameBtn');
const dealBtn = document.getElementById('dealBtn');
const playerHandEl = document.getElementById('playerHand');
const computerHandEl = document.getElementById('computerHand');
const playerPlayedEl = document.getElementById('playerPlayed');
const computerPlayedEl = document.getElementById('computerPlayed');
const messageEl = document.getElementById('message');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const roundsLeftEl = document.getElementById('roundsLeft');

function createDeck(){
  const d=[];
  for(const s of SUITS){
    for(const rk of RANKS){
      d.push({suit:s, rank:rk.r, value:rk.v, id:`${rk.r}${s}`});
    }
  }
  return d;
}

function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

function renderCard(card, opts = {}) {
  if(!card) return '';
  const el = document.createElement('div');
  el.className = 'card' + (opts.small ? ' small' : '');
  el.dataset.id = card.id;
  el.innerHTML = `<div class="suit">${card.suit}</div><div class="rank">${card.rank}</div>`;
  if(opts.clickable) el.style.cursor = 'pointer';
  return el;
}

function renderHands(){
  playerHandEl.innerHTML = '';
  computerHandEl.innerHTML = '';
  playerHand.forEach((c, i) => {
    const cardEl = renderCard(c, {small:true, clickable:true});
    cardEl.addEventListener('click', ()=> onPlayerPlay(i));
    playerHandEl.appendChild(cardEl);
  });
  // Computer hand: show backs (we render rotated cards for visual)
  computerHand.forEach(()=> {
    const back = document.createElement('div');
    back.className = 'card small';
    back.style.background = '#111';
    back.style.border = '2px solid rgba(255,255,255,0.06)';
    computerHandEl.appendChild(back);
  });
  roundsLeftEl.textContent = playerHand.length;
}

function onPlayerPlay(index){
  if(!playerHand[index]) return;
  const playerCard = playerHand.splice(index,1)[0];
  // Computer picks card (simple AI: random)
  const compIndex = Math.floor(Math.random()*computerHand.length);
  const computerCard = computerHand.splice(compIndex,1)[0];

  // Show played
  playerPlayedEl.innerHTML = '';
  computerPlayedEl.innerHTML = '';
  playerPlayedEl.appendChild(renderCard(playerCard));
  computerPlayedEl.appendChild(renderCard(computerCard));

  // Compare
  let roundMsg = '';
  if(playerCard.value > computerCard.value){
    playerScore++;
    roundMsg = `You win the trick! ${playerCard.rank}${playerCard.suit} beats ${computerCard.rank}${computerCard.suit}.`;
  } else if(playerCard.value < computerCard.value){
    computerScore++;
    roundMsg = `Computer wins the trick. ${computerCard.rank}${computerCard.suit} beats ${playerCard.rank}${playerCard.suit}.`;
  } else {
    roundMsg = `Tie! Both played ${playerCard.rank}.`;
  }

  updateScores();
  renderHands();

  // End of round check
  if(playerHand.length === 0){
    // Game over
    let final = '';
    if(playerScore > computerScore) final = `You win the game ${playerScore}–${computerScore}!`;
    else if(playerScore < computerScore) final = `Computer wins the game ${computerScore}–${playerScore}.`;
    else final = `Game tied ${playerScore}–${computerScore}.`;
    messageEl.textContent = roundMsg + ' ' + final;
    dealBtn.disabled = false;
    dealBtn.textContent = 'Deal again';
  } else {
    messageEl.textContent = roundMsg + ` Rounds left: ${playerHand.length}`;
  }
}

function updateScores(){
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

function dealHands(count = 5){
  // draw alternating: player then computer
  playerHand = [];
  computerHand = [];
  for(let i=0;i<count;i++){
    if(deck.length === 0) break;
    playerHand.push(deck.pop());
    if(deck.length === 0) break;
    computerHand.push(deck.pop());
  }
  updateScores();
  renderHands();
  messageEl.textContent = 'Select a card to play.';
  dealBtn.disabled = true;
}

function newGame(){
  deck = shuffle(createDeck());
  playerScore = 0;
  computerScore = 0;
  playerHand = [];
  computerHand = [];
  playerPlayedEl.innerHTML = '';
  computerPlayedEl.innerHTML = '';
  updateScores();
  roundsLeftEl.textContent = '0';
  messageEl.textContent = 'Click Deal to deal hands.';
  dealBtn.disabled = false;
  dealBtn.textContent = 'Deal';
  renderHands();
}

newGameBtn.addEventListener('click', ()=> {
  newGame();
});

dealBtn.addEventListener('click', ()=> {
  dealHands(5);
});

// init
newGame();
