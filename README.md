Job Processing System

This project implements a simple asynchronous job processing system using:

•	Node.js (Express) for the API

•	Python for background workers

•	MySQL for persistent storage

The system allows clients to submit jobs, process them asynchronously, and retrieve results without blocking the API.

---------------------------------------------------
1 Setup Instructions

1.1 Prerequisites

•	Node.js 

•	Python 

•	MySQL 

•	Git

1.2 Clone Repository

git clone <repository-url>
cd job-processing-system

1.3 Node.js API Setup

•	npm install


Dependencies

Node.js Dependencies

Installed via npm install:

{
  "express": "^4.x",
  "mysql2": "^3.x",
  "dotenv": "^16.x"
}


Explanation:

express
Used to build the HTTP API for task creation and status retrieval.

mysql2
MySQL client library used for executing raw SQL queries (no ORM).

dotenv
Loads environment variables from .env for database configuration.

Development Dependency:

{
  "nodemon": "^3.x"
}

Create .env file inside the api folder:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=jobs_db

Start API:
npm run dev

Verify:
http://localhost:3000/health

1.4 Python Worker Setup

•	cd worker

•	python -m venv venv

•	source venv/Scripts/activate   # Windows

•	pip install -r requirements.txt


Python Dependencies

Installed via pip install -r requirements.txt:

mysql-connector-python

Start worker:
python worker.py

-----------------------------------------------------
2 Database Schema Explanation

The system uses a single table: tasks.

CREATE TABLE tasks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    input_text TEXT NOT NULL,
    status ENUM('pending','processing','completed','failed') DEFAULT 'pending',
    result TEXT NULL,
    error TEXT NULL,
    locked_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

Key Columns
•	id – Unique task identifier

•	type – Task type (uppercase, reverse)

•	input_text – Input provided by client

•	status – Task lifecycle state

•	result – Output of completed task

•	error – Error message if failed

•	locked_at – Timestamp when a worker claims the task

----------------------------------------------------------
3 How Concurrency Is Handled

•	Concurrency is handled entirely at the database level using MySQL row-level locking.

•	Job Claiming Strategy

Each worker performs the following steps inside a transaction:

Selects one pending task using: SELECT ... FOR UPDATE

•	This locks the row so no other worker can select it.

•	Updates the task status to processing.

•	Commits the transaction.


Because of MySQL’s row-level locking:

•	Only one worker can claim a task

•	Multiple workers can run safely

•	Tasks are processed exactly once

----------------------------------------------
4 Known Limitations

•	No automatic retry mechanism for failed tasks

•	No scheduled cleanup for stuck tasks (can be added using locked_at)

•	Polling-based workers (not event-driven)

•	No authentication or authorization

•	Designed for simplicity, not high-throughput production workloads

--------------------------------------------------
5 Design Notes

•	Task execution is never performed inside the Node.js API

•	API remains responsive at all times

•	Raw SQL is used (no ORM)

•	No message queues or Docker, as per constraints

---------------------------------------------------
6 Assessment Compliance

•	MySQL used

•	No ORMs

•	No message queues

•	No Docker

•	Asynchronous processing

•	Concurrency-safe

•	Crash-resistant design
