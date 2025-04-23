<?php
session_start();
if (!isset($_SESSION['username'])) {
    header('location: ../../index.php');
  }
?>
<?php 
include('../config.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
    <link rel="icon" type="/images/fslogo.png" sizes="32x32" href="/images/fslogo.png">
    <link rel="stylesheet" href="/css/newrapport.css">
    <link rel="stylesheet" href="/css/reports.css">
    <link rel="stylesheet" href="/css/main.css">
    <title>MEOS | Gebruikers</title>
</head>
<body>
    <main>
            <?php include 'main/sidebar.php'; ?>
        <div class="content">
            <div class="header-content-container">

                <div class="input-container">
                    <label for="reductionPercent">Zoek voor persoon</label>
                    <input id="reductionPercent" class="input-with-border-label" type="text" />
                </div>
            </div>
            <div class="person-container">
                <div class="searched-person-wrapper">
                    <?php
                        $sql = "SELECT * FROM rapporten ORDER BY id";
                        $result = $conn->query($sql);
                        if ($result->num_rows > 0) {
                            // output data of each row
                            while($row = $result->fetch_assoc()) {
                                echo '<a href="#" class="about-case-container">';
                                echo '<div class="case-number about-case">';
                                echo '<h3>Zaaknummer:</h3>';
                                echo '<p>#'.$row['id'].'</p>';
                                echo '</div>';
                                echo '<div class="type about-case">';
                                echo '<h3>Type:</h3>';
                                echo '<p>'.$row['type'].'</p>';
                                echo '</div>';
                                echo '<div class="suspects about-case">';
                                echo '<h3>Verdachte:</h3>';
                                echo '<p>'.$row['verdachte'].'</p>';
                                echo '</div>';
                                echo '<div class="officers about-case">';
                                echo '<h3>Hoofd-agent</h3>';
                                echo '<p>'.$row['agent'].'</p>';
                                echo '</div>';
                                echo '<div class="created about-case">';
                                echo '<h3>Gemaakt:</h3>';
                                echo '<p>';
                                echo time_elapsed_string($row['added']);
                                echo '</p>';
                                echo '</div>';
                                echo '</a>';
                            }
                        } else {
                            echo '<p class="nothingFound">Geen personen gevonden</p>';
                        }
                    ?>
                </div>
            </div>
        </div> 
    </main>
</body>
</html>
<?php
function time_elapsed_string($datetime, $full = false) {
    $now = new DateTime;
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);

    $diff->w = floor($diff->d / 7);
    $diff->d -= $diff->w * 7;

    $string = array(
        'y' => 'jaren',
        'm' => 'maanden',
        'w' => 'weken',
        'd' => 'dagen',
        'h' => 'uur',
        'i' => 'minuten',
        's' => 'seconden',
    );
    foreach ($string as $k => &$v) {
        if ($diff->$k) {
            $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? '' : '');
        } else {
            unset($string[$k]);
        }
    }

    if (!$full) $string = array_slice($string, 0, 1);
    return $string ? implode(', ', $string) . ' geleden' : 'net aangemaakt';
}
?>
<script src="/js/loader.js"></script>
<script src="/js/main.js"></script>
<script src="/js/searchfunctions/searchfilterReports.js"></script>