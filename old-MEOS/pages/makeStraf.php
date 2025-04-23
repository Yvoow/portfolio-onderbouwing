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
  <title>MEOS | Maak straf</title>
</head>

<body>
  <div class="popup-wrapper" style=" padding-left: 30px;">
    <div class="top-container-buttons">
      <h1>Straffen</h1>
      <button type="submit" form="reportForm" value="indienen" class="black-button">Straf indienen</button>
    </div>

    <form id="reportForm" class="rapport-wrapper" method="POST" action="phpfunctions/createstraf.php" onsubmit="return validateForm()">
      <div class="report-section">
        <div class="input-container">
          <label for="rapportTitle">Straf titel</label>
          <input id="rapportTitle" name="rapportTitle" class="input-with-border-label" type="text" maxlength="20" required />
        </div>

        <div class="input-container">
          <label for="maanden">Aantal maanden</label>
          <input id="maanden" name="maanden" class="input-with-border-label" type="number" min="0" step="1" pattern="\d+" required />
        </div>

        <div class="input-container">
          <label for="boete">Boete</label>
          <input id="boete" name="boete" class="input-with-border-label" type="number" min="0" step="1" pattern="\d+" required />
        </div>

        <div class="input-container text-information" id="editableContainer">
          <label for="supportAgents">Beschrijving</label>
          <div class="counts-container">
            <span id="wordCount">0 woorden</span> | <span id="charCount">0 karakters</span>
          </div>
          <textarea id="extraInformation" class="input-with-border-label" oninput="countWordsAndCharacters()" name="extraInformation"></textarea>
        </div>
      </div>
      <div class="report-section">
        <div class="input-container">
          <label for="reportType">Straf type</label>
          <select id="reportType" class="input-with-border-label" name="reportType" required onchange="showSecondDropdown(this.value)">
            <option value="" selected>Geen filters</option>
            <option value="Opiumwet">Opiumwet</option>
            <option value="Verkeerswet">Verkeerswet</option>
            <option value="Strafrecht">Strafrecht</option>
          </select>
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