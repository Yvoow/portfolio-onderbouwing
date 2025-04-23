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
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/newrapport.css">
    <link rel="stylesheet" href="/css/arrestiebeveleninfo.css">
    <title>MEOS | Document informatie</title>
</head>
<body>
    <main>
            <?php include 'main/sidebar.php'; ?>
        <div class="content">
            <div class="top-container-buttons">
                <h1>Document</h1>
                <?php
                    $id = $_GET['id'];
                    $sql = "SELECT * FROM documents WHERE id='$id'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                      while($row = $result->fetch_assoc()) {
                        echo '</div>';
                        echo '<div class="container">';
                        echo '<div class="header-content">';
                        echo '    <div class="inner-information">';
                        echo '        <h3 style="font-size: 30px;">Titel:</h3>';
                        echo '        <p style="font-size: 30px;">'.$row['name'].'</p>';
                        echo '    </div>';
                        echo '</div>';
                        echo '<div class="wanted-container">';
                        echo '    <div class="searchedDescription">';
                        echo '        <h2>Inhoud:</h2>';
                        echo '        <p style="max-width: 65ch;">'.$row['text'].'</p>';
                        echo '    </div>';
                        echo '</div>';
                    }
                } else {
                  echo "0 info gevonden";
                }
                ?>
            </div>

        </div>
    </main>
    <script src="/js/loader.js"></script>
    <script src="/js/main.js"></script>
</body>
</html>