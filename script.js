// Ссылка на Excel файл в вашем репозитории GitHub
const excelUrl = 'https://github.com/bypasslibrary/hurnal/raw/refs/heads/main/schedule.xlsx';

async function loadExcel() {
    try {
        const response = await fetch(excelUrl);
        if (!response.ok) throw new Error('Ошибка при загрузке Excel');
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, {type:'array'});

        // Берем первый лист
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // Конвертируем в HTML и вставляем
        const html = XLSX.utils.sheet_to_html(firstSheet);
        document.getElementById('table-container').innerHTML = html;

    } catch (err) {
        console.error(err);
        document.getElementById('table-container').innerText = 'Не удалось загрузить таблицу';
    }
}

// Загружаем при старте
loadExcel();
