const gameContainer = document.getElementById("game");
const hScore = document.getElementById("highScore")
const sBtn = document.getElementById("startBtn");
const rBtn = document.getElementById("restartBtn");
const pickedColor = [];

//How many cards selected (max 2)
let selectCount = 2;
let score = 0;
let selectionDone = false;
let progress = 0;

//Reset Game button
rBtn.addEventListener("click", function(e){
  console.log(e);
  gameReset();
  console.log("Reset function done")
  rBtn.style.visibility = "hidden";
  document.querySelector('#score').innerText = "Score: 0";
})

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
     
    //CHEAT MODE, PREVIEW CARD COLOR
    // newDiv.innerText = `${color}`;
    
    //Added styles and name of each block for
    newDiv.style.textAlign = "center";
    newDiv.style.lineHeight = "200px";

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
  setHighScore();
  sBtn.addEventListener("click", function(){
    sBtn.remove();
    gameContainer.style.visibility = "visible";
  })
}


// TODO: Implement this function!
function handleCardClick(event) {  
  //flip card, only if up to 2 cards selected
  if(selectCount>0 && !event.target.classList.contains("picked") && !event.target.classList.contains("found")){
    event.target.style.backgroundColor = event.target.classList.value;
  
    //Update score
    score++;
    document.querySelector('#score').innerText = `Score: ${score}`;

    selectCount--;
    if(score%2 === 0){
      selectionDone = true;
    }
    pickedColor.push(event.target);
    event.target.classList.add("picked");
  }
  //Reset selected cards after 1 seconds
  if(selectCount === 0 && selectionDone === true){
    
    selectionDone = false;
    setTimeout(function(){
      if(pickedColor[0].classList.value === pickedColor[1].classList.value){
        console.log("SAME!");
        progress++;
        if(progress === COLORS.length/2){
          console.log("Game Over!")
          if(score < localStorage.getItem("highScore") || localStorage.getItem("highScore") === null){
            localStorage.setItem("highScore", score);
            setHighScore();
            alert(`New High Score!\nHighScore: ${score}`)
          }
          rBtn.style.visibility = "visible";
        }
      }
      else{
        console.log("DIFFERENT!");
        unFlip();
      }

      //Empty selected cards array
      pickedColor.pop();
      pickedColor.pop();

      selectCount = 2}
      , 1000);
  }
  
}

//Flips cards back upside down (no pair found)
function unFlip(){
  pickedColor[0].classList.remove("picked");
  pickedColor[1].classList.remove("picked");
  pickedColor[0].style.backgroundColor = "";
  pickedColor[1].style.backgroundColor = "";
}

//Retrieve High-Score & set it on page
function setHighScore(){
  if(localStorage.getItem("highScore")===null){
    hScore.innerText = "High-Score: -";
  }
  else{
    hScore.innerText = `High-Score: ${localStorage.getItem("highScore")}`
  }
}

function deleteCards(cards){
  for(let i=cards.length-1; i>=0; i--){
    cards[i].remove();
  }
}

function gameReset(){
  deleteCards(document.getElementsByClassName("picked"));
  score = 0;
  progress = 0;
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
}
// when the DOM loads
createDivsForColors(shuffledColors);

setInterval(
  function randBG(){
    let r = Math.floor((Math.random()*156))+100;
    let g = Math.floor((Math.random()*156))+100;
    let b = Math.floor((Math.random()*156))+100;
    document.querySelector("body").style.backgroundColor = `rgb(${r},${g},${b})`;
  },4000);

