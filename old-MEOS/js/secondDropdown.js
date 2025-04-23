function showSecondDropdown(value) {
    var secondDropdown = document.getElementById('secondDropdown');
    var thirdDropdown = document.getElementById('thirdDropdown');
    var fourthDropdown = document.getElementById('fourthDropdown');
    if (value === 'Arrestatiebevel') {
        secondDropdown.style.display = 'block';
        thirdDropdown.style.display = 'block';
        fourthDropdown.style.display = 'block';
    } else {
        secondDropdown.style.display = 'none';
        thirdDropdown.style.display = 'none';
        fourthDropdown.style.display = 'none';
    }
}