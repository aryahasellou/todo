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
    
    let darkMode = false;
    let completedTasks = { 'aryaTasks': 0, 'aleynaTasks': 0 };
    let taskCount = { 'aryaTasks': 0, 'aleynaTasks': 0 };

    function createTaskElement(taskText, taskListId) {
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
            if (taskListId === 'arya-tasks') {
                taskCount['aryaTasks']--;
                updateXpBar('aryaTasks');
            } else if (taskListId === 'aleyna-tasks') {
                taskCount['aleynaTasks']--;
                updateXpBar('aleynaTasks');
            }
        });

        // Event Listener für Checkbox
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                if (taskListId === 'arya-tasks') {
                    completedTasks['aryaTasks']++;
                    if (completedTasks['aryaTasks'] % 3 === 0) {
                        alert('🚀🎉');
                    }
                } else if (taskListId === 'aleyna-tasks') {
                    completedTasks['aleynaTasks']++;
                    if (completedTasks['aleynaTasks'] % 3 === 0) {
                        alert('🚀🎉');
                    }
                }
                updateXpBar(taskListId);
            }
        });

        return newTaskDiv;
    }

    function updateXpBar(taskListId) {
        let xpPercentage = (completedTasks[taskListId] / taskCount[taskListId]) * 100;
        if (taskListId === 'arya-tasks') {
            xpBarArya.style.width = xpPercentage + '%';
        } else if (taskListId === 'aleyna-tasks') {
            xpBarAleyna.style.width = xpPercentage + '%';
        }

        if (xpPercentage >= 100) {
            document.body.style.backgroundColor = '#FFEB3B'; // Temporäre Hintergrundfarbe
            setTimeout(() => {
                document.body.style.backgroundColor = '#f0f0f0'; // Zurück zur Originalfarbe
            }, 2000);
        }
    }

    addTaskButton.addEventListener('click', function () {
        const taskText = newTaskInput.value;
        if (taskText) {
            if (document.activeElement === aryaTasks) {
                aryaTasks.appendChild(createTaskElement(taskText, 'arya-tasks'));
                taskCount['aryaTasks']++;
            } else if (document.activeElement === aleynaTasks) {
                aleynaTasks.appendChild(createTaskElement(taskText, 'aleyna-tasks'));
                taskCount['aleynaTasks']++;
            } else {
                taskPool.appendChild(createTaskElement(taskText, 'pool-tasks'));
            }
            newTaskInput.value = '';
        }
    });

    searchInput.addEventListener('input', function () {
        const searchText = searchInput.value.toLowerCase();
        const allTasks = document.querySelectorAll('.task-table div');
        allTasks.forEach(task => {
            const taskText = task.textContent.toLowerCase();
            task.style.display = taskText.includes(searchText) ? 'block' : 'none';
        });
    });

    darkModeButton.addEventListener('click', function () {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
    });
});
