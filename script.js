document.addEventListener('DOMContentLoaded', function () {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskPool = document.getElementById('task-pool');

    addTaskButton.addEventListener('click', function () {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const newTaskDiv = createTaskElement(taskText);
            taskPool.appendChild(newTaskDiv);
            newTaskInput.value = '';
        }
    });

    function createTaskElement(taskText) {
        const newTaskDiv = document.createElement('div');
        newTaskDiv.textContent = taskText;

        // Checkbox zum Markieren
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        newTaskDiv.prepend(checkbox);

        // Löschen-Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('delete-btn');
        newTaskDiv.appendChild(deleteBtn);

        // Event Listener für Drag & Drop
        newTaskDiv.draggable = true;
        newTaskDiv.addEventListener('dragstart', dragStart);
        newTaskDiv.addEventListener('dragend', dragEnd);

        // Event Listener für Löschen
        deleteBtn.addEventListener('click', function () {
            newTaskDiv.remove();
        });

        // Priorität setzen (Optional)
        const priority = prompt("Priorität eingeben: hoch, mittel, niedrig").toLowerCase();
        if (priority === 'hoch') {
            newTaskDiv.classList.add('high-priority');
        } else if (priority === 'mittel') {
            newTaskDiv.classList.add('medium-priority');
        } else {
            newTaskDiv.classList.add('low-priority');
        }

        return newTaskDiv;
    }

    const tasks = document.querySelectorAll('.task-table div, .priority-table div, .pool-table div');
    const dropzones = document.querySelectorAll('.task-table, .priority-table, .pool-table');

    tasks.forEach(task => {
        task.draggable = true;
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);
    });

    dropzones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', dropTask);
    });

    function dragStart(e) {
        this.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.textContent);
    }

    function dragEnd() {
        this.classList.remove('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dropTask(e) {
        e.preventDefault();
        const taskText = e.dataTransfer.getData('text/plain');
        const newTaskDiv = createTaskElement(taskText);
        this.appendChild(newTaskDiv);
    }
});
