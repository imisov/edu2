// Состояние и бизнес-логика

class Tasks {
    constructor(tasks) {
        this.tasks = tasks || [];
    }

    // Сохранение задач в localStorage
    saveLocalTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Получение задач
    getTasks() {
        return this.tasks;
    }

    // Установка задач
    setTasks(newTasks) {
        this.tasks = newTasks;
        this.saveLocalTasks();
    }

    // Добавление новой задачи
    addTask(text, userId = 1) {
        const newTask = {
            userId,
            id: new Date().valueOf(),
            title: text,
            completed: false,
        };
        this.tasks.push(newTask);
        this.saveLocalTasks();
        return newTask;
    }

    // Переключение статуса задачи
    toggleTask(id) {
        const targetTask = this.tasks.find(task => task.id === id);
        if (targetTask) {
            targetTask.completed = !targetTask.completed;
            this.saveLocalTasks();
            return targetTask.completed;
        }
        return null;
    }

    // Удаление задачи
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveLocalTasks();
    }

    // Фильтрация задач
    filterTasks(filterType) {
        switch (filterType) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    // Сортировка задач
    sortTasks(sortingType, sorted = this.tasks) {
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
    getVisibleTasks(filterType, searchText, sortingType) {
        let result = this.filterTasks(filterType);
        if (searchText && searchText.trim() !== '') {
            result = result.filter(task =>
                task.title.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        return this.sortTasks(sortingType, result);
    }
}

// Экземпляр для использования во всем приложении
export const tasksState = new Tasks(JSON.parse(localStorage.getItem('tasks')) || []);

// Прокси-функции для удобного импорта
export const saveLocalTasks = () => tasksState.saveLocalTasks();
export const getTasks = () => tasksState.getTasks();
export const setTasks = (tasks) => tasksState.setTasks(tasks);
export const addTask = (text, userId = 1) => tasksState.addTask(text, userId);
export const toggleTask = (id) => tasksState.toggleTask(id);
export const deleteTask = (id) => tasksState.deleteTask(id);
export const filterTasks = (filterType) => tasksState.filterTasks(filterType);
export const sortTasks = (sortingType, sorted) => tasksState.sortTasks(sortingType, sorted);
export const getVisibleTasks = (filterType, searchText, sortingType) => tasksState.getVisibleTasks(filterType, searchText, sortingType);
