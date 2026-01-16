import mysql.connector
from config import DB_CONFIG

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)


def fetch_and_claim_task(cursor):
    """
    Atomically fetch and lock one pending task.
    Returns task dict or None.
    """
    cursor.execute("""
        SELECT id, type, input_text
        FROM tasks
        WHERE status = 'pending'
        ORDER BY created_at
        LIMIT 1
        FOR UPDATE
    """)
    task = cursor.fetchone()

    if not task:
        return None

    cursor.execute("""
        UPDATE tasks
        SET status = 'processing',
            locked_at = NOW()
        WHERE id = %s
    """, (task['id'],))

    return task

