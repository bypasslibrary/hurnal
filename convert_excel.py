import pandas as pd

# Имя вашего Excel файла
excel_file = "schedule.xlsx"

# Считаем все листы Excel
xls = pd.ExcelFile(excel_file)
all_sheets = {}

for sheet_name in xls.sheet_names:
    df = pd.read_excel(xls, sheet_name=sheet_name)
    all_sheets[sheet_name] = df.fillna("").to_dict(orient="records")

# Сохраняем в JSON
import json
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(all_sheets, f, ensure_ascii=False, indent=2)

print("data.json updated!")
