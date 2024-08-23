document.addEventListener('DOMContentLoaded', function () {
    const tasks = document.querySelectorAll('.task-table div, .priority-table div, .pool-table div');
    const dropzones = document.querySelectorAll('.task-table, .priority-table, .pool-table');

    tasks.forEach(task => {
        task.draggable = true;
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);
    });

    dropzones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', dropTask);
    });

    function dragStart(e) {
        this.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    function dragEnd() {
        this.classList.remove('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dropTask(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);
        this.appendChild(draggable);
    }
});