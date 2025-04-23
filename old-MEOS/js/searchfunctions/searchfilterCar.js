document.getElementById('vehicleSearch').addEventListener('keyup', function(event) {
    var searchValue = event.target.value.toLowerCase();
    var vehicles = document.querySelectorAll('.searched-person-wrapper .about-case-container');
    var noVehiclesFoundMsg = document.getElementById('no-vehicles-found');
    var found = false;

    vehicles.forEach(function(vehicle) {
        var owner = vehicle.querySelector('.case-number p').textContent.toLowerCase();
        var plate = vehicle.querySelector('.type p').textContent.toLowerCase();

        if (owner.includes(searchValue) || plate.includes(searchValue)) {
            vehicle.style.display = '';
            found = true;
        } else {
            vehicle.style.display = 'none';
        }
    });

    if (!found) {
        noVehiclesFoundMsg.style.display = 'block';
    } else {
        noVehiclesFoundMsg.style.display = 'none';
    }
});
