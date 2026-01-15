CREATE TABLE tasks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    type VARCHAR(50) NOT NULL,
    input_text TEXT NOT NULL,

    status ENUM('pending', 'processing', 'completed', 'failed')
        NOT NULL DEFAULT 'pending',

    result TEXT NULL,
    error TEXT NULL,

    locked_at DATETIME NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_status ON tasks (status);
CREATE INDEX idx_tasks_locked_at ON tasks (locked_at);
