from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import subprocess

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite DB
def init_sqlite():
    conn = sqlite3.connect("demo.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            department TEXT,
            salary INTEGER
        )
    ''')
    cursor.execute('SELECT COUNT(*) FROM employees')
    if cursor.fetchone()[0] == 0:
        cursor.executemany('''
            INSERT INTO employees (name, department, salary)
            VALUES (?, ?, ?)
        ''', [
            ("Alice", "Engineering", 70000),
            ("Bob", "Sales", 50000),
            ("Charlie", "HR", 45000)
        ])
    conn.commit()
    conn.close()

init_sqlite()

@app.post("/execute")
async def execute_code(request: Request):
    body = await request.json()
    code = body.get("code", "")
    language = body.get("language", "")

    if language == "python":
        try:
            result = subprocess.check_output(
                ["python3", "-c", code], stderr=subprocess.STDOUT, timeout=5
            )
            return {"output": result.decode()}
        except subprocess.CalledProcessError as e:
            return {"output": e.output.decode()}
        except Exception as e:
            return {"output": str(e)}

    elif language == "sql":
        try:
            conn = sqlite3.connect("demo.db")
            cursor = conn.cursor()
            cursor.execute(code)
            rows = cursor.fetchall()
            headers = [desc[0] for desc in cursor.description] if cursor.description else []
            conn.commit()
            conn.close()

            if not rows:
                return {"output": "Query executed successfully (no results)."}

            # Format as tabular string
            output = "\t".join(headers) + "\n"
            output += "\n".join("\t".join(map(str, row)) for row in rows)
            return {"output": output}

        except Exception as e:
            return {"output": f"SQL Error: {str(e)}"}

    return {"output": "Unsupported language"}
