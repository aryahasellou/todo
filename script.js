document.addEventListener('DOMContentLoaded', function () {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskPool = document.getElementById('task-pool');
    const aryaTasks = document.getElementById('arya-tasks');
    const aleynaTasks = document.getElementById('aleyna-tasks');
    const searchInput = document.getElementById('search');
    const toggleDarkModeButton = document.getElementById('toggle-darkmode');
    let taskCounter = { arya: 0, aleyna: 0 };
    let completedTasks = { arya: 0, aleyna: 0 };
    let darkMode = false;

    // Aufgaben von Firebase laden (dieser Code ist vorerst auskommentiert)
    // loadTasks('taskPool', taskPool);
    // loadTasks('aryaTasks', aryaTasks);
    // loadTasks('aleynaTasks', aleynaTasks);

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
        deleteBtn.textContent = '❌'; // Emoji für löschen
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', function () {
            newTaskDiv.remove();
        });
        newTaskDiv.appendChild(deleteBtn);

        // Checkbox Event Listener
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                newTaskDiv.style.textDecoration = 'line-through';
                if (taskCounter.arya + taskCounter.aleyna > 0) {
                    // Animation für Rakete und Konfetti
                    if (taskCounter.arya > 0) {
                        completedTasks.arya++;
                        if (completedTasks.arya % 3 === 0) {
                            alert('🚀🎉'); // Rakete und Konfetti
                        }
                    }
                    if (taskCounter.aleyna > 0) {
                        completedTasks.aleyna++;
                        if (completedTasks.aleyna % 3 === 0) {
                            alert('🚀🎉'); // Rakete und Konfetti
                        }
                    }
                }
            } else {
                newTaskDiv.style.textDecoration = 'none';
            }
        });

        return newTaskDiv;
    }

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const taskDivs = taskPool.querySelectorAll('div');
        taskDivs.forEach(div => {
            const text = div.textContent.toLowerCase();
            if (text.includes(query)) {
                div.style.display = 'block';
            } else {
                div.style.display = 'none';
            }
        });
    });

    toggleDarkModeButton.addEventListener('click', function () {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        toggleDarkModeButton.textContent = darkMode ? 'Light Mode' : 'Dark Mode';
    });
});
