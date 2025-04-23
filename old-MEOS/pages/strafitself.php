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
    <title>MEOS | Straf</title>
</head>
<body>
      <div class="popup-wrapper">
      <?php
          $id = $_GET['id'];
              $sql = "SELECT * FROM straffen WHERE id='$id'";
              $result = $conn->query($sql);
              if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                  echo '<div class="aboutPerson1Container">';
                  echo '<h2 class="titlePopUpReport jobInformation">' .$row['title']. '</h2>';
                  echo '<div class="popUpContent">';
                  echo '<h3>Type</h3>';
                  echo '<p>' .$row['type']. '</p>';
                  echo '<br>';
                  if($row['boete'] > 0) {
                    echo '<h3>Boete</h3>';
                    echo '<p>€' .$row['boete']. '</p>';
                  }
                  echo '<br>';
                  if($row['maanden'] > 0) {
                    echo '<h3>Celstraf</h3>';
                    echo '<p>' .$row['maanden']. ' Maanden</p>';
                  }
                  echo '<h3>Beschrijving</h3>';
                  echo '<p>' .$row['descr']. '</p>';
                  }
                } else {
                  echo "0 info gevonden";
                }
              ?>
              </div>
          </div>
      </div>
</body>
</html>