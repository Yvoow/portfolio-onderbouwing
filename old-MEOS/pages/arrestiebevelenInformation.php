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
    <title>MEOS | Arrestiebevelen informatie</title>
</head>
<body>
    <main>
            <?php include 'main/sidebar.php'; ?>
        <div class="content">
            <div class="top-container-buttons">
                <h1>Arrestatiebevel</h1>
                <?php
                    $id = $_GET['id'];
                    $sql = "SELECT * FROM arrestatiebevelen WHERE id='$id'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                      while($row = $result->fetch_assoc()) {
                        echo '</div>';
                        echo '<div class="container">';
                        echo '<div class="header-content">';
                        echo '    <div class="inner-information">';
                        echo '        <h3>Persoon:</h3>';
                        echo '        <p>'.$row['naam'].'</p>';
                        echo '    </div>';
                        echo '    <div class="inner-information">';
                        echo '        <h3>Reden gezocht:</h3>';
                        echo '        <p>'.$row['reden'].'</p>';
                        echo '    </div>';
                        echo '    <div class="inner-information">';
                        echo '        <h3>Gemaakt door:</h3>';
                        echo '        <p>'.$row['agent'].'</p>';
                        echo '    </div>';
                        echo '    <div class="inner-information">';
                        echo '        <h3>Gemaakt op:</h3>';
                        echo '        <p>'.$row['date'].'</p>';
                        echo '    </div>';
                        echo '</div>';
                        echo '<div class="wanted-container">';
                        echo '    <div class="searchedDescription">';
                        echo '        <h2>Beschrijving</h2>';
                        echo '        <p style="max-width: 65ch;">'.$row['beschrijving'].'</p>';
                        echo '    </div>';
                        echo '    <div class="searchedFor">';
                        echo '        <h2>Vuurwapen: </h2>';
                        if ($row['vuurwapen'] == '1'){
                            echo '<p style="color: red; font-weight: bolder;"> JA </p>';
                        } else {
                            echo '<p> NEE </p>';
                        }
                        echo '        <h2>Steek/slag wapen: </h2>';
                        if ($row['steekwapen'] == '1'){
                            echo '<p style="color: red; font-weight: bolder;"> JA </p>';
                        } else {
                            echo '<p> NEE </p>';
                        }
                        echo '        <h2>Drugs gebruik/bezit: </h2>';
                        if ($row['drugs'] == '1'){
                            echo '<p style="color: red; font-weight: bolder;"> JA </p>';
                        } else {
                            echo '<p> NEE </p>';
                        }
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
