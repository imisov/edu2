// Работа с сервером

import { showSpinner, hideSpinner } from './ui.js';

// Класс-обертка для работы с API
class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        try {
            showSpinner();
            const response = await fetch(url, options);
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

    get(endpoint) {
        return this.request(endpoint);
    }

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }

    patch(endpoint, body) {
        return this.request(endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }

    delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

// Экземпляр класса для работы с API
const apiClient = new ApiClient('https://jsonplaceholder.typicode.com');

// Загрузка задач с сервера
export async function loadTasksFromServer() {
    return apiClient.get('/users/1/todos');
}

// Сохранение задачи на сервере
export async function saveServerTask(task) {
    return apiClient.post('/todos', {
        title: task.title,
        completed: task.completed,
        userId: task.userId
    });
}

// Обновление статуса задачи на сервере
export async function updateTaskStatus(id, completed) {
    return apiClient.patch(`/todos/${id}`, {
        completed: completed
    });
}

// Удаление задачи на сервере
export async function deleteServerTask(id) {
    return apiClient.delete(`/todos/${id}`);
}
