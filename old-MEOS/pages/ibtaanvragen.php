<?php
session_start();

if (!isset($_SESSION['ibt']) || $_SESSION['ibt'] !== '1') {
    header('location: ../index.php');
}

?>
<?php include('../config.php');?>
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
    <link rel="stylesheet" href="/css/document.css">
    <title>MEOS | IBT aanvragen</title>
</head>
<body>
    <div class="scrollbar" id="style-1">
        <div class="force-overflow"></div>
      </div>
    <main>
          <?php include 'main/sidebar.php'; ?>
          <div class="content">
            <div class="all-content">
                <div class="fine-search">
                    <input type="text" id="searchInput" placeholder="Zoek aanvragen...">
                </div>
            </div>
            <p id="no-results-message" style="display: none; color: black; text-align:center; font-size:26px;">Geen documenten gevonden</p>
            <h2 style="margin-top: 50px; margin-bottom: 20px;" class="hiddenOnNoResult">Aanvragen</h2>
            <div class="document-container">
             <?php
                    $koppeling = $_SESSION['koppeling'];
                    $sql = "SELECT * FROM trainingen WHERE koppeling='$koppeling'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            echo '<div class="document-card">';
                            echo '<a href="phpfunctions/deletetraining.php?id=' . $row['id'] . '" class="delete-button"><i class="fas fa-trash-alt"></i></a>';
                            echo '<h3>Agent: '.$row['aanvraaguser'].'</h3>';
                            echo '<p>Rang: '.$row['rang'].'</p>';
                            echo '<p>Training: '.$row['training'].'</p>';
                            echo '<p>Overige informatie: '.$row['extra'].'</p>';
                            echo '</div>';
                            }
                        }
                ?>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>

    </main>
</body>
</html>
<script src="/js/loader.js"></script>
<script src="/js/main.js"></script>
<script src="/js/searchfunctions/searchdocuments.js"></script>
