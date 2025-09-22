// Работа с сервером

import { showSpinner, hideSpinner } from './ui.js';

const API_URL = 'https://jsonplaceholder.typicode.com';

// Загрузка задач с сервера
export async function loadTasksFromServer() {
    try {
        showSpinner();
        const response = await fetch(`${API_URL}/users/1/todos`);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Произошла ошибка:', error);
        throw new Error('Ошибка при выполнении запроса \u{1F641} \nНажмите здесь, чтобы попробовать снова');
    } finally {
        hideSpinner();
    }
}

// Сохранение задачи на сервере
export async function saveServerTask(task) {
    try {
        showSpinner();
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: task.title,
                completed: task.completed,
                userId: task.userId
            })
        });
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Произошла ошибка:', error);
        throw new Error('Не получилось добавить задачу \u{1F641} \nНажмите здесь, чтобы попробовать снова');
    } finally {
        hideSpinner();
    }
}

// Обновление статуса задачи на сервере
export async function updateTaskStatus(id, completed) {
    try {
        showSpinner();
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                completed: completed,
            })
        });
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Произошла ошибка:', error);
        throw new Error('Не получилось отметить \u{1F641} \nНажмите здесь, чтобы попробовать снова');
    } finally {
        hideSpinner();
    }
}

// Удаление задачи на сервере
export async function deleteServerTask(id) {
    try {
        showSpinner();
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Произошла ошибка:', error);
        throw new Error('Не получилось удалить \u{1F641} \nНажмите здесь, чтобы попробовать снова');
    } finally {
        hideSpinner();
    }
}
