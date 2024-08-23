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

        // Löschen-Button als Icon
        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = '❌';
        deleteBtn.classList.add('delete-btn');
        newTaskDiv.appendChild(deleteBtn);

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

        // Event Listener für mobiles Verschieben (Tap zum Verschieben)
        newTaskDiv.addEventListener('click', function () {
            alert('Lange gedrückt halten, um zu verschieben');
            this.classList.toggle('selected-task');
        });

        return newTaskDiv;
    }

    // Mobilgeräte: Drag & Drop-Alternative
    const dropzones = document.querySelectorAll('.task-table, .priority-table, .pool-table');
    let selectedTask = null;

    dropzones.forEach(zone => {
        zone.addEventListener('click', function (e) {
            const selected = document.querySelector('.selected-task');
            if (selected) {
                zone.appendChild(selected);
                selected.classList.remove('selected-task');
                selectedTask = null;
            }
        });
    });
});
