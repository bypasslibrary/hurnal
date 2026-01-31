const CSV_URL =
  "https://docs.google.com/spreadsheets/d/1lZKOyyAo56vAhCJaA5obhT5fFG4P2jnb/export?format=csv&gid=735258046";

const statusEl = document.getElementById("status");
const table = document.getElementById("schedule");
const tbody = table.querySelector("tbody");

fetch(CSV_URL)
  .then(r => r.text())
  .then(text => {
    if (!text.trim()) {
      statusEl.textContent = "❌ CSV пустой";
      return;
    }

    const rows = parseCSV(text);
    if (rows.length < 2) {
      statusEl.textContent = "❌ Нет данных";
      return;
    }

    const headers = rows[0].map(h => h.toLowerCase());

    // карта столбцов по названию
    const col = name =>
      headers.findIndex(h => h.includes(name));

    const COLS = {
      group: col("груп"),
      pair: col("пар"),
      subject: col("дисцип"),
      room: col("ауд"),
      teacher: col("препод"),
      date: col("дат"),
      day: col("день"),
      subgroup: col("подгруп"),
    };

    rows.slice(1).forEach(r => {
      // пропуск пустых строк
      if (r.every(c => !c.trim())) return;

      const tr = document.createElement("tr");

      [
        r[COLS.group],
        r[COLS.pair],
        r[COLS.subgroup],
        r[COLS.subject],
        r[COLS.room],
        r[COLS.teacher],
        r[COLS.date],
        r[COLS.day],
      ].forEach(v => {
        const td = document.createElement("td");
        td.textContent = v && v.trim() ? v : "";
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    statusEl.textContent = "✔ Расписание загружено корректно";
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
