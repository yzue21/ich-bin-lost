const lostBtn = document.getElementById("lostBtn");
const lostForm = document.getElementById("lostForm");
const studentFeedback = document.getElementById("studentFeedback");
const slideInput = document.getElementById("slideInput");
const weeklyCharts = document.getElementById("weeklyCharts");
const liveChart = document.getElementById("liveChart");
const lecturerNavButtons = document.querySelectorAll(".lecturerNav .navTab");
const lecturerLock = document.getElementById("lecturerLock");
const lockPasswordInput = document.getElementById("lockPassword");
const lockFeedback = document.getElementById("lockFeedback");
const currentCourseLabel = document.getElementById("currentCourse");

const LECTURER_PASSWORD = "prof123";
let lecturerUnlocked = false;

const weeklyLectures = [
  {
    title: "Vorlesung 1",
    startTime: "09:00",
    liveTime: "11:00",
    threshold: 40,
    bars: [
      { time: "09:00", value: 18, color: "green" },
      { time: "09:30", value: 42, color: "red", storm: true },
      { time: "10:00", value: 12, color: "green" },
      { time: "10:30", value: 47, color: "red", storm: true }
    ]
  },
  {
    title: "Vorlesung 2",
    startTime: "10:00",
    liveTime: "12:30",
    threshold: 40,
    bars: [
      { time: "10:00", value: 10, color: "green" },
      { time: "10:30", value: 20, color: "green" },
      { time: "11:00", value: 55, color: "red", storm: true },
      { time: "11:30", value: 42, color: "red", storm: true },
      { time: "12:00", value: 16, color: "green" }
    ]
  },
  {
    title: "Vorlesung 3",
    startTime: "08:30",
    liveTime: "10:30",
    threshold: 40,
    bars: [
      { time: "08:30", value: 12, color: "green" },
      { time: "09:00", value: 47, color: "red", storm: true },
      { time: "09:30", value: 8, color: "green" },
      { time: "10:00", value: 18, color: "green" }
    ]
  }
];

const liveSession = {
  title: "Live-Sitzung",
  startTime: "09:00",
  liveTime: "12:00",
  threshold: 40,
  bars: [
    { time: "09:00", value: 24, color: "green" },
    { time: "09:30", value: 47, color: "red", storm: true },
    { time: "10:00", value: 12, color: "green" },
    { time: "10:30", value: 60, color: "red", storm: true },
    { time: "11:00", value: 18, color: "green" }
  ],
  liveValue: 34
};

if (lostBtn && lostForm) {
  lostBtn.onclick = () => {
    lostForm.classList.remove("hidden");
  };
}

function sendLost() {
  if (studentFeedback && lostForm) {
    const courseName = currentCourseLabel?.innerText || "Vorlesung";
    studentFeedback.innerText = `✅ Dein Lost-Signal für "${courseName}" wurde gesendet.`;
    studentFeedback.classList.remove("hidden");
    lostForm.classList.add("hidden");
  }
}

function showStudent() {
  document.getElementById("studentView")?.classList.remove("hidden");
  document.getElementById("lecturerView")?.classList.add("hidden");
}

function showLecturer() {
  document.getElementById("lecturerView")?.classList.remove("hidden");
  document.getElementById("studentView")?.classList.add("hidden");
  const weeklyTab = document.querySelector('.lecturerNav .navTab[data-target="weeklySection"]');
  if (weeklyTab && !weeklyTab.classList.contains("active")) {
    weeklyTab.click();
  }
}

function requestLecturerAccess() {
  if (lecturerUnlocked) {
    showLecturer();
    return;
  }
  if (lecturerLock) {
    lecturerLock.classList.remove("hidden");
    lockFeedback?.classList.add("hidden");
    lockPasswordInput?.focus();
    lockPasswordInput.value = "";
  }
}

function closeLecturerLock() {
  lecturerLock?.classList.add("hidden");
  lockPasswordInput.value = "";
}

function unlockLecturer() {
  if (!lockPasswordInput) return;
  if (lockPasswordInput.value === LECTURER_PASSWORD) {
    lecturerUnlocked = true;
    closeLecturerLock();
    showLecturer();
  } else {
    lockFeedback?.classList.remove("hidden");
  }
}

