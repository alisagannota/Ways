
var Airtable = require('airtable');
var base = new Airtable({ apiKey: "keyzGMVRW36X04BhO" }).base("appnM2fTZRU6IbXCi");
  
//get the "photos" table from the base, select ALL the records, and specify the functions that will receive the data
base('ways').select({
    maxRecords: 100,
    view: "Grid view"
 }).eachPage(gotPageOfPhotos, gotAllPhotos);

 // an empty array to hold our photo data
 const photos = [];

// callback function that receives our data
function gotPageOfPhotos(records, fetchNextPage) {
    console.log("gotPageOfPhotos()");
    // add the records from this page to our photos array
    photos.push(...records);
    // request more pages
    fetchNextPage();
  }

  // call back function that is called when all pages are loaded
function gotAllPhotos(err) {
    console.log("gotAllPhotos()");
  
    // report an error, you'd want to do something better than this in production
    if (err) {
      console.log("error loading photos");
      console.error(err);
      return;
    }
  
    // call function to show the books
    showPhotos();
  }


// create the book-spines on the shelf
function showPhotos() {
    console.log("showPhotos()");
  
    // // find the shelf element
    // const shelf = document.getElementById("shelf");
  
    // loop through the books loaded from the Airtable API
    books.forEach((photo) => {
      // create the div, set its text and class
      const div = document.createElement("div");
      div.innerText = photo.fields.attachments;
      div.classList.add("images");
    //   // when the user clicks this book spine, call showBook and send the book data and this spine element
    //   div.addEventListener("click", () => {
    //     showBook(book, div);
    //   });
    //   // put the newly created book spine on the shelf
    //   shelf.appendChild(div);
    });
}
  
  // show the detail info for a book, and highlight the active book-spine
  function showBook(book, div) {
    console.log("showBook()", book);
  
    // find the book detail element
    const bookDetail = document.getElementById("book-detail");
  
    // populate the template with the data in the provided book
    bookDetail.getElementsByClassName("title")[0].innerText = book.fields.title; //
    bookDetail.getElementsByClassName("description")[0].innerText =
      book.fields.description;
    bookDetail.getElementsByClassName("more")[0].href = book.fields.more;
    bookDetail.getElementsByClassName("cover-image")[0].src =
      book.fields.cover_image[0].url;
  
    // remove the .active class from any book spines that have it...
    const shelf = document.getElementById("shelf");
    const bookSpines = shelf.getElementsByClassName("active");
    for (const bookSpine of bookSpines) {
      bookSpine.classList.remove("active");
    }
    // ...and set it on the one just clicked
    div.classList.add("active");
  
    // reveal the detail element, we only really need this the first time
    // but its not hurting to do it more than once
    bookDetail.classList.remove("hidden");
  }
  
  
    // try {
    //     showTypes();
    //   } catch (error) {
    //     error.log(error);
    //   }