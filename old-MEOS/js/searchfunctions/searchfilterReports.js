document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('reductionPercent');
    const reportTypeSelect = document.getElementById('reportType');
    const draftsHeading = document.getElementById('draftsHeading');
    const rapportenHeader = document.getElementById('rapportenHeader');
    let cases = document.querySelectorAll('.searched-person-wrapper .about-case-container');
    let noReportsFoundMsg = document.getElementById('no-reports-found');

    const filterCases = () => {
        let searchTerm = searchInput.value.toLowerCase();
        let selectedType = reportTypeSelect.value;
        let found = false;
        let draftFound = false;
        let reportFound = false; // Variable to track if any report is found

        cases.forEach(aCase => {
            let caseNumber = aCase.querySelector('.case-number p').textContent.toLowerCase();
            let suspect = aCase.querySelector('.suspects p').textContent.toLowerCase();
            let officer = aCase.querySelector('.officers p').textContent.toLowerCase();
            let caseType = aCase.querySelector('.type p').textContent;

            let matchesSearch = caseNumber.includes(searchTerm) || suspect.includes(searchTerm) || officer.includes(searchTerm);
            let matchesType = (selectedType === 'incident' && caseType === 'Opiumwet') ||
                              (selectedType === 'accident' && caseType === 'Verkeerswet') ||
                              (selectedType === 'theft' && caseType === 'Strafrecht') ||
                              selectedType === '';

            if (matchesSearch && matchesType) {
                aCase.style.display = '';
                found = true;
                reportFound = true;
                if (aCase.classList.contains('draft-case')) {
                    draftFound = true;
                }
            } else {
                aCase.style.display = 'none';
            }
        });

        draftsHeading.style.display = draftFound ? '' : 'none';
        rapportenHeader.style.display = reportFound ? '' : 'none';
        noReportsFoundMsg.style.display = found ? 'none' : 'block';
    };

    searchInput.addEventListener('keyup', filterCases);
    reportTypeSelect.addEventListener('change', filterCases);

    // Initial filter call to set up correct display state
    filterCases();
});
