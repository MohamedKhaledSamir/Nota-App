// DOM VARIABLES

const canvas = document.querySelector("canvas"),
  eraser = document.querySelector(".eraser"),
  pen = document.querySelector(".pen"),
  title = document.querySelector(".title"),
  titleSaveContainer = document.querySelector(".title-save"),
  saveBtn = document.querySelector(".save-btn");
// DOM VARIABLES

const titleSaveContainerMarginBlock = 40;
const titleSaveContainerHeight =
  parseInt(getComputedStyle(titleSaveContainer).height) +
  titleSaveContainerMarginBlock;
let toolType = "pen";
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let noteId = new URL(location.href).searchParams.get("id") || notes.length;
let note = notes[noteId];
let deviceType,
  allowDrawing = false;
canvas.width = document.body.clientWidth;
canvas.height =
  document.documentElement.clientHeight - titleSaveContainerHeight;
let ctx = canvas.getContext("2d");
ctx.lineCap = "round";
let events = {
  mouse: {
    start: "mousedown",
    end: "mouseup",
    move: "mousemove",
  },
  touch: {
    start: "touchstart",
    end: "touchend",
    move: "touchmove",
  },
};

retriveNote();

insializeNote();
checkDeviceType();

pen.addEventListener("click", () => {
  pen.classList.add("active");
  eraser.classList.remove("active");
  toolType = "pen";
});
eraser.addEventListener("click", () => {
  eraser.classList.add("active");
  pen.classList.remove("active");
  toolType = "eraser";
});
canvas.addEventListener(events[deviceType].start, startDrawing);
canvas.addEventListener(events[deviceType].end, endDrawing);
canvas.addEventListener(events[deviceType].move, idDrawing);
title.addEventListener("input", changeTitle);
saveBtn.addEventListener("click", saveToMemory);

function startDrawing(e) {
  allowDrawing = true;
  ctx.strokeStyle = toolType == "pen" ? "black" : "white";
  ctx.lineWidth = toolType == "pen" ? 3 : 40;
  let x = deviceType == "mouse" ? e.pageX : e.touches[0].pageX;
  let y =
    deviceType == "mouse"
      ? e.pageY - titleSaveContainerHeight
      : e.touches[0].pageY - titleSaveContainerHeight;
  ctx.lineTo(x, y);
  ctx.stroke();

  xPercentage = x / canvas.width;
  yPercentage = y / canvas.height;

  notes[noteId].content.push({
    xPercentage: xPercentage,
    yPercentage: yPercentage,
    toolType: toolType,
  });
}

function endDrawing() {
  allowDrawing = false;
  ctx.beginPath();

  notes[noteId].content.push("up");
}

function idDrawing(e) {
  if (!allowDrawing) return;

  let x = deviceType == "mouse" ? e.pageX : e.touches[0].pageX;
  let y =
    deviceType == "mouse"
      ? e.pageY - titleSaveContainerHeight
      : e.touches[0].pageY - titleSaveContainerHeight;
  ctx.lineTo(x, y);
  ctx.stroke();

  xPercentage = x / canvas.width;
  yPercentage = y / canvas.height;

  notes[noteId].content.push({
    xPercentage: xPercentage,
    yPercentage: yPercentage,
    toolType: toolType,
  });
}

function checkDeviceType() {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
  } catch (e) {
    deviceType = "mouse";
  }
}

function saveToMemory() {
  if (notes[noteId].content.length == 0) return;

  localStorage.setItem("notes", JSON.stringify(notes));
  location.href = "../../index.html";
}

function changeTitle() {
  notes[noteId].title = title.value;
}

function insializeNote() {
  if (!notes[noteId]) {
    notes[noteId] = {
      type: "draw",
      title: title.textContent,
      id: noteId,
      content: [],
    };
  }
}

function retriveNote() {
  if (note) {
    title.value = note.title;
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    let ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    note.content.forEach((point) => {
      if (point == "up") {
        ctx.beginPath();
        return;
      }

      ctx.lineWidth = point.toolType == "pen" ? 3 : 40;
      ctx.strokeStyle = point.toolType == "pen" ? "black" : "white";
      let x = canvasWidth * point.xPercentage;
      let y = canvasHeight * point.yPercentage;
      ctx.lineTo(x, y);
      ctx.stroke();
    });
  }
}
