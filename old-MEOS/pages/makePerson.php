<?php
include("../config.php");

session_start();
if (!isset($_SESSION['username'])) {
  header('location: ../../index.php');
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
  <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
  <link rel="icon" type="/images/fslogo.png" sizes="32x32" href="/images/fslogo.png">
  <link rel="stylesheet" href="/css/straffen.css">
  <link rel="stylesheet" href="/css/newrapport.css">
  <title>MEOS | Maak persoon</title>
</head>

<body>
  <div class="popup-wrapper" style=" padding-left: 30px;">
    <div class="top-container-buttons">
      <h1>Gebruikers</h1>
      <button type="submit" form="reportForm" value="indienen" class="black-button">Persoon aanmelden</button>
    </div>

    <form id="reportForm" class="rapport-wrapper" method="POST" action="phpfunctions/createuser.php" onsubmit="return validateForm()">
      <div class="report-section">
        <div class="input-container">
          <label for="name">Naam</label>
          <input id="name" name="name" class="input-with-border-label" type="text" required />
        </div>

        <div class="input-container">
          <label for="roepnummer">Roepnummer</label>
          <input id="roepnummer" name="roepnummer" class="input-with-border-label" type="text" required />
        </div>

        <div class="input-container">
          <label for="rang">Rang</label>
          <select id="rang" name="rang" class="input-with-border-label" type="text" required>
            <option value="Aspirant">Aspirant</option>
            <option value="Surveillant">Surveillant</option>
            <option value="Agent">Agent</option>
            <option value="Hoofdagent">Hoofdagent</option>
            <option value="Brigadier">Brigadier</option>
            <option value="Inspecteur">Inspecteur</option>
            <option value="Hoofd Inspecteur">Hoofd Inspecteur</option>
            <option value="Commissaris">Commissaris</option>
            <option value="Hoofd Commissaris">Hoofd Commissaris</option>
            <option value="Eerste Hoofd Commissaris">Eerste Hoofd Commissaris</option>
          </select>
        </div>

      </div>
      <div class="report-section">
      <div class="input-container">
          <label for="gebruikersnaam">Gebuikersnaam</label>
          <input id="gebruikersnaam" name="gebruikersnaam" class="input-with-border-label" type="text" required />
        </div>
        <div class="input-container">
          <label for="wachtwoord">Wachtwoord</label>
          <input id="wachtwoord" name="wachtwoord" class="input-with-border-label" type="text" required />
        </div>
    </form>
  </div>
  </div>
</body>

</html>
<style>
  .input-container>label {
    background-color: #f1f1f1 !important;
  }
</style>