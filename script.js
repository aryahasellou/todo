document.addEventListener('DOMContentLoaded', function () {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskPool = document.getElementById('task-pool');
    const aryaTasks = document.getElementById('arya-tasks');
    const aleynaTasks = document.getElementById('aleyna-tasks');
    const searchInput = document.getElementById('search-input');
    const darkModeButton = document.getElementById('dark-mode-toggle');
    const xpBarArya = document.getElementById('arya-xp');
    const xpBarAleyna = document.getElementById('aleyna-xp');

    let completedTasks = {
        'taskPool': 0,
        'aryaTasks': 0,
        'aleynaTasks': 0
    };
    let taskCount = {
        'aryaTasks': 0,
        'aleynaTasks': 0
    };
    let darkMode = false;

    // Event Listener für Hinzufügen von Aufgaben
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
            updateXP(newTaskDiv); // Aktualisiere die XP-Leiste
        });

        // Event Listener für Checkbox
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                newTaskDiv.classList.add('completed');
                updateXP(newTaskDiv); // Aktualisiere die XP-Leiste
                if (completedTasks['aryaTasks'] % 2 === 0 && completedTasks['aryaTasks'] > 0) {
                    displayEmoji('🚀🎉'); // Rakete und Konfetti Emoji
                }
            } else {
                newTaskDiv.classList.remove('completed');
                updateXP(newTaskDiv); // Aktualisiere die XP-Leiste
            }
        });

        return newTaskDiv;
    }

    function updateXP(taskElement) {
        const taskText = taskElement.textContent;
        if (taskElement.parentElement.id === 'arya-tasks') {
            completedTasks['aryaTasks']++;
            taskCount['aryaTasks']++;
            xpBarArya.style.width = `${(completedTasks['aryaTasks'] / taskCount['aryaTasks']) * 100}%`;
            if (completedTasks['aryaTasks'] === taskCount['aryaTasks']) {
                document.body.style.backgroundColor = '#4CAF50'; // Grün für Abschluss
                setTimeout(() => {
                    document.body.style.backgroundColor = '#f0f0f0'; // Zurück zu Standard
                }, 3000);
                displayEmoji('🎉'); // Konfetti Emoji
            }
        } else if (taskElement.parentElement.id === 'aleyna-tasks') {
            completedTasks['aleynaTasks']++;
            taskCount['aleynaTasks']++;
            xpBarAleyna.style.width = `${(completedTasks['aleynaTasks'] / taskCount['aleynaTasks']) * 100}%`;
            if (completedTasks['aleynaTasks'] === taskCount['aleynaTasks']) {
                document.body.style.backgroundColor = '#FF69B4'; // Pink für Abschluss
                setTimeout(() => {
                    document.body.style.backgroundColor = '#f0f0f0'; // Zurück zu Standard
                }, 3000);
                displayEmoji('🎉'); // Konfetti Emoji
            }
        }
    }

    function displayEmoji(emoji) {
        const emojiElement = document.createElement('div');
        emojiElement.textContent = emoji;
        emojiElement.classList.add('appearing-emoji');
        document.body.appendChild(emojiElement);
        setTimeout(() => {
            emojiElement.remove();
        }, 2000);
    }

    // Event Listener für Suche
    searchInput.addEventListener('input', function () {
        const filter = searchInput.value.toLowerCase();
        const tasks = document.querySelectorAll('.task-table div');
        tasks.forEach(task => {
            if (task.textContent.toLowerCase().includes(filter)) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });
    });

    // Event Listener für Dark Mode
    darkModeButton.addEventListener('click', function () {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        darkModeButton.textContent = darkMode ? 'Light Mode' : 'Dark Mode';
    });
});
