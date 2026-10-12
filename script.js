;console.log("Swim Compass 2.0が起動しました！")
const todayDate = document.querySelector("#todayDate");

const today = new Date();
const dateKey = today.toLocaleDateString("sv-SE");

todayDate.textContent = today.toLocaleDateString("ja-JP", {

  year: "numeric",

  month: "long",

  day: "numeric",

  weekday: "long"

});
const saveButton = document.querySelector("#saveButton");
const goalInput = document.querySelector('input[type="text"]');
const practiceInput = document.querySelector('textarea');
const feelingSelect = document.querySelector("#mood");
const memoInput = document.querySelector("#memo");
const practiceMinutesInput = document.querySelector("#practiceMinutes");
const saveMessage = document.querySelector('#saveMessage');
const historyList = document.querySelector("#historyList");
const totalPracticeCount = document.querySelector("#totalPracticeCount");
const totalPracticeMinutes = document.querySelector("#totalPracticeMinutes");
const monthlyPracticeCount = document.querySelector("#monthlyPracticeCount");
const streakCount = document.querySelector("#streakCount");
let editingDate = null;
saveButton.addEventListener("click", function () {
  const dailyRecord = {
  goal: goalInput.value,
  practice: practiceInput.value,
  minutes: practiceMinutesInput.value,
  feeling: feelingSelect.value,
  memo: memoInput.value
};
localStorage.setItem(
  `swimCompassRecord-${editingDate || dateKey}`,
  JSON.stringify(dailyRecord)
);
  localStorage.setItem("swimCompassGoal", goalInput.value);
  localStorage.setItem("swimCompassPractice", practiceInput.value);
  localStorage.setItem("swimCompassMinutes", practiceMinutesInput.value);
  localStorage.setItem("swimCompassFeeling", feelingSelect.value);
  localStorage.setItem("swimCompassMemo", memoInput.value);
  editingDate = null;
renderHistory();
  saveMessage.textContent = "保存しました";
  setTimeout(function () {
  saveMessage.textContent = "";
}, 3000);
});
  const savedGoal = localStorage.getItem("swimCompassGoal");
  const savedPractice = localStorage.getItem("swimCompassPractice");
  const savedFeeling = localStorage.getItem("swimCompassFeeling");
  const savedMemo = localStorage.getItem("swimCompassMemo");
  const savedMinutes = localStorage.getItem("swimCompassMinutes");

if (savedGoal) {
  goalInput.value = savedGoal;
}
if (savedPractice) {
  practiceInput.value = savedPractice;
}
if (savedFeeling) {
  feelingSelect.value = savedFeeling;
}
if (savedMemo) {
  memoInput.value = savedMemo;
}
if (savedMinutes) {
  practiceMinutesInput.value = savedMinutes;
}

const resetButton = document.querySelector("#resetButton");

resetButton.addEventListener("click", function () {

  const isConfirmed = confirm("入力内容をすべて消しますか？");

if (!isConfirmed) {
  return;
}
  goalInput.value = "";
  practiceInput.value = "";
  feelingSelect.value = "選んでください";
  memoInput.value = "";
  practiceMinutesInput.value = "";

  localStorage.removeItem("swimCompassGoal");
  localStorage.removeItem("swimCompassPractice");
  localStorage.removeItem("swimCompassFeeling");
  localStorage.removeItem("swimCompassMemo");
  localStorage.removeItem("swimCompassMinutes");

  saveMessage.textContent = "リセットしました";

  setTimeout(function () {
    saveMessage.textContent = "";
  }, 3000);
});


function renderHistory() {
  const records = [];
  let totalMinutes = 0;
let monthlyCount = 0;
const currentMonth = dateKey.slice(0, 7);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith("swimCompassRecord-")) {
      const date = key.replace("swimCompassRecord-", "");
      const record = JSON.parse(localStorage.getItem(key));
      totalMinutes += Number(record.minutes) || 0;

if (date.startsWith(currentMonth)) {
  monthlyCount++;
}

      records.push({
        date: date,
        ...record
      });
    }
  }

  records.sort(function (a, b) {
    return b.date.localeCompare(a.date);
  });
  let streak = 0;

for (let i = 0; i < records.length; i++) {
  if (i === 0) {
    streak = 1;
    continue;
  }

  const previousDate = new Date(records[i - 1].date);
  const currentDate = new Date(records[i].date);

  const difference =
    (previousDate - currentDate) / (1000 * 60 * 60 * 24);

  if (difference === 1) {
    streak++;
  } else {
    break;
  }
}

totalPracticeCount.textContent = records.length;
totalPracticeMinutes.textContent = totalMinutes;
monthlyPracticeCount.textContent = monthlyCount;
streakCount.textContent = streak;

historyList.textContent = "";

if (records.length === 0) {
  historyList.textContent = "まだ記録はありません。";
  return;
}

  records.forEach(function (record) {
    const card = document.createElement("div");
    card.className = "history-card";

    card.innerHTML = `
      <h3>${record.date}</h3>
      <p><strong>目標：</strong>${record.goal || "未入力"}</p>
      <p><strong>練習：</strong>${record.practice || "未入力"}</p>
      <p><strong>練習時間：</strong>${record.minutes || "0"}分</p>
      <p><strong>感想：</strong>${record.feeling || "未入力"}</p>
    <p class="memo-text"><strong>一言メモ：</strong>${record.memo || "未入力"}</p>
    `;
    const editButton = document.createElement("button");
editButton.textContent = "この記録を編集";
editButton.className = "edit-record-button";

editButton.addEventListener("click", function () {
  editingDate = record.date;
  goalInput.value = record.goal || "";
  practiceInput.value = record.practice || "";
  practiceMinutesInput.value = record.minutes || "";
  feelingSelect.value = record.feeling || "選んでください";
  memoInput.value = record.memo || "";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "この記録を削除";
    deleteButton.className = "delete-record-button";

    deleteButton.addEventListener("click", function () {
      const confirmed = confirm(
        record.date + " の記録を削除しますか？"
      );

      if (confirmed) {
        localStorage.removeItem(
          "swimCompassRecord-" + record.date
        );
        renderHistory();
      }
    });
    card.appendChild(editButton);
    card.appendChild(deleteButton);
    historyList.appendChild(card);
  });
}

renderHistory();
const voiceInputButton = document.getElementById("voiceInputButton");
const practiceMemo = document.getElementById("practiceMemo");

voiceInputButton.addEventListener("click", function () {
  practiceMemo.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
  practiceMemo.focus();
});