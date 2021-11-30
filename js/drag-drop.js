import {taskContainers, changeCount} from './create-task.js';
const binEl = document.querySelector('.garbage__container');

const checkTaskList = () => {
    taskContainers.forEach((container) => {
        (container.children.length === 0) ? container.classList.remove(`full`) : container.classList.add(`full`);
    });
}

const getNextElement = (cursorPosition, currentElement) => {
    // Получаем объект с размерами и координатами
    const currentElementCoord = currentElement.getBoundingClientRect();
    // Находим вертикальную координату центра текущего элемента
    const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
  
    // Если курсор выше центра элемента, возвращаем текущий элемент
    // В ином случае — следующий DOM-элемент
    const nextElement = (cursorPosition < currentElementCenter) ?
        currentElement :
        currentElement.nextElementSibling;
  
    return nextElement;
};

const removeHover = (evt) => {
    evt.target.classList.remove('hover');
    binEl.removeEventListener('mouseout', removeHover);
};

const dropTaskBin = (evt) => {
    const activeElement = document.querySelector(`.selected`);
    evt.preventDefault();
    let elemBelow = document.elementFromPoint(evt.clientX, evt.clientY);

    if (elemBelow === evt.target) {
        evt.target.classList.add('hover');
    } 

    activeElement && activeElement.remove();
    binEl.removeEventListener(`dragover`, dropTaskBin);
    changeCount();
};

const dropTask = (evt, container) => {

    if (!container.classList.contains(`full`)) {
        
        // Разрешаем сбрасывать элементы в эту область
        evt.preventDefault();
        // Находим перемещаемый элемент
        const activeElement = document.querySelector(`.selected`);
    
        // Вставляем activeElement в конец списка
        container.appendChild(activeElement);
    
        changeCount();
    } else {
        // Разрешаем сбрасывать элементы в эту область
        evt.preventDefault();
                
        // Находим перемещаемый элемент
        const activeElement = document.querySelector(`.selected`);
        // Находим элемент, над которым в данный момент находится курсор
        const currentElement = evt.target;
        // Проверяем, что событие сработало:
        // 1. не на том элементе, который мы перемещаем,
        // 2. именно на элементе списка
        const isMoveable = activeElement !== currentElement &&
        currentElement.classList.contains(`tasks-containers__task`);
    
        // Если нет, прерываем выполнение функции
        if (!isMoveable) {
            return;
        }

        // evt.clientY — вертикальная координата курсора в момент,
        // когда сработало событие
        const nextElement = getNextElement(evt.clientY, currentElement);

        // Проверяем, нужно ли менять элементы местами
        if (
            nextElement && 
            activeElement === nextElement.previousElementSibling ||
            activeElement === nextElement
        ) {
            // Если нет, выходим из функции, чтобы избежать лишних изменений в DOM
            return;
        }
        // Вставляем activeElement перед nextElement
        container.insertBefore(activeElement, nextElement);

        changeCount();
    }
};

const takeAndDropEl = () => {

    taskContainers.forEach((container) => {
        container.addEventListener(`dragstart`, (evt) => {
            evt.target.classList.add(`selected`);
            checkTaskList();
            binEl.addEventListener(`dragover`, dropTaskBin);
            binEl.addEventListener('mouseout', removeHover);
          })
        
        container.addEventListener(`dragend`, (evt) => {
            evt.target.classList.remove(`selected`);
        });

        container.addEventListener(`dragover`, (evt) => dropTask(evt, container));
    });
};

export {takeAndDropEl};