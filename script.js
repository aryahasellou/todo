document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskPool = document.getElementById('task-pool');
    const aryaTasks = document.getElementById('arya-tasks');
    const aleynaTasks = document.getElementById('aleyna-tasks');
    let completedTasksCount = 0;
    let selectedTask = null;

    // Aufgaben von Firebase laden
    ['taskPool', 'aryaTasks', 'aleynaTasks'].forEach(zone => loadTasks(zone, document.getElementById(zone)));

    addTaskButton.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const newTaskDiv = createTaskElement(taskText);
            taskPool.appendChild(newTaskDiv);
            saveTask('taskPool', taskText); // Speichere die Aufgabe in Firebase
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
            removeTaskFromFirebase(newTaskDiv); // Entferne die Aufgabe auch aus Firebase
        });

        // Event Listener für das Abhaken der Aufgabe
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                completedTasksCount++;
                newTaskDiv.classList.add('completed-task');
                
                if (completedTasksCount >= 3) {
                    displayFireworks();
                    completedTasksCount = 0; // Zurücksetzen des Zählers
                }
            } else {
                completedTasksCount--;
                newTaskDiv.classList.remove('completed-task');
            }
        });

        return newTaskDiv;
    }

    function displayFireworks() {
        const fireworks = document.createElement('div');
        fireworks.classList.add('completed-task-rocket');
        fireworks.innerHTML = '🚀🎉';
        document.body.appendChild(fireworks);
        setTimeout(() => fireworks.remove(), 2000); // Entferne das Feuerwerk nach 2 Sekunden
    }

    function loadTasks(zone, element) {
        // Placeholder für die Funktion, die Aufgaben von Firebase lädt
    }

    function saveTask(zone, taskText) {
        // Placeholder für die Funktion, die Aufgaben in Firebase speichert
    }

    function removeTaskFromFirebase(taskDiv) {
        // Placeholder für die Funktion, die Aufgaben aus Firebase entfernt
    }
});
