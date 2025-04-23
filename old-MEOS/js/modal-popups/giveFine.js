var modal = document.getElementById("PunishmentModal");

function openPunishmentModal() {
    modal.style.display = "block";
}
function closePunishmentModal() {
    var modal = document.getElementById("PunishmentModal");
    modal.style.display = "none";
}


window.onclick = function(event) {
    if (event.target == modal) {
        closePunishmentModal();
    }
}