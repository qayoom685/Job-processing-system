import time
from db import get_connection, fetch_and_claim_task
from tasks import execute_task
from config import POLL_INTERVAL


def complete_task(cursor, task_id, result):
    cursor.execute("""
        UPDATE tasks
        SET status = 'completed',
            result = %s
        WHERE id = %s
    """, (result, task_id))


def fail_task(cursor, task_id, error):
    cursor.execute("""
        UPDATE tasks
        SET status = 'failed',
            error = %s
        WHERE id = %s
    """, (str(error), task_id))


def main():
    print("Worker started...")

    while True:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        try:
            # 1️⃣ Start transaction
            conn.start_transaction()

            # 2️⃣ Fetch & lock task
            task = fetch_and_claim_task(cursor)

            if not task:
                conn.commit()
                time.sleep(POLL_INTERVAL)
                continue

            # 3️⃣ Commit lock
            conn.commit()

            try:
                # 4️⃣ Execute task
                result = execute_task(task['type'], task['input_text'])

                # 5️⃣ Mark completed
                complete_task(cursor, task['id'], result)

            except Exception as e:
                # 6️⃣ Mark failed
                fail_task(cursor, task['id'], e)

            conn.commit()

        except Exception as e:
            conn.rollback()
            print("Worker error:", e)

        finally:
            cursor.close()
            conn.close()

        time.sleep(POLL_INTERVAL)


if __name__ == '__main__':
    main()
