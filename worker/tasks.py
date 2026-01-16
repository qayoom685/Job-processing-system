def execute_task(task_type, text):
    if task_type == 'uppercase':
        return text.upper()
    elif task_type == 'reverse':
        return text[::-1]
    else:
        raise ValueError(f'Unsupported task type: {task_type}')
