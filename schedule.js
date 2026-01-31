// Загружаем CSV (или Google Sheets в CSV)
fetch('data.csv')
  .then(res => res.text())
  .then(text => {
    const lines = text.trim().split('\n');

    // Находим заголовки и их индексы
    const headers = lines[0].split(';').map(h => h.trim());
    const idxGroup = headers.indexOf('Группа');
    const idxPair = headers.indexOf('Пара');
    const idxLesson = headers.indexOf('Дисциплина');
    const idxTeacher = headers.indexOf('Преподаватель');
    const idxAud = headers.indexOf('Аудитория');
    const idxSubgroup = headers.indexOf('Подгр.'); // если есть

    // Преобразуем строки в объекты
    const schedule = lines.slice(1).map(line => {
      const cols = line.split(';');
      return {
        group: cols[idxGroup] || '',
        pair: cols[idxPair] || '',
        lesson: cols[idxLesson] || '',
        teacher: cols[idxTeacher] || '',
        aud: cols[idxAud] || '',
        subgroup: cols[idxSubgroup] || ''
      };
    });

    // Пример: выводим в консоль
    console.log(schedule);

    // Здесь можно рендерить расписание на странице
    renderSchedule(schedule);
  });

// Функция рендеринга (пример)
function renderSchedule(schedule) {
  const container = document.getElementById('schedule');
  container.innerHTML = '';
  schedule.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${item.group} | ${item.pair} | ${item.lesson} | ${item.teacher} | ${item.aud}`;
    container.appendChild(div);
  });
}
