import csv
import json
import re

INPUT = "raw.csv"
OUTPUT = "data.json"

date = None
weekday = None
group = None
pair = None
lesson = None

result = []

def clean(x):
    return x.strip().replace("\n", " ") if x else None

with open(INPUT, encoding="utf-8") as f:
    rows = list(csv.reader(f))

for i, row in enumerate(rows):
    # дата + день
    if len(row) > 5 and row[5]:
        m = re.search(r"\d{2}\.\d{2}\.\d{4}", row[5])
        if m:
            date = m.group()
            weekday = row[5].split("\n")[-1]

    # группа
    if row and row[0].isdigit():
        group = row[0]

    # пара / урок
    if len(row) > 2 and row[1].isdigit() and row[2].isdigit():
        pair = int(row[1])
        lesson = int(row[2])

    subj1 = clean(row[5]) if len(row) > 5 else None
    room1 = clean(row[6]) if len(row) > 6 else None
    subj2 = clean(row[7]) if len(row) > 7 else None
    room2 = clean(row[8]) if len(row) > 8 else None

    if subj1 or subj2:
        teacher_row = rows[i + 1] if i + 1 < len(rows) else []
        teacher1 = clean(teacher_row[5]) if len(teacher_row) > 5 else None
        teacher2 = clean(teacher_row[7]) if len(teacher_row) > 7 else None

        if subj1:
            result.append({
                "date": date,
                "weekday": weekday,
                "group": group,
                "subgroup": 1 if subj2 else None,
                "pair": pair,
                "lesson": lesson,
                "subject": subj1,
                "teacher": teacher1,
                "room": room1
            })

        if subj2:
            result.append({
                "date": date,
                "weekday": weekday,
                "group": group,
                "subgroup": 2,
                "pair": pair,
                "lesson": lesson,
                "subject": subj2,
                "teacher": teacher2,
                "room": room2
            })

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
