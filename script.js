let levels = 1;

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let photosToView = [];
function resetChildrenNodes() {
  // resetting changing parts
  photosToView = [];
  // images
  let myNode = document.querySelector("#images");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.lastChild);
  }
  // the title
  myNode = document.querySelector("#category");
  myNode.removeChild(myNode.lastChild);

  document.documentElement.style.setProperty("--grid-size", levels);
}

/********** Airtable **********/
let Airtable = require("airtable");
let base = new Airtable({ apiKey: "keyzGMVRW36X04BhO" }).base(
  "appnM2fTZRU6IbXCi"
);

//get the 'photos' table from the base, select ALL the records, and specify the functions that will receive the data
base("ways")
  .select({
    maxRecords: 100,
    view: "Grid view",
  })
  .eachPage(gotPageOfPhotos, gotAllPhotos);

// callback function that receives our data
const photos = [];
function gotPageOfPhotos(records, fetchNextPage) {
  photos.push(...records);
  fetchNextPage();
}

// call back function that is called when all pages are loaded
function gotAllPhotos(error) {
  if (error) {
    console.log("*** Error loading photos!");
    console.error(error);
    return;
  }

  // consoleLogPhotos();
  showPhotos();
}

function consoleLogPhotos() {
  console.log("Running consoleLogPhotos...");
  photos.forEach((photo) => console.log(photo));
}

const setOfTypes = new Set();
function showPhotos() {
  shuffleArray(photos);
  for (let i = 0; i < (levels*levels); i++) {
    if (levels === 1) {
      document.querySelector('#images').style.display = "block";
    } else {
      document.querySelector('#images').style.display = "grid";
    }

    const photo = photos[i];
    photosToView.push(photo);

    // create a unique set of types
    setOfTypes.add(photo.fields.type.trim());

    // display images to the user
    let img = document.createElement("img");
    img.src = photo.fields.attachments[0].url;
    img.title = photo.fields.type;
    img.className = "unselected";
    img.onclick = function () {
      this.className === "selected"
        ? (this.className = "unselected")
        : (this.className = "selected");
    };
    document.querySelector("#images").appendChild(img);
  }

  // shuffle the set to randomise
  let arrayOfTypes = Array.from(setOfTypes);
  shuffleArray(arrayOfTypes);
  // console.log(arrayOfTypes);

  // creating a shorter set based on the number of levels
  setOfTypes.clear();
  for (let i = 0; i < arrayOfTypes.length; i++) {
    if (setOfTypes.size === levels) {
      break;
    }
    setOfTypes.add(arrayOfTypes[i]);
  }
  // console.log(setOfTypes);

  // display the task to the user
  let typesToSelect = "";
  setOfTypes.forEach((type) => {
    if (!typesToSelect) {
      typesToSelect += type;
    } else {
      typesToSelect += ", " + type;
    }
  });
  document.querySelector("#category").append(typesToSelect);
}

// https://stackoverflow.com/questions/31128855/comparing-ecma6-sets-for-equality
function eqSet(as, bs) {
  if (as.size !== bs.size) return false;
  for (var a of as) if (!bs.has(a)) return false;
  return true;
}

function nextLevel() {
  // what user has selected
  const allSelected_user = new Set();
  const allUnselected_user = new Set();
  document.querySelectorAll(".selected").forEach((selected) => {
    allSelected_user.add(selected.src);
  });
  document.querySelectorAll(".unselected").forEach((selected) => {
    allUnselected_user.add(selected.src);
  });
  // console.log(allSelected_user, allUnselected_user);

  // what actually is the truth
  const allSelected_correctAnswer = new Set();
  const allUnselected_correctAnswer = new Set();
  photosToView.forEach((photo) => {
    if (setOfTypes.has(photo.fields.type.trim())) {
      allSelected_correctAnswer.add(photo.fields.attachments[0].url);
    } else {
      allUnselected_correctAnswer.add(photo.fields.attachments[0].url);
    }
  });
  // console.log(allSelected_correctAnswer, allUnselected_correctAnswer);

  if (eqSet(allSelected_user, allSelected_correctAnswer) && eqSet(allUnselected_user, allUnselected_correctAnswer)) {
    if (levels === 10) {
      success();
      return;
    }

    levels++;
    // console.log("CORRECT!", levels);
    resetChildrenNodes();
    
    showPhotos();
  } else {
    // console.log("WRONG!");
    failure();
    return;
  }
}

function nextPage() {
  document.querySelector('#page-one').style.display = "none";
  document.querySelector('#page-two').style.display = "block";
}

function failure() {
  document.querySelector('#page-two').style.display = "none";
  document.querySelector('#page-fail').style.display = "block";
}

function success() {
  document.querySelector('#page-two').style.display = "none";
  document.querySelector('#page-success').style.display = "block";
}

function startOver() {
  document.querySelector('#page-fail').style.display = "none";
  document.querySelector('#page-success').style.display = "none";
  document.querySelector('#page-one').style.display = "block";

  levels = 1;
  resetChildrenNodes();
  showPhotos();
}
