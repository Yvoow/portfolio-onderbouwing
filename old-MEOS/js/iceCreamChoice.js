document.getElementById('ice-cream-choice').addEventListener('input', function () {
    var selectedOption = document.querySelector('#ice-cream-flavors option[value="' + this.value + '"]');
    if (selectedOption) {
        var identifierValue = selectedOption.getAttribute('data-identifier');
        
        // Create a hidden input field dynamically
        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'verdachteIdentifier';
        hiddenInput.value = identifierValue;

        // Append the hidden input field to the form
        document.getElementById('reportForm').appendChild(hiddenInput);
    }
});