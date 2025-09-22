// Отрисовка и обработчики событий

// Элементы DOM
export const spinner = document.getElementById('spinner');
export const tasksSection = document.getElementById('tasks');
export const taskForm = document.getElementById('new-task-form');
export const taskInput = document.getElementById('new-task-input');
export const taskList = document.getElementById('task-list');
export const selectAllCheckboxes = document.getElementById('select-all');
export const selectCheckboxes = document.querySelectorAll('.tasks__select');
export const filterSelect = document.getElementById('filters');
export const searchForm = document.getElementById('search-form');
export const searchInput = document.getElementById('search-input');
export const sortingBtn = document.getElementById('sorting-btn');
export const sortingList = document.getElementById('sorting-list');
export const sortingItems = document.querySelectorAll('.sorting__item');
export const sortingItemSvg = document.querySelectorAll('.sorting__item-svg');
export const massActions = document.getElementById('mass-actions');

// Показать спиннер
export function showSpinner() {
    if (spinner) spinner.style.display = 'flex';
}

// Скрыть спиннер
export function hideSpinner() {
    if (spinner) spinner.style.display = 'none';
}

// Создание HTML элемента задачи
export function createTaskElement(task, toggleTaskCallback, deleteTaskCallback) {
    const taskElement = document.createElement('li');
    taskElement.classList.add('tasks__line');
    taskElement.setAttribute('role', 'listitem');

    // Чекбокс массового выбора
    const selectCheckbox = document.createElement('input');
    selectCheckbox.type = 'checkbox';
    selectCheckbox.name = `task${task.id}`;
    selectCheckbox.classList.add('tasks__select');
    taskElement.appendChild(selectCheckbox);

    // Чекбокс задачи, текст и кнопка удаления
    const checkboxWrap = document.createElement('div');
    checkboxWrap.classList.add('tasks__checkbox-wrap');

    const markCheckbox = document.createElement('input');
    markCheckbox.type = 'checkbox';
    markCheckbox.name = `task${task.id}`;
    markCheckbox.id = `task${task.id}`;
    markCheckbox.classList.add('tasks__mark');
    if (task.completed) markCheckbox.checked = true;
    markCheckbox.addEventListener('change', () => toggleTaskCallback(task.id));

    const label = document.createElement('label');
    label.setAttribute('for', `task${task.id}`);
    label.classList.add('tasks__text');
    if (task.completed) label.classList.add('completed');
    label.textContent = task.title;

    checkboxWrap.appendChild(markCheckbox);
    checkboxWrap.appendChild(label);
    taskElement.appendChild(checkboxWrap);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('tasks__btn-del', 'btn-reset');
    deleteButton.ariaLabel = 'Удалить задачу';
    deleteButton.addEventListener('click', () => deleteTaskCallback(task.id));

    // Иконка корзины
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('height', '24px');
    svg.setAttribute('viewBox', '0 -960 960 960');
    svg.setAttribute('width', '24px');
    svg.setAttribute('fill', '#28283d');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z');

    svg.appendChild(path);
    svg.ariaHidden = 'true';
    deleteButton.appendChild(svg);
    taskElement.appendChild(deleteButton);

    taskList.append(taskElement);
}

// Проверка наличия задач и отображение сообщения об их отсутствии
export function showNoTasksMessage(tasks) {
    const noTasksElement = document.createElement('p');
    noTasksElement.classList.add('tasks__null');
    noTasksElement.textContent = 'Задач нет!';

    const findNoTasksElement = document.querySelector('.tasks__null');
    if (tasks.length === 0) {
        if (!findNoTasksElement) tasksSection.append(noTasksElement);
    } else {
        if (findNoTasksElement) findNoTasksElement.remove();
    }
}

// Отображение всех задач
export function renderTasks(tasks, toggleTaskCallback, deleteTaskCallback) {
    taskList.innerHTML = '';
    tasks.forEach(task => createTaskElement(task, toggleTaskCallback, deleteTaskCallback));

    // Отображение svg-галки только у сортировки по умолчанию (сначала старые)
    sortingItemSvg.forEach(item => item.setAttribute('display', 'none'));
    const oldFirst = document.getElementById('old-first');
    if (oldFirst) oldFirst.querySelector('.sorting__item-svg')?.setAttribute('display', 'block');
}

// Отображение отфильтрованных задач
export function renderVisibleTasks(visibleTasks, toggleTaskCallback, deleteTaskCallback) {
    taskList.innerHTML = '';
    visibleTasks.forEach(task => createTaskElement(task, toggleTaskCallback, deleteTaskCallback));
    showNoTasksMessage(visibleTasks);
}

// Обновление отображения сортировки
export function updateSortingVisualization(sortingType) {
    sortingItemSvg.forEach(item => item.setAttribute('display', 'none'));

    const activeElement = document.getElementById(sortingType);
    if (activeElement) {
        activeElement.querySelector('.sorting__item-svg')?.setAttribute('display', 'block');
    }
}

// Удаление HTML элемента задачи
export function deleteTaskElement(id) {
    const deleteTaskInput = document.getElementById(`task${id}`);
    if (deleteTaskInput) {
        const deleteTaskElement = deleteTaskInput.closest('.tasks__line');
        if (deleteTaskElement) deleteTaskElement.remove();
    }
}

// Получение id выбранных задач (чекбоксы)
export function getSelectedTasks() {
    const selectCheckboxes = document.querySelectorAll('.tasks__select:checked');
    return Array.from(selectCheckboxes).map(checkbox => {
        const taskElement = checkbox.closest('.tasks__line');
        const taskInput = taskElement.querySelector('.tasks__mark');
        return parseInt(taskInput.id.slice(4));
    });
}

// Инициализация обработчиков событий UI
export function initUIHandlers(
    formSubmitHandler,
    filterChangeHandler,
    sortingClickHandler,
    selectAllHandler,
    deleteSelectedHandler,
    doneSelectedHandler,
    searchInputHandler,
) {

    // Обработчик отправки формы (создание задачи)
    taskForm.addEventListener('submit', formSubmitHandler);

    // Очистка поля ввода задачи по Escape
    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            taskInput.value = '';
        }
    });

    // Обработчик выбора фильтра
    filterSelect.addEventListener('change', filterChangeHandler);

    // Сортировка. Индекс выбранного варианта сортировки
    let currentIndex = 0;

    // Обработчик клика по кнопке сортировки (открытие/закрытие выпадающего списка)
    sortingBtn.addEventListener('click', (event) => {
        event.stopPropagation();

        if (!sortingList) return;
        const isActive = sortingList.classList.toggle('sorting__list--active');
        sortingBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');

        if (isActive && sortingItems.length > 0) {
            sortingItems[currentIndex].focus();
        }
    });

    // Закрытие списка при клике вне кнопки и списка
    document.addEventListener('click', (event) => {
        if (!sortingBtn.contains(event.target) && !sortingList.contains(event.target)) {
            sortingList.classList.remove('sorting__list--active');
            sortingBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Закрываем выпадающий список сортировки и возвращаем фокус на кнопку
    function closeSortingList() {
        sortingList.classList.remove('sorting__list--active');
        sortingBtn.setAttribute('aria-expanded', 'false');
        sortingBtn.focus();
    }

    // Обработка клавиатуры для навигации и выбора варианта сортировки из выпадающего списка
    sortingList.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                currentIndex = (currentIndex - 1 + sortingItems.length) % sortingItems.length;
                sortingItems[currentIndex].focus();
                break;
            case 'ArrowDown':
                event.preventDefault();
                currentIndex = (currentIndex + 1) % sortingItems.length;
                sortingItems[currentIndex].focus();
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                const selectedId = sortingItems[currentIndex].id;
                sortingClickHandler(selectedId);
                closeSortingList();
                break;
            case 'Escape':
                event.preventDefault();
                closeSortingList();
                break;
        }
    });

    // Обработка кликов по элементам списка сортировки
    sortingList.addEventListener('click', (event) => {
        const targetId = event.target.id;
        sortingClickHandler(targetId);

        for (let i = 0; i < sortingItems.length; i++) {
            if (sortingItems[i].id === targetId) {
                currentIndex = i;
                break;
            }
        }

        closeSortingList();
    });

    // Обработчик кликов по кнопкам массовых действий
    massActions.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('mass-actions__select-all')) {
            selectAllHandler();
        } else if (target.classList.contains('mass-actions__btn--done')) {
            doneSelectedHandler();
        } else if (target.classList.contains('mass-actions__btn--delete')) {
            deleteSelectedHandler();
        }
    });

    // Поиск. Сброс поиска по Enter. Очистка поля по Escape
    searchInput.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                break;
            case 'Escape':
                event.preventDefault();
                searchInput.value = '';
                searchInputHandler('');
                break;
        }
    });

    // Функция дебаунса
    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Поиск с дебаунсом 400 мс
    const debouncedSearchHandler = debounce(searchInputHandler, 400);
    searchInput?.addEventListener('input', (event) => {
        debouncedSearchHandler(event.target.value);
    });
}
