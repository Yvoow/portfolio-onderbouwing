document.getElementById('citizenSearch').addEventListener('keyup', function(event) {
    var searchValue = event.target.value.toLowerCase();
    var persons = document.querySelectorAll('.searched-person-wrapper .about-case-container');
    var noPersonFoundMsg = document.getElementById('no-persons-found');
    var found = false;

    persons.forEach(function(person) {
        var name = person.querySelector('.case-number p').textContent.toLowerCase();
        var job = person.querySelector('.type p').textContent.toLowerCase();
        var gender = person.querySelector('.suspects p').textContent.toLowerCase();
        var dob = person.querySelector('.officers p').textContent.toLowerCase();

        if (name.includes(searchValue) || job.includes(searchValue) || gender.includes(searchValue) || dob.includes(searchValue)) {
            person.style.display = '';
            found = true;
        } else {
            person.style.display = 'none';
        }
    });

    if (!found) {
        noPersonFoundMsg.style.display = 'block';
    } else {
        noPersonFoundMsg.style.display = 'none';
    }
});
