// Dom Variables
const addContainer = document.querySelector(".add-container");
const addBtn = document.querySelector(".add-btn");
const notesContainer = document.querySelector(".container");
// Dom Variables
addBtn.addEventListener("click", openAddOptions);

retriveNotes();
editCollabse();
controllNotes();
drawCanvases();

function openAddOptions() {
  addContainer.classList.toggle("open");
}
function editCollabse() {
  const editCollabses = document.querySelectorAll(".note .collabse");

  editCollabses.forEach((collabse) => {
    let editBtn = collabse.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      collabse.classList.toggle("open");
    });
  });
}

function retriveNotes() {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  let noteDiv;

  notes.forEach((note, index) => {
    if (note.type == "text") {
      noteDiv = `
      <div data-id="${note.id}" class="note">
        <div class="header">
          <p class="title">${note.title}</p>
          <div class="collabse">
            <i class="edit-btn fa-solid fa-ellipsis"></i>
            <div class="edit-options">
              <p class="edit">Edit</p>
              <p class="delete">Delete</p>
            </div>
          </div>
        </div>
        <p class="content">${note.content}</p>
      </div>
      `;
    } else {
      noteDiv = `
      <div data-id="${note.id}" class="note">
      <div class="header">
        <p class="title">${note.title}</p>
        <div class="collabse">
          <i class="edit-btn fa-solid fa-ellipsis"></i>
          <div class="edit-options">
            <p class="edit">Edit</p>
            <p class="delete">Delete</p>
          </div>
        </div>
      </div>
      <canvas class="content"></canvas>
    </div>
      `;
    }
    notesContainer.insertAdjacentHTML("beforeend", noteDiv);
  });
}

function controllNotes() {
  const notesDivs = document.querySelectorAll(".note");

  notesDivs.forEach((noteDiv, index) => {
    let deleteBtn = noteDiv.querySelector(".delete");
    let editBtn = noteDiv.querySelector(".edit");
    let noteId = noteDiv.getAttribute("data-id");

    deleteBtn.addEventListener("click", deleteNote);
    editBtn.addEventListener("click", editNote);

    function deleteNote() {
      let notes = JSON.parse(localStorage.getItem("notes"));

      notes.forEach((note, index) => {
        if (note.id == noteId) {
          notes.splice(index, 1);
        }
      });

      localStorage.setItem("notes", JSON.stringify(notes));
      notesContainer.removeChild(noteDiv);
    }

    function editNote() {
      let notes = JSON.parse(localStorage.getItem("notes"));
      let noteId = noteDiv.getAttribute("data-id");

      notes[noteId].type == "text"
        ? (location.href = `./pages/text/text.html?id=${noteId}`)
        : (location.href = `./pages/draw/draw.html?id=${noteId}`);
    }
  });
}

function drawCanvases() {
  const notesDivs = document.querySelectorAll(".note");

  notesDivs.forEach((noteDiv) => {
    let canvas = noteDiv.querySelector("canvas");
    let noteId = noteDiv.getAttribute("data-id");

    if (!canvas) return;

    let notes = JSON.parse(localStorage.getItem("notes"));
    let note = notes[noteId];
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    let ctx = canvas.getContext("2d");
    ctx.lineCap = "round";

    note.content.forEach((point) => {
      if (point == "up") {
        ctx.beginPath();
        return;
      }

      ctx.lineWidth = point.toolType == "pen" ? 3 / 3 : 40 / 3;
      ctx.strokeStyle = point.toolType == "pen" ? "black" : "white";

      let x = canvasWidth * point.xPercentage;
      let y = canvasHeight * point.yPercentage;

      ctx.lineTo(x, y);
      ctx.stroke();
    });
  });
}
