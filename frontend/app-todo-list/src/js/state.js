// Состояние и бизнес-логика

// Состояние приложения
let tasks = [];
let nextId = 1;

// Сохранение задач в localStorage
export function saveLocalTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Получение задач
export function getTasks() {
    return tasks;
}

// Установка задач
export function setTasks(newTasks) {
    tasks = newTasks;
    nextId = (tasks.length > 0) ? Math.max(...tasks.map(task => task.id), 0) + 1 : 1;
    saveLocalTasks(tasks);
}

// Добавление новой задачи
export function addTask(text, userId = 1) {
    const newTask = {
        userId,
        id: nextId++,
        title: text,
        completed: false,
    };

    tasks.push(newTask);
    saveLocalTasks(tasks);
    return newTask;
}

// Переключение статуса задачи
export function toggleTask(id) {
    const targetTask = tasks.find(task => task.id === id);
    if (targetTask) {
        targetTask.completed = !targetTask.completed;
        saveLocalTasks(tasks);
        return targetTask.completed;
    }
    return null;
}

// Удаление задачи
export function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveLocalTasks(tasks);
}

// Фильтрация задач
export function filterTasks(filterType) {
    switch (filterType) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// Сортировка задач
export function sortTasks(sortingType, sorted = tasks) {
    switch (sortingType) {
        case 'new-first':
            return [...sorted].reverse();
        case 'active-first':
            return [...sorted].sort((a, b) => Number(a.completed) - Number(b.completed));
        case 'done-first':
            return [...sorted].sort((a, b) => Number(b.completed) - Number(a.completed));
        case 'old-first':
        default:
            return sorted;
    }
}

// Получить задачи с учетом фильтра, поиска и сортировки
export function getVisibleTasks(filterType, searchText, sortingType) {
    let result = filterTasks(filterType);
    if (searchText && searchText.trim() !== '') {
        result = result.filter(task =>
            task.title.toLowerCase().includes(searchText.toLowerCase())
        );
    }
    return sortTasks(sortingType, result);
}
