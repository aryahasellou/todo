document.addEventListener('DOMContentLoaded', function () {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskPool = document.getElementById('task-pool');
    let selectedTask = null;

    addTaskButton.addEventListener('click', function () {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const newTaskDiv = createTaskElement(taskText);
            taskPool.appendChild(newTaskDiv);
            newTaskInput.value = '';
            sortTasks(taskPool); // Sortiere nach Hinzufügen einer Aufgabe
            addRotatingEmoji(newTaskDiv); // Füge Emoji-Animation hinzu
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

        if (isMobile) {
            // Mobile: Tap and Move
            newTaskDiv.addEventListener('click', function () {
                if (selectedTask) {
                    selectedTask.classList.remove('selected-task');
                }
                selectedTask = this;
                this.classList.add('selected-task');
            });
        } else {
            // Desktop: Drag and Drop
            newTaskDiv.draggable = true;
            newTaskDiv.addEventListener('dragstart', dragStart);
            newTaskDiv.addEventListener('dragend', dragEnd);
        }

        return newTaskDiv;
    }

    function dragStart(e) {
        this.classList.add('dragging');
        e.dataTransfer.setData('text/plain', this.textContent);
    }

    function dragEnd() {
        this.classList.remove('dragging');
    }

    const dropzones = document.querySelectorAll('.task-table, .priority-table, .pool-table');
    
    dropzones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', dropTask);

        if (isMobile) {
            zone.addEventListener('click', function () {
                if (selectedTask) {
                    zone.appendChild(selectedTask);
                    selectedTask.classList.remove('selected-task');
                    selectedTask = null;
                    sortTasks(zone); // Sortiere nach Verschieben einer Aufgabe
                }
            });
        }
    });

    function dragOver(e) {
        e.preventDefault();
    }

    function dropTask(e) {
        e.preventDefault();
        const taskText = e.dataTransfer.getData('text/plain');
        const newTaskDiv = createTaskElement(taskText);
        this.appendChild(newTaskDiv);
        sortTasks(this); // Sortiere nach Verschieben einer Aufgabe
        addRotatingEmoji(newTaskDiv); // Füge Emoji-Animation hinzu
    }

    function sortTasks(zone) {
        const tasksArray = Array.from(zone.children);
        tasksArray.sort((a, b) => a.textContent.localeCompare(b.textContent));
        tasksArray.forEach(task => zone.appendChild(task));
    }

    function addRotatingEmoji(taskElement) {
        const emojis = ['🍣', '🍜', '🇯🇵'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = randomEmoji;
        emojiSpan.classList.add('rotating-emoji');
        taskElement.appendChild(emojiSpan);
    }
});