if (slideInput) {
  slideInput.addEventListener("input", () => {
    slideInput.value = slideInput.value.replace(/[^0-9]/g, "");
  });
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function buildTicks(startTime, liveTime) {
  const ticks = [];
  let cursor = timeToMinutes(startTime);
  const end = timeToMinutes(liveTime);
  while (cursor <= end) {
    ticks.push(minutesToTime(cursor));
    cursor += 30;
  }
  return ticks;
}

function buildYAxis(maxValue) {
  const top = Math.max(10, Math.ceil(maxValue / 10) * 10);
  return [
    top,
    Math.round(top * 0.66),
    Math.round(top * 0.33),
    0
  ];
}

function createChartCard(config) {
  const { title, startTime, liveTime, threshold = 0, bars = [], liveValue } = config;
  const ticks = buildTicks(startTime, liveTime);
  const segments = Math.max(1, ticks.length - 1);
  const maxCandidate = Math.max(
    ...bars.map((b) => b.value),
    threshold,
    liveValue || 0,
    10
  );
  const topValue = Math.max(10, Math.ceil(maxCandidate / 10) * 10 + 10);
  const yLabels = buildYAxis(topValue);

  const card = document.createElement("div");
  card.className = "chartCard";

  if (title) {
    const chartTitle = document.createElement("h3");
    chartTitle.className = "chartTitle";
    chartTitle.innerText = title;
    card.appendChild(chartTitle);
  }

  const shell = document.createElement("div");
  shell.className = "chartShell";

  const yAxis = document.createElement("div");
  yAxis.className = "yAxis";
  yLabels.forEach((label) => {
    const span = document.createElement("span");
    span.innerText = label;
    yAxis.appendChild(span);
  });

  const chartBody = document.createElement("div");
  chartBody.className = "chartBody";

  const plotFrame = document.createElement("div");
  plotFrame.className = "plotFrame";

  const barGrid = document.createElement("div");
  barGrid.className = "barGrid";
  barGrid.style.setProperty("--segments", segments);

  for (let i = 0; i < segments; i += 1) {
    const slot = document.createElement("div");
    slot.className = "barSlot";
    barGrid.appendChild(slot);
  }

  bars.forEach((bar) => {
    const slotIndex = ticks.indexOf(bar.time);
    if (slotIndex === -1 || slotIndex >= barGrid.children.length) {
      return;
    }
    const slot = barGrid.children[slotIndex];
    const barEl = document.createElement("div");
    barEl.className = `bar ${bar.color || "green"}`;
    barEl.style.height = `${(bar.value / topValue) * 100}%`;
    barEl.title = `${bar.time} · ${bar.value} Lost-Meldungen`;
    if (bar.storm || (threshold && bar.value >= threshold)) {
      barEl.classList.add("stormBar");
      const badge = document.createElement("div");
      badge.className = "stormBadge";
      badge.innerText = "⚠️ Lost-Sturm";
      barEl.appendChild(badge);
    }
    slot.appendChild(barEl);
  });

  if (typeof liveValue === "number") {
    const liveSlot = barGrid.children[barGrid.children.length - 1];
    const liveBar = document.createElement("div");
    liveBar.className = "bar live";
    liveBar.style.height = `${(liveValue / topValue) * 100}%`;
    liveBar.title = `Live (${liveTime}) · ${liveValue} Lost-Meldungen`;
    if (threshold && liveValue >= threshold) {
      liveBar.classList.add("stormBar");
      const badge = document.createElement("div");
      badge.className = "stormBadge";
      badge.innerText = "⚠️ Lost-Sturm";
      liveBar.appendChild(badge);
    }
    liveSlot.appendChild(liveBar);
  }

  if (threshold) {
    const thresholdLine = document.createElement("div");
    thresholdLine.className = "threshold";
    const thresholdPos = Math.min(100, (threshold / topValue) * 100);
    thresholdLine.style.bottom = `${thresholdPos}%`;

    const thresholdLabel = document.createElement("span");
    thresholdLabel.className = "thresholdLabel";
    thresholdLabel.innerText = "Live-Storm!";
    thresholdLine.appendChild(thresholdLabel);

    plotFrame.appendChild(thresholdLine);
  }

  plotFrame.appendChild(barGrid);

  const xAxis = document.createElement("div");
  xAxis.className = "xAxis";
  xAxis.style.setProperty("--segments", segments);
  for (let i = 0; i < segments; i += 1) {
    const isLiveSlot = typeof liveValue === "number" && i === segments - 1;
    const labelText = isLiveSlot ? "LIVE" : `${ticks[i]} - ${ticks[i + 1]}`;

    const tick = document.createElement("div");
    tick.className = "tick";
    if (isLiveSlot) tick.classList.add("tick-live");

    const mark = document.createElement("span");
    mark.className = "tickMark";
    const label = document.createElement("span");
    label.className = "tickLabel";
    label.innerText = labelText;

    if (isLiveSlot) {
      label.classList.add("tickLabel-live");
      const dot = document.createElement("span");
      dot.className = "liveDot";
      label.prepend(dot);
    }

    tick.appendChild(mark);
    tick.appendChild(label);
    xAxis.appendChild(tick);
  }

  chartBody.appendChild(plotFrame);
  chartBody.appendChild(xAxis);

  shell.appendChild(yAxis);
  shell.appendChild(chartBody);

  card.appendChild(shell);
  return card;
}

function renderWeeklyCharts() {
  if (!weeklyCharts) return;
  weeklyCharts.innerHTML = "";
  weeklyLectures.forEach((lecture) => {
    weeklyCharts.appendChild(createChartCard(lecture));
  });
}

function renderLiveChart() {
  if (!liveChart) return;
  liveChart.innerHTML = "";
  liveChart.appendChild(createChartCard(liveSession));
}

function wireLecturerTabs() {
  lecturerNavButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      lecturerNavButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".lecturerSection").forEach((section) => {
        section.classList.add("hidden");
      });
      const target = document.getElementById(btn.dataset.target);
      target?.classList.remove("hidden");
    });
  });
}

renderWeeklyCharts();
renderLiveChart();
wireLecturerTabs();
