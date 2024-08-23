// Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase initialisieren
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

document.addEventListener('DOMContentLoaded', function () {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskPool = document.getElementById('task-pool');
    const aryaTasks = document.getElementById('arya-tasks');
    const aleynaTasks = document.getElementById('aleyna-tasks');
    let selectedTask = null;

    // Aufgaben von Firebase laden
    loadTasks('taskPool', taskPool);
    loadTasks('aryaTasks', aryaTasks);
    loadTasks('aleynaTasks', aleynaTasks);

    addTaskButton.addEventListener('click', function () {
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
        deleteBtn.addEventListener('click', function () {
            newTaskDiv.remove();
            removeTaskFromFirebase(newTaskDiv); // Entferne die Aufgabe auch aus Firebase
        });

        // Mobile: Tap and Move
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
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
        zone.addEventListener('drop', function (e) {
            dropTask(e, zone.id);
        });

        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            zone.addEventListener('click', function () {
                if (selectedTask) {
                    zone.appendChild(selectedTask);
                    selectedTask.classList.remove('selected-task');
                    saveTask(zone.id, selectedTask.textContent); // Speichere die Aufgabe in Firebase
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
        saveTask(zoneId, taskText); // Speichere die Aufgabe in Firebase
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
        tasksRef.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                if (childSnapshot.val() === taskText) {
                    tasksRef.child(childSnapshot.key).remove();
                }
            });
        });
    }

    // Aufgaben aus Firebase laden
    function loadTasks(zone, element) {
        const tasksRef = db.ref(zone);
        tasksRef.on('child_added', function(snapshot) {
            const taskText = snapshot.val();
            const newTaskDiv = createTaskElement(taskText);
            element.appendChild(newTaskDiv);
        });
    }
});
