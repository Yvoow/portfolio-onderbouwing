document.addEventListener('DOMContentLoaded', function() {
    const reportTypeSelect = document.getElementById('reportType');
    const searchInput = document.getElementById('reductionPercent');
    const noReportsFound = document.getElementById('no-reports-found'); 
    const headerRow = document.querySelector('.arrestatiebevel-row.header');
    function updateDisplay() {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedFilter = reportTypeSelect.value;
        let visibleRowsCount = 0; 

        const rows = document.querySelectorAll('.arrestatiebevel-row:not(.header)'); 

        rows.forEach(row => {
            const naam = row.querySelector('.arrestatiebevel-cell:nth-child(1)').textContent.toLowerCase();
            const agent = row.querySelector('.arrestatiebevel-cell:nth-child(2)').textContent.toLowerCase();
            const statusCell = row.querySelector('.arrestatiebevel-cell.state');
            const status = statusCell.classList.contains('closed') ? 'searched' : 'afgehandeld';

            if ((naam.includes(searchQuery) || agent.includes(searchQuery)) &&
                (selectedFilter === '' || (selectedFilter === 'searched' && status === 'searched') || (selectedFilter === 'afgehandeld' && status === 'afgehandeld'))) {
                row.style.display = '';
                visibleRowsCount++;
            } else {
                row.style.display = 'none';
            }
        });

        if (visibleRowsCount === 0) {
            noReportsFound.style.display = 'block';
            headerRow.style.display = 'none';
        } else {
            noReportsFound.style.display = 'none';
            headerRow.style.display = '';
        }
    }
    reportTypeSelect.addEventListener('change', updateDisplay);
    searchInput.addEventListener('keyup', updateDisplay);
    updateDisplay();
});