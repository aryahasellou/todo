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
    const taskSearch = document.getElementById('task-search');
    const darkModeSwitch = document.getElementById('dark-mode-switch');

    // Funktionen zum Erstellen von Aufgaben-Elementen
    function createTaskElement(taskText) {
        const taskDiv = document.createElement('div');
        taskDiv.textContent = taskText;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            taskDiv.remove();
            saveTasksToLocal('taskPool');
            removeTaskFromFirebase(taskDiv);
        });
        taskDiv.appendChild(deleteBtn);
        return taskDiv;
    }

    // Aufgaben hinzufügen
    addTaskButton.addEventListener('click', function () {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const taskDiv = createTaskElement(taskText);
            taskPool.appendChild(taskDiv);
            newTaskInput.value = '';
            saveTasksToLocal('taskPool');
            saveTask('taskPool', taskText);
        }
    });

    // Aufgaben aus Firebase laden
    function loadTasksFromFirebase(zoneId) {
        const tasksRef = db.ref(zoneId);
        tasksRef.on('child_added', function(snapshot) {
            const taskText = snapshot.val();
            const taskDiv = createTaskElement(taskText);
            document.getElementById(zoneId).appendChild(taskDiv);
        });
    }

    // Aufgaben in Firebase speichern
    function saveTask(zone, taskText) {
        const tasksRef = db.ref(zone);
        tasksRef.push(taskText);
        saveTasksToLocal(zone);
    }

    // Aufgaben aus Firebase entfernen
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
        saveTasksToLocal(zoneId);
    }

    // Aufgaben in LocalStorage speichern
    function saveTasksToLocal(zoneId) {
        const tasks = [];
        document.querySelectorAll(`#${zoneId} div`).forEach(task => {
            tasks.push(task.textContent.replace('❌', '').trim());
        });
        localStorage.setItem(zoneId, JSON.stringify(tasks));
    }

    // Aufgaben aus LocalStorage laden
    function loadTasksFromLocal(zoneId) {
        const tasks = JSON.parse(localStorage.getItem(zoneId)) || [];
        tasks.forEach(taskText => {
            const newTaskDiv = createTaskElement(taskText);
            document.getElementById(zoneId).appendChild(newTaskDiv);
        });
    }

    // Suchfunktion
    taskSearch.addEventListener('input', function () {
        const filter = taskSearch.value.toLowerCase();
        const tasks = document.querySelectorAll('.task-table div');
        tasks.forEach(task => {
            if (task.textContent.toLowerCase().includes(filter)) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });
    });

    // Dark Mode umschalten
    darkModeSwitch.addEventListener('change', function () {
        document.body.classList.toggle('dark-mode');
    });

    // XP-Leiste aktualisieren
    let aryaXp = 0;
    let aleynaXp = 0;
    const xpIncrement = 20; // Pro abgeschlossener Aufgabe
    const maxXp = 100; // Maximalwert der XP

    function updateXpBar(zoneId, xpValue) {
        const xpBar = document.getElementById(`${zoneId}`);
        xpBar.style.width = `${xpValue}%`;
        if (xpValue >= 100) {
            celebrateFullXp(zoneId);
        }
    }

    function celebrateFullXp(zoneId) {
        showConfetti();
        document.getElementById(zoneId).style.backgroundColor = zoneId === 'arya-xp-bar' ? 'green' : 'pink';
        setTimeout(() => {
            document.getElementById(zoneId).style.backgroundColor = '';
        }, 3000);
    }

    // Emojis für Konfetti und Rakete
    function showConfetti() {
        const confettiEmoji = '🎉';
        document.body.insertAdjacentHTML('beforeend', `<div class="confetti">${confettiEmoji.repeat(10)}</div>`);
        setTimeout(() => document.querySelector('.confetti').remove(), 3000);
    }

    function launchRocket() {
        const rocketEmoji = '🚀';
        document.body.insertAdjacentHTML('beforeend', `<div class="rocket">${rocketEmoji}</div>`);
        setTimeout(() => document.querySelector('.rocket').remove(), 3000);
    }

    // Überprüfen, ob eine Feier ausgelöst werden soll
    let completedTasks = 0;
    let lastTaskTime = Date.now();

    function checkForCelebration() {
        const currentTime = Date.now();
        if (currentTime - lastTaskTime < 5000) { // 5 Sekunden Zeitfenster
            completedTasks++;
            if (completedTasks >= 3) { // z.B. bei 3 schnell hintereinander abgehakten Aufgaben
                launchRocket();
                showConfetti();
                completedTasks = 0; // Zurücksetzen
            }
        } else {
            completedTasks = 1;
        }
        lastTaskTime = currentTime;
    }

    // Aufgabenstatus überprüfen und XP-Leiste aktualisieren
    document.querySelectorAll('.task-table input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                if (this.parentElement.parentElement.id === 'arya-tasks') {
                    aryaXp += xpIncrement;
                    updateXpBar('arya-xp-bar', aryaXp);
                } else if (this.parentElement.parentElement.id === 'aleyna-tasks') {
                    aleynaXp += xpIncrement;
                    updateXpBar('aleyna-xp-bar', aleynaXp);
                }
                checkForCelebration();
            }
        });
    });

    // Initiale Aufgaben laden
    loadTasksFromLocal('taskPool');
    loadTasksFromLocal('arya-tasks');
    loadTasksFromLocal('aleyna-tasks');
    loadTasksFromFirebase('taskPool');
    loadTasksFromFirebase('arya-tasks');
    loadTasksFromFirebase('aleyna-tasks');
});
