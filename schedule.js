<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Расписание</title>
<style>
  body { font-family: sans-serif; padding: 20px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
  th { background: #f0f0f0; }
</style>
</head>
<body>

<h1>Расписание</h1>
<div id="schedule"></div>

<script>
// Загружаем CSV с Google Sheets
fetch('data.csv')
  .then(res => res.text())
  .then(text => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(';').map(h => h.trim().toLowerCase());

    // Находим нужные колонки по имени
    const idx = (name) => headers.findIndex(h => h.includes(name.toLowerCase()));

    const schedule = lines.slice(1).map(line => {
      const cols = line.split(';');
      return {
        date: cols[idx('дата')] || '',
        day: cols[idx('день недели')] || '',
        group: cols[idx('группа')] || '',
        pair: cols[idx('пара')] || '',
        lesson: cols[idx('дисциплина')] || '',
        teacher: cols[idx('преподаватель')] || '',
        aud: cols[idx('аудитория')] || '',
        subgroup: cols[idx('подгр.')] || ''
      };
    });

    renderSchedule(schedule);
  });

function renderSchedule(schedule) {
  // Группируем по дате и группе
  const grouped = {};
  schedule.forEach(item => {
    if(!grouped[item.date]) grouped[item.date] = {};
    if(!grouped[item.date][item.group]) grouped[item.date][item.group] = [];
    grouped[item.date][item.group].push(item);
  });

  const container = document.getElementById('schedule');
  container.innerHTML = '';

  for(const date in grouped){
    const dateDiv = document.createElement('div');
    dateDiv.innerHTML = `<h2>${date}</h2>`;
    
    for(const group in grouped[date]){
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      thead.innerHTML = `<tr>
        <th>Группа</th><th>Пара</th><th>Дисциплина</th><th>Преподаватель</th><th>Аудитория</th><th>Подгр.</th>
      </tr>`;
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      grouped[date][group].forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item.group}</td><td>${item.pair}</td><td>${item.lesson}</td>
                        <td>${item.teacher}</td><td>${item.aud}</td><td>${item.subgroup}</td>`;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      dateDiv.appendChild(table);
    }

    container.appendChild(dateDiv);
  }
}
</script>

</body>
</html>
