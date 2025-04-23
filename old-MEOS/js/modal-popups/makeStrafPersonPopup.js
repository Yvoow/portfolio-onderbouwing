function showModal(id) {
    fetch('makePerson.php?id=' + id)
        .then(response => response.text())
        .then(data => {
            document.getElementById('straffen-content-pop-up').innerHTML = data;
            document.getElementById('popup-straffen').style.display = "block";
        });
}

function showModalindex(id) {
    fetch('strafitself.php?id=' + id)
        .then(response => response.text())
        .then(data => {
            document.getElementById('straffen-content-pop-up').innerHTML = data;
            document.getElementById('popup-straffen').style.display = "block";
        });
}

var modal = document.getElementById("popup-straffen");
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function showModalEdit(id) {
    fetch('editstraf.php?id=' + id)
        .then(response => response.text())
        .then(data => {
            document.getElementById('straffen-content-pop-up').innerHTML = data;
            document.getElementById('popup-straffen').style.display = "block";
        });
}
