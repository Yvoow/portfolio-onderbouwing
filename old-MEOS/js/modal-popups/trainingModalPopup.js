document.addEventListener("DOMContentLoaded", function() {
    var btn = document.querySelector(".getTrainingButton");
    var popup = document.querySelector(".popup-training");
    var form = document.getElementById("ibtform");
    var submitButton = document.querySelector(".versturenTrainingButton");

    btn.onclick = function() {
        popup.style.display = "block";
    }

    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    }

    form.onsubmit = function(event) {
        event.preventDefault(); 

        var formData = new FormData(form);

        fetch('phpfunctions/trainingaanvraag.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            var message = document.createElement("p");
            message.className = "thankYouMessage"; 
            message.textContent = "Training aanvraag is verzonden!";

            form.innerHTML = "";
            form.appendChild(message);
            submitButton.style.display = 'none';

            setTimeout(function() {
                popup.style.display = "none";
                submitButton.style.display = '';
                form.innerHTML = ""; 
            }, 5000);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
});
