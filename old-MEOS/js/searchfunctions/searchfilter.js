document.querySelector('.fine-search input').addEventListener('input', function(e) {
    var searchValue = e.target.value.toLowerCase();
    var fines = document.querySelectorAll('.fine-container');
    var noFinesFoundMsg = document.getElementById('no-fines-found');
    var found = false;

    fines.forEach(function(container) {
        var title = container.querySelector('.fine-title').textContent.toLowerCase();
        if (title.includes(searchValue)) {
            container.style.display = '';
            found = true;
        } else {
            container.style.display = 'none';
        }
    });

    if (!found) {
        noFinesFoundMsg.style.display = 'block';
    } else {
        noFinesFoundMsg.style.display = 'none';
    }
});
