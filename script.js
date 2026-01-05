const lostBtn = document.getElementById("lostBtn");
const lostForm = document.getElementById("lostForm");
const studentFeedback = document.getElementById("studentFeedback");

lostBtn.onclick = () => {
  lostForm.classList.remove("hidden");
};

function sendLost() {
  studentFeedback.innerText = "✅ Dein Lost-Signal wurde gesendet.";
  lostForm.classList.add("hidden");
}

function showStudent() {
  document.getElementById("studentView").classList.remove("hidden");
  document.getElementById("lecturerView").classList.add("hidden");
}

function showLecturer() {
  document.getElementById("lecturerView").classList.remove("hidden");
  document.getElementById("studentView").classList.add("hidden");
}
