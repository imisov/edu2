import '../css/normalize.css';
import '../css/base.css';
import 'toastify-js/src/toastify.css';
import '../css/new-task.css';
import '../css/actions.css';
import '../css/list.css';
import '../css/media.css';

import Toastify from 'toastify-js';

import {
    loadTasksFromServer,
    saveServerTask,
    updateTaskStatus,
    deleteServerTask
} from './api.js';

import {
    taskInput,
    selectAllCheckboxes,
    filterSelect,
    renderTasks,
    renderVisibleTasks,
    showNoTasksMessage,
    deleteTaskElement,
    initUIHandlers,
    updateSortingVisualization,
    getSelectedTasks
} from './ui.js';

import {
    saveLocalTasks,
    getTasks,
    setTasks,
    addTask as addTaskState,
    toggleTask as toggleTaskState,
    deleteTask as deleteTaskState,
    getVisibleTasks
} from './state.js';

// Состояния фильтрации, поиска и сортировки
let currentFilter = 'all';
let currentSearch = '';
let currentSorting = 'old-first';

// Обновление отображаемого списка задач
function updateTaskList() {
    const tasksToShow = getVisibleTasks(currentFilter, currentSearch, currentSorting);
    renderVisibleTasks(tasksToShow, toggleTask, deleteTask);
    updateSortingVisualization(currentSorting);
}

// Загрузка задач
async function loadTasks() {
    try {
        // Пробуем загрузить с сервера
        const serverTasks = await loadTasksFromServer();
        setTasks(serverTasks);
        renderTasks(getTasks(), toggleTask, deleteTask);
        showNoTasksMessage(getTasks());
    } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
        errorNotification(error.message, loadTasks);

        // Пробуем загрузить из localStorage при ошибке
        const localTasks = localStorage.getItem('tasks');
        if (localTasks) {
            setTasks(JSON.parse(localTasks));
            renderTasks(getTasks(), toggleTask, deleteTask);
        }
        showNoTasksMessage(getTasks());
    }
}

// Добавление новой задачи
async function addTask(text, userId = 1) {
    const newTask = addTaskState(text, userId);
    renderTasks(getTasks(), toggleTask, deleteTask);

    try {
        showNoTasksMessage(getTasks());
        await saveServerTask(newTask);
        saveLocalTasks(getTasks());
    } catch (error) {
        console.error('Ошибка при добавлении новой задачи:', error);
        errorNotification(error.message, () => addTask(text, userId));
        deleteTaskState(newTask.id);
        deleteTaskElement(newTask.id);
        showNoTasksMessage(getTasks());
    }
}

// Переключение статуса задачи (выполнено/не выполнено)
async function toggleTask(id) {
    const originalState = toggleTaskState(id);

    try {
        await updateTaskStatus(id, !originalState);
        saveLocalTasks(getTasks());
    } catch (error) {
        console.error('Ошибка при переключении статуса задачи:', error);
        errorNotification(error.message, () => toggleTask(id));
        toggleTaskState(id);
        renderTasks(getTasks(), toggleTask, deleteTask);
    }
}

// Удаление задачи
async function deleteTask(id) {
    try {
        await deleteServerTask(id);
        deleteTaskState(id);
        deleteTaskElement(id);
        showNoTasksMessage(getTasks());
    } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
        errorNotification(error.message, () => deleteTask(id));
    }
}

// Обработка событий

// Добавление новой задачи
function handleFormSubmit(event) {
    event.preventDefault();

    if (taskInput.value.trim()) {
        addTask(taskInput.value);
        taskInput.value = '';
    } else {
        errorNotification('Сначала введите задачу!');
    }
}

// Фильтрация задач
function handleFilterChange() {
    currentFilter = filterSelect.value;
    updateTaskList();
}

// Сортировка задач
function handleSortingClick(sortingType) {
    currentSorting = sortingType;
    updateTaskList();
}

// Массовые действия

// Выбрать все задачи
function handleSelectAll() {
    const selectCheckboxes = document.querySelectorAll('.tasks__select');
    selectCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckboxes.checked;
    });
}

// Удаление выбранных задач
async function handleDeleteSelected() {
    const selectedIds = getSelectedTasks();
    let hasError = false;
    let errorMessage = '';

    for (const id of selectedIds) {
        try {
            await deleteServerTask(id);
            deleteTaskState(id);
            deleteTaskElement(id);

            renderTasks(getTasks(), toggleTask, deleteTask);
            selectAllCheckboxes.checked = false;
            showNoTasksMessage(getTasks());
        } catch (error) {
            console.error('Ошибка при массовом удалении', error);
            hasError = true;
            errorMessage = error.message;
        }
    }

    if (hasError) {
        errorNotification(errorMessage, handleDeleteSelected);
    }
}

// Отметить выбранные задачи как выполненные
async function handleDoneSelected() {
    const selectedIds = getSelectedTasks();
    let hasError = false;
    let errorMessage = '';

    for (const id of selectedIds) {
        try {
            await updateTaskStatus(id, true);
            const task = getTasks().find(t => t.id === id);
            if (task) task.completed = true;

            saveLocalTasks(getTasks());
            renderTasks(getTasks(), toggleTask, deleteTask);
            selectAllCheckboxes.checked = false;
        } catch (error) {
            console.error('Ошибка при массовой отметке', error);
            hasError = true;
            errorMessage = error.message;
        }
    }

    if (hasError) {
        errorNotification(errorMessage, handleDoneSelected);
    }
}

// Поиск
function handleSearchInput(searchText) {
    currentSearch = searchText;
    updateTaskList();
}

// Всплывающее уведомление
function errorNotification(message, retryFn) {
    Toastify({
        text: message,
        gravity: 'bottom',
        duration: 10000,
        close: true,
        onClick: () => {
            if (typeof retryFn === 'function') {
                retryFn();
            }
        },
        style: {
            background: 'linear-gradient(to right, #00b09b, #96c93d)',
        }
    }).showToast();
}

// Инициализация приложения
function initApp() {
    initUIHandlers(
        handleFormSubmit,
        handleFilterChange,
        handleSortingClick,
        handleSelectAll,
        handleDeleteSelected,
        handleDoneSelected,
        handleSearchInput
    );

    // Загружаем задачи при загрузке страницы
    loadTasks().then(() => {
        updateTaskList();
    });
}

// Запуск приложения
initApp();
