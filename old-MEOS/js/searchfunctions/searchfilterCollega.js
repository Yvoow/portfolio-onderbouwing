function searchName() {
    var searchValue = document.getElementById('searchInput').value.toLowerCase();
    var colleagues = document.querySelectorAll('.collega-card');
    var noColleaguesFoundMsg = document.getElementById('no-colleagues-found');
    var found = false;

    colleagues.forEach(function(colleague) {
        var name = colleague.querySelector('.name').textContent.toLowerCase();

        if (name.includes(searchValue)) {
            colleague.style.display = '';
            found = true;
        } else {
            colleague.style.display = 'none';
        }
    });

    noColleaguesFoundMsg.style.display = found ? 'none' : 'block';
}
