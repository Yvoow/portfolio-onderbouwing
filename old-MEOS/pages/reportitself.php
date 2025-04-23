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
    <link rel="stylesheet" href="/css/personsearch.css">
    <link rel="stylesheet" href="/css/newrapport.css">
    <link rel="stylesheet" href="/css/main.css">
    <title>MEOS | Rapport</title>
</head>
<body>
    <main>
            <?php include 'main/sidebar.php'; ?>
        <div class="content">
            <div class="report-container">
            <?php
                $id = $_GET['id'];
                    $sql = "SELECT * FROM rapporten WHERE id='$id'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                      while($row = $result->fetch_assoc()) {
                        echo '<div class="top-container-buttons">';
                        echo '    <button class="black-button" onClick="window.location.reload();">Herladen</button>';
                        echo '    <h1>#'.$row['id'].'</h1>';
                        if ($_SESSION['admin'] == '1') {
                            echo '   <a href="phpfunctions/deletereport.php?id='.$row['id'].'" class="black-button deleteclass">Verwijderen</a>';
                            echo '   <a href="changereport.php?id='.$row['id'].'" class="black-button deleteclass">Bewerken</a>';
                        }
                        echo '</div>';

                        echo '<div class="header-content second-header-content">';
                        echo '    <div class="inner-information">';
                        echo '        <h3>Type:</h3>';
                        echo '        <p>'.$row['type'].'</p>';
                        echo '    </div>';

                        echo '    <div class="inner-information">';
                        echo '        <h3>Rapport titel</h3>';
                        echo '        <p>'.$row['title'].'</p>';
                        echo '    </div>';

                        echo '    <div class="inner-information">';
                        echo '        <h3>Gemaakt: ' .time_elapsed_string($row['added']). '</h3>';
                        echo '        <p>Door: '.$row['agent'].' ('.$row['added'].')</p>';
                        echo '    </div>';

                        echo '    <div class="inner-information">';
                        echo '        <h3>Laatste keer geupdate</h3>';
                        echo '        <p>Door: '.$row['agent'].' ('.$row['added'].')</p>';
                        echo '    </div>';
                        echo '</div>';

                        echo '<div class="content-report">';
                        echo '    <div class="information-container">';
                        echo '        <div class="inner-information">';
                        echo '            <h3>Rapport notities:</h3>';
                        echo '        </div>';
                        echo $row['text'];
                        echo '    </div>';

                        echo '    <div class="fines-wrapper">';
                        echo '        <div class="header-content">';
                        echo '            <div class="inner-information">';
                        echo '                <h3>Hoofd-Agenten</h3>';
                        echo '                <p>'.$row['agent'].'</p>';
                        echo '            </div>';

                        echo '            <div class="inner-information">';
                        echo '                <h3>Helpende agenten</h3>';
                        echo '                <p>'.$row['helpers'].'</p>';
                        echo '            </div>';
                        echo '        </div>';

                        echo '        <div class="add-fines">';
                        echo '            <div class="fines-header">';
                        echo '                <span class="name-title-fine">Straffen</span>';
                        echo '            </div>';

                        echo '            <div class="all-fines" style="display: grid; grid-template-columns: 1fr; grid-gap: 20px;">';
                        echo    $row['straffen'];
                        echo '            </div>';

                        echo '            <div class="fines-bottom">';
                        echo '                <span>Maanden: '.$row['maanden'].'</span>';
                        echo '                <span>Boete: €'.$row['boete'].'.-</span>';
                        echo '            </div>';
                        echo '        </div>';
                        echo '    </div>';
                        echo '</div>';
                      }
                    } else {
                      echo "0 info gevonden";
                    }
                  ?>
                <!-- 2e rij informatie kolom -->
            </div>
        </div> 
    </main>
</body>
</html>
<?php
function time_elapsed_string($datetime, $full = false)
{
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
<style>
    .header-content {
        display: flex;
        justify-content: start;
        gap: 100px;
    }
    .second-header-content {
        margin: 50px 0px;
    }
    .content-report {
        display: grid;
        grid:
            "information-container add-fines" 1fr
            / 1.5fr 1fr;
        gap: 150px;
    }
    .information-container { grid-area: information-container; }
    .add-fines { grid-area: add-fines; }
    .deleteclass {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--black);
    font-size: var(--buttons);
    width: 200px;
    height: 50px; 
    background-color: transparent;
    cursor: pointer;
    text-align: center;
    padding: 0 10px; 
    font-weight:550;
}

</style>