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
    const aryaXpBar = document.getElementById('arya-xp-bar').querySelector('span');
    const aleynaXpBar = document.getElementById('aleyna-xp-bar').querySelector('span');
    const searchInput = document.getElementById('search-input');
    const darkModeToggle = document.getElementById('toggle-darkmode');
    let selectedTask = null;

    // Dark Mode
    darkModeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '🌞' : '🌙';
    });

    // Suche
    searchInput.addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        document.querySelectorAll('.task-table div').forEach(taskDiv => {
            const taskText = taskDiv.textContent.toLowerCase();
            taskDiv.style.display = taskText.includes(searchValue) ? 'flex' : 'none';
        });
    });

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
            updateXp();
        });

        // Event Listener für Checkbox
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                newTaskDiv.classList.add('completed');
                showConfetti();
                updateXp();
            } else {
                newTaskDiv.classList.remove('completed');
            }
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

    const dropzones = document.querySelectorAll('.task-table');

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
        updateXp();
    }

    // Aufgabe in Firebase speichern
    function saveTask(zone, taskText) {
        const tasksRef = db.ref(zone);
        tasksRef.push(taskText, (error) => {
            if (error) {
                console.error("Fehler beim Speichern der Aufgabe:", error);
            } else {
                console.log("Aufgabe erfolgreich gespeichert.");
            }
        });
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

    // XP-Leiste aktualisieren
    function updateXp() {
        const aryaTasksCount = aryaTasks.querySelectorAll('div.completed').length;
        const aleynaTasksCount = aleynaTasks.querySelectorAll('div.completed').length;

        aryaXpBar.style.width = `${(aryaTasksCount / 10) * 100}%`; // Beispiel: 10 Aufgaben für Vollständigkeit
        aleynaXpBar.style.width = `${(aleynaTasksCount / 10) * 100}%`; // Beispiel: 10 Aufgaben für Vollständigkeit

        if (aryaTasksCount === aryaTasks.children.length) {
            showConfetti();
        }

        if (aleynaTasksCount === aleynaTasks.children.length) {
            showConfetti();
        }
    }

    // Konfetti und Rakete anzeigen
    function showConfetti() {
        const confetti = document.createElement('div');
        confetti.innerHTML = '🎉🚀';
        confetti.classList.add('appearing-emoji');
        document.body.appendChild(confetti);
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
});
