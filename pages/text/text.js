// DOM VARIABLES
const title = document.querySelector(".title"),
  content = document.querySelector(".content"),
  addBtn = document.querySelector(".add");
// DOM VARIABLES

let url = new URL(location.href);
let noteId = url.searchParams.get("id");

if (noteId) {
  retriveNote();
  addBtn.addEventListener("click", update);
} else {
  addBtn.addEventListener("click", add);
}

function add() {
  if (content.value) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let note = {
      type: "text",
      id: notes.length,
      content: content.value,
      title: title.value,
    };
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
    goHome();
  }
}

function update() {
  let notes = JSON.parse(localStorage.getItem("notes"));
  notes[noteId].title = title.value;
  notes[noteId].content = content.value;

  localStorage.setItem("notes", JSON.stringify(notes));
  goHome();
}

function goHome() {
  window.location.href = "../../index.html";
}

function retriveNote() {
  let notes = JSON.parse(localStorage.getItem("notes"));
  let note = notes[noteId];
  title.value = note.title;
  content.value = note.content;
}
