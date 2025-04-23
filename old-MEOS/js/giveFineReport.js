const fineContainers = document.querySelectorAll(".fine-container");
const totalMaanden = document.getElementById("totalMaanden");
const totalBoetes = document.getElementById("totalBoetes");
const selectedFineNames = document.querySelector(".selectedFineNames");
let selectedBoete = 0;
let selectedMaanden = 0;
const selectedFines = {};

document.getElementById("toevoegenButton").addEventListener("click", addFinesToPopup);

fineContainers.forEach((container) => {
    container.addEventListener("click", () => {
        const name = container.getAttribute("data-name");
        const boete = parseInt(container.getAttribute("data-boete"));
        const maanden = parseInt(container.getAttribute("data-maanden"));
        const fineType = container.classList.contains("strafrecht") ? "strafrecht" : container.classList.contains("verkeerswet") ? "verkeerswet" : "opiumwet";
        if (selectedFines[name]) {
            selectedFines[name].count++;
        } else {
            selectedFines[name] = { count: 1, type: fineType, boete: boete, maanden: maanden };
        }
        selectedBoete += boete;
        selectedMaanden += maanden;
        updateSelectedFinesDisplay();
    });
});

function updateSelectedFinesDisplay() {
    let fineNamesHTML = "";
    Object.keys(selectedFines).forEach((fineName) => {
        const fineInfo = selectedFines[fineName];
        let className = fineInfo.type === "strafrecht" ? 'strafrecht-background' : 
                        fineInfo.type === "verkeerswet" ? 'verkeerswet-background' : 'opiumwet-background';
        fineNamesHTML += `<span class="${className}">${fineName} ${fineInfo.count > 1 ? `(${fineInfo.count}x)` : ""} <button class="delete-fine" data-name="${fineName}">x</button></span> `;
    });

    selectedFineNames.innerHTML = fineNamesHTML.trim();
    totalBoetes.textContent = `Boetes: €${selectedBoete}`;
    totalMaanden.textContent = `Hechtenis: ${selectedMaanden} Maanden`;

    document.querySelectorAll('.delete-fine').forEach(button => {
        button.addEventListener('click', function(event) {
            const fineName = this.getAttribute('data-name');
            const fine = selectedFines[fineName];
            selectedBoete -= fine.boete * fine.count;
            selectedMaanden -= fine.maanden * fine.count;
            delete selectedFines[fineName];

            updateSelectedFinesDisplay();
            event.stopPropagation();
        });
    });
}

function addFinesToPopup() {
    const allFinesDiv = document.querySelector(".all-fines");
    allFinesDiv.innerHTML = ""; 

    Object.keys(selectedFines).forEach((fineName) => {
        const fine = selectedFines[fineName];
        const fineDiv = document.createElement("div");
        fineDiv.className = "fine";
        let className = fine.type === "strafrecht" ? 'strafrecht-background' : 
                        fine.type === "verkeerswet" ? 'verkeerswet-background' : 'opiumwet-background';
        fineDiv.innerHTML = `<span class="${className}">${fineName} ${fine.count > 1 ? `(${fine.count}x)` : ""}</span>`;
        allFinesDiv.append(fineDiv);
    });

    const finesBottomDiv = document.querySelector(".fines-bottom");
    finesBottomDiv.innerHTML = `<span> Maanden: <input id="maanden" name="maanden" type="text" value="${selectedMaanden}" readonly></span> <span>Boete: €<input id="boete" name="boete" type="text" value="${selectedBoete}" readonly></span>`;

    var finesHTML = document.querySelector('.all-fines').innerHTML;
    document.getElementById('finesHTMLInput').value = finesHTML;
    closePunishmentModal(); 
}