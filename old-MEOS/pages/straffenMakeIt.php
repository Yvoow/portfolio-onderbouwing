<?php
session_start();
if (!isset($_SESSION['username'])) {
    header('location: ../../index.php');
}

$koppel = $_SESSION['koppeling'];
?>
<?php include('../config.php'); ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
    <link rel="icon" type="/images/fslogo.png" sizes="32x32" href="/images/fslogo.png">
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/straffen.css">
    <link rel="stylesheet" href="/css/newrapport.css">
    <title>MEOS | Maak straf</title>
</head>

<body>
    <div class="scrollbar" id="style-1">
        <div class="force-overflow"></div>
    </div>
    <main>
    <?php include 'main/sidebar.php'; ?>
        <div class="content">
            <div class="all-content">
                <div class="header-wrapper-text">
                    <div class="fine-header-wrapper">
                        <div class="fine-header-container">
                            <div class="top-container-buttons">
                            <button type="submit" form="reportForm" value="indienen" class="black-button" onclick="showModal('your_id_here')">Straf aanmaken </button>
                            </div>
                            <hr style="width: 50px; transform: rotate(90deg)">
                            <div class="fine-header-square verkeerswet-box"></div>
                            Verkeerswet
                        </div>
                        <div class="fine-header-container">
                            <div class="fine-header-square strafrecht-box"></div>
                            Strafrecht
                        </div>
                        <div class="fine-header-container">
                            <div class="fine-header-square opiumwet-box"></div>
                            Opiumwet
                        </div>
                    </div>
                    <div class="fine-search">
                        <input type="text" placeholder="Zoek straf">
                    </div>
                </div>

                <!-- Boetes zelf -->
                <div class="fine-wrapper">
                    <p id="no-fines-found" style="display: none; color: black; text-align:center; font-size:26px;">Geen straffen gevonden</p>
                    <?php
                    $sql = "SELECT * FROM straffen WHERE type='verkeerswet' AND koppeling='$koppel'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        // output data of each row
                        while ($row = $result->fetch_assoc()) {
                            echo '<div class="fine-container verkeerswet">';
                            echo '<div class="fine-title">' . $row['title'];
                            echo '</div>';
                            echo '<div class="fine-details">';
                            if ($row['boete'] >= 1) {
                                echo 'Boete: €' . $row['boete'];
                            }
                            if ($row['maanden'] >= 1) {
                                echo ' | Hechtenis: ' . $row['maanden'];
                                echo ' Maanden';
                            }
                            echo '</div>';
                            echo '<span class="fine-question-mark" onclick="showModalEdit(' . $row['id'] . ')">&#9998;</span>';

                            echo '</div>';
                        }
                    }
                    ?>
                    <?php
                    $sql = "SELECT * FROM straffen WHERE type='strafrecht' AND koppeling='$koppel'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        // output data of each row
                        while ($row = $result->fetch_assoc()) {
                            echo '<div class="fine-container strafrecht">';
                            echo '<div class="fine-title">' . $row['title'];
                            echo '</div>';
                            echo '<div class="fine-details">';
                            if ($row['boete'] >= 1) {
                                echo 'Boete: €' . $row['boete'];
                            }
                            if ($row['maanden'] >= 1) {
                                echo ' | Hechtenis: ' . $row['maanden'];
                                echo ' Maanden';
                            }
                            echo '</div>';
                            echo '<span class="fine-question-mark" onclick="showModalEdit(' . $row['id'] . ')">&#9998;</span>';

                            echo '</div>';
                        }
                    }
                    ?>
                    <?php
                    $sql = "SELECT * FROM straffen WHERE type='opiumwet' AND koppeling='$koppel'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        // output data of each row
                        while ($row = $result->fetch_assoc()) {
                            echo '<div class="fine-container opiumwet">';
                            echo '<div class="fine-title">' . $row['title'];
                            echo '</div>';
                            echo '<div class="fine-details">';
                            if ($row['boete'] >= 1) {
                                echo 'Boete: €' . $row['boete'];
                            }
                            if ($row['maanden'] >= 1) {
                                echo ' Hechtenis: ' . $row['maanden'];
                                echo ' Maanden';
                            }
                            echo '</div>';
                            echo '<span class="fine-question-mark" onclick="showModalEdit(' . $row['id'] . ')">&#9998;</span>';
                            echo '</div>';
                        }
                    }
                    ?>
                </div>
            </div>
        </div>
        </div>
        </div>
        <!-- Modal Structure -->
        <div id="popup-straffen" class="modal">
            <div class="straffen-pop-up">
                <span class="close"><i class="fa-solid fa-xmark"></i></span>
                <div id="straffen-content-pop-up">Aan het laden</div>
            </div>
        </div>
    </main>
</body>

</html>
<script src="/js/loader.js"></script>
<script src="/js/main.js"></script>
<script src="/js/searchfunctions/searchfilter.js"></script>
<script src="/js/modal-popups/makeStrafPopup.js"></script>