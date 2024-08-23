document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskPool = document.getElementById('task-pool');
    const aryaTasks = document.getElementById('arya-tasks');
    const aleynaTasks = document.getElementById('aleyna-tasks');
    let selectedTask = null;
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Aufgaben von Firebase laden
    loadTasks('taskPool', taskPool);
    loadTasks('aryaTasks', aryaTasks);
    loadTasks('aleynaTasks', aleynaTasks);

    addTaskButton.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const newTaskDiv = createTaskElement(taskText);
            taskPool.appendChild(newTaskDiv);
            saveTask('taskPool', taskText);
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
        deleteBtn.addEventListener('click', () => {
            newTaskDiv.remove();
            removeTaskFromFirebase(newTaskDiv);
        });

        if (isMobile) {
            // Mobilgeräte: Tap and Move
            newTaskDiv.addEventListener('click', () => {
                if (selectedTask) {
                    selectedTask.classList.remove('selected-task');
                }
                selectedTask = newTaskDiv;
                newTaskDiv.classList.add('selected-task');
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
        setTimeout(() => this.style.visibility = 'hidden', 0); // Verstecke das Element während des Drag
    }

    function dragEnd(e) {
        this.classList.remove('dragging');
        this.style.visibility = 'visible';
    }

    const dropzones = document.querySelectorAll('.task-table, .priority-table, .pool-table');

    dropzones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', e => {
            dropTask(e, zone.id);
        });

        if (isMobile) {
            // Mobile: Tap to Move
            zone.addEventListener('click', () => {
                if (selectedTask) {
                    zone.appendChild(selectedTask);
                    selectedTask.classList.remove('selected-task');
                    saveTask(zone.id, selectedTask.textContent);
                    selectedTask = null;
                }
            });
        }
    });

    function dragOver(e) {
        e.preventDefault();
    }

    function dropTask(e, zoneId) {
        e.preventDefault();
        const taskText = e.dataTransfer.getData('text/plain');
        const newTaskDiv = createTaskElement(taskText);
        document.getElementById(zoneId).appendChild(newTaskDiv);
        saveTask(zoneId, taskText);
    }

    // Aufgabe in Firebase speichern
    function saveTask(zone, taskText) {
        const tasksRef = db.ref(zone);
        tasksRef.push(taskText);
    }

    // Aufgabe aus Firebase entfernen
    function removeTaskFromFirebase(taskElement) {
        const taskText = taskElement.textContent.replace('❌', '').trim();
        const zoneId = taskElement.parentElement.id;
        const tasksRef = db.ref(zoneId);
        tasksRef.once('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                if (childSnapshot.val() === taskText) {
                    tasksRef.child(childSnapshot.key).remove();
                }
            });
        });
    }

    // Aufgaben aus Firebase laden
    function loadTasks(zone, element) {
        const tasksRef = db.ref(zone);
        tasksRef.on('child_added', snapshot => {
            const taskText = snapshot.val();
            const newTaskDiv = createTaskElement(taskText);
            element.appendChild(newTaskDiv);
        });
    }
});
