<?php
session_start();
if (!isset($_SESSION['username'])) {
  header('location: ../../index.php');
}
include('../config.php');
$koppel = $_SESSION['koppeling'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
    <link rel="icon" type="/images/fslogo.png" sizes="32x32" href="/images/fslogo.png">
    <link rel="stylesheet" href="/css/personsearch.css">
    <link rel="stylesheet" href="/css/collega.css">
    <link rel="stylesheet" href="/css/main.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <title>MEOS | Collega's</title>
</head>
<body>
    <main>
            <?php include 'main/sidebar.php'; ?>
        <div class="content">
            <div class="all-content">
                <div class="all-cards-wrapper">
                    <div class="collega-container">
                        <div class="collega-search">
                                <input type="text" id="searchInput" placeholder="Zoek naar een collega" onkeyup="searchName()">
                        </div>
                        <div id="no-colleagues-found" style="display: none; color: black;  font-size:26px;">Geen collega's gevonden</div>
                        <?php
                            $sql = "SELECT * FROM users WHERE koppeling='$koppel' and serverowner='0'";
                            $result = $conn->query($sql);
                            if ($result->num_rows > 0) {
                                while($row = $result->fetch_assoc()) {
                                    echo '<div class="collega-card">';
                                    echo '<img src="'.$row['img'].'" alt="Avatar" class="profile-picture">';
                                    echo '<div>';
                                    echo '<p class="name"><a href="#" onclick="loadAgentDetails('.$row['id'].')">'.$row['roepnummer'].' - '.$row['name'].'</a></p>';
                                    echo '<p>'.$row['rank'].'</p>';
                                    echo '</div>';
                                    echo '</div>';
                                }
                            } 
                        ?>
                    </div>
                    <div id="agent-details" class="agent-details"></div>
                </div>
            </div> 
    </main>
    <script>
        function loadAgentDetails(agentId) {
            $.ajax({
                url: 'collegaDetails.php',
                type: 'GET',
                data: {id: agentId},
                success: function(data) {
                    $('#agent-details').html(data);
                },
                error: function() {
                    $('#agent-details').html('<p>Error loading details.</p>');
                }
            });
        }
    </script>
</body>
</html>
<script src="/js/loader.js"></script>
<script src="/js/main.js"></script>
<script src="/js/searchfunctions/searchfilterCollega.js"></script>
<script src="/js/straffenPopUp.js"></script>
