const formEl = document.querySelector('.tasks__form');
const taskInput = formEl.querySelector('#task');
const taskTypeEl = formEl.querySelector('#type');
const everyDayContainerEl = document.querySelector('#everyday');
const notUrgentContainerEl = document.querySelector('#not-urgent');
const taskContainers = document.querySelectorAll('.tasks-containers__task-list');
const taskTemplate = document.querySelector('#task-template').content.querySelector('.tasks-containers__task');
const taskAddEl = document.querySelector('.form__addbutton');

const changeCount = () => {
    taskContainers.forEach((container) => {
        const tasks = container.querySelectorAll('.tasks-containers__task');

        if (tasks) {
            let count = 1;
            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                task.querySelector('.tasks-containers__count').textContent = count;
                count++;
            }
        }
    });
};

const checkTask = (task) => {
    if (taskTypeEl.value === 'everyday') {
        everyDayContainerEl.appendChild(task);
    } else {
        notUrgentContainerEl.appendChild(task);
    }
};

const showTask = () => {
    const task = taskTemplate.cloneNode(true);
    const taskNameEl = task.querySelector('.tasks-containers__sub-title');
    const deleteTask = task.querySelector('.tasks-containers-task__delete');
    
    if (taskInput.value) {
        taskNameEl.textContent = taskInput.value;
        checkTask(task);
    }
    
    const onDeleteTaskClick = () => {
        task.remove();
        changeCount();
    };
    
    deleteTask.addEventListener('click', onDeleteTaskClick);
};

const resetTask = () => {
    formEl.reset();
};


const onTaskAddClick = () => {
    showTask();
    resetTask();
    changeCount();
};

const onTaskInput = () => {
    const onDocumentKeydown = (evt) => {
       if  (evt.key === 'Enter') {
        evt.preventDefault();
        showTask();
        resetTask();
        changeCount();
       };
    }
    document.addEventListener('keydown', onDocumentKeydown);
};

taskInput.addEventListener('input', onTaskInput)

const setTaskListener = () => {
    taskAddEl.addEventListener('click', onTaskAddClick);
    taskInput.addEventListener('input', onTaskInput);
};

export {setTaskListener, changeCount, taskContainers};
