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
  <title>MEOS | Pas straf aan</title>
</head>

<body>
  <div class="popup-wrapper" style=" padding-left: 30px;">
    <div class="top-container-buttons">
    <a href="phpfunctions/deletestraf.php?id=<?php echo $_GET['id']; ?>" ><button class="black-button">Straf verwijderen</button></a>
      <h1>Straf bewerken</h1>
      <button type="submit" form="reportForm" value="indienen" class="black-button">Straf opslaan</button>
    </div>

    <form id="reportForm" class="rapport-wrapper" method="POST" action="phpfunctions/editstraf.php" onsubmit="return validateForm()">
    <?php
          $koppel = $_SESSION['koppeling'];
          $id = $_GET['id'];
          $sql = "SELECT * FROM straffen WHERE id='$id' and koppeling='$koppel'";
          $result = $conn->query($sql);
          if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
              echo '<input type="hidden" name="id" value="'.$row['id'].'">';
              echo '<div class="report-section">';
              echo '  <div class="input-container">';
              echo '    <label for="rapportTitle">Straf titel</label>';
              echo '    <input id="rapportTitle" name="rapportTitle" class="input-with-border-label" type="text" value="'.$row['title'].'" maxlength="20"required />';
              echo '  </div>';

              echo '  <div class="input-container">';
              echo '    <label for="maanden">Aantal maanden</label>';
              echo '    <input id="maanden" name="maanden" class="input-with-border-label" type="number" min="0" step="1" pattern="\d+"  value="'.$row['maanden'].'" required />';
              echo '  </div>';

              echo '  <div class="input-container">';
              echo '    <label for="boete">Boete</label>';
              echo '    <input id="boete" name="boete" class="input-with-border-label" type="number" min="0" step="1" pattern="\d+" value="'.$row['boete'].'" required />';
              echo '  </div>';

              echo '  <div class="input-container text-information" id="editableContainer">';
              echo '    <label for="supportAgents">Beschrijving</label>';
              echo '    <div class="counts-container">';
              echo '      <span id="wordCount">0 woorden</span> | <span id="charCount">0 karakters</span>';
              echo '    </div>';
              echo '    <textarea id="extraInformation" class="input-with-border-label" oninput="countWordsAndCharacters()" name="extraInformation">'.$row['descr'].'</textarea>';
              echo '  </div>';
              echo '</div>';
              echo '<div class="report-section">';
              echo '  <div class="input-container">';
              echo '    <label for="reportType">Straf type</label>';
              echo '    <select id="reportType" class="input-with-border-label" name="reportType" required onchange="showSecondDropdown(this.value)">';
              echo '      <option value="'.$row['type'].'" selected>Geen filters</option>';
              echo '      <option value="Opiumwet">Opiumwet</option>';
              echo '      <option value="Verkeerswet">Verkeerswet</option>';
              echo '      <option value="Strafrecht">Strafrecht</option>';
              echo '    </select>';
              echo '  </div>';
            }
          } else {
              echo "0 documenten gevonden";
          }
          ?>
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