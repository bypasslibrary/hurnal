const CSV_URL =
  "https://docs.google.com/spreadsheets/d/1lZKOyyAo56vAhCJaA5obhT5fFG4P2jnb/export?format=csv&gid=735258046";

const statusEl = document.getElementById("status");
const table = document.getElementById("schedule");
const tbody = table.querySelector("tbody");

fetch(CSV_URL)
  .then(r => r.text())
  .then(text => {
    if (!text.trim()) {
      statusEl.textContent = "❌ CSV пустой или недоступен";
      return;
    }

    const rows = parseCSV(text);

    if (rows.length < 2) {
      statusEl.textContent = "❌ Нет данных";
      return;
    }

    // первая строка — заголовки
    rows.slice(1).forEach(r => {
      if (r.length < 8) return;

      const tr = document.createElement("tr");

      [
        r[0], // Группа
        r[1], // Пара
        r[8] || "—", // Подгруппа
        r[3], // Дисциплина
        r[4], // Аудитория
        r[5], // Преподаватель
        r[6], // Дата
        r[7], // День недели
      ].forEach(v => {
        const td = document.createElement("td");
        td.textContent = v || "—";
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    statusEl.textContent = "✔ Расписание загружено";
    table.hidden = false;
  })
  .catch(err => {
    statusEl.textContent = "❌ Ошибка загрузки";
    console.error(err);
  });

function parseCSV(text) {
  return text
    .split("\n")
    .map(row =>
      row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
         .map(c => c.replace(/^"|"$/g, "").trim())
    );
}
