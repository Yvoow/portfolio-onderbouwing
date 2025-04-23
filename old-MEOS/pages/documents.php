<?php
session_start();
if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== '1') {
    header('location: ../../index.php');
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
    <title>MEOS | Documenten</title>
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
                    <input type="text" id="searchInput" placeholder="Zoek documenten...">
                </div>
            </div>
            <p id="no-results-message" style="display: none; color: black; text-align:center; font-size:26px;">Geen documenten gevonden</p>
            <h2 style="margin-top: 50px; margin-bottom: 20px;" class="hiddenOnNoResult">Informatie</h2>
            <div class="document-container">
                <?php
                    $koppeling = $_SESSION['koppeling'];
                    $usernamee = $_SESSION['username'];
                    $sql = "SELECT * FROM documents WHERE training='0' AND koppeling='$koppeling'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            echo '<a href="documentitself.php?id='.$row['id'].'">';
                            echo '<div class="document-card">';
                            echo '<img src="'.$row['img'].'">';
                            echo '<h3>'.$row['name'].'</h3>';
                            echo '</div></a>';
                        }
                    } else {
                        echo "401 error";
                    }
                    ?>
            </div>

            <?php
                $koppeling = $_SESSION['koppeling'];
                $usernamee = $_SESSION['username'];
                $sql3 = "SELECT * FROM users WHERE username='$usernamee'";
                $result3 = $conn->query($sql3);
                if ($result3->num_rows > 0) {
                    while($row3 = $result3->fetch_assoc()) {
                        if ($row3['ibt'] == 1) {
                            echo '<h2 style="margin-top: 50px; margin-bottom: 20px;" class="hiddenOnNoResult">Trainingen</h2>';
                            echo '<div class="document-container">';
                        }
                    }
                }
            ?>
                <?php
                    $sql = "SELECT * FROM documents WHERE training='1' AND koppeling='$koppeling'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            $usernamee = $_SESSION['username'];
                            $sql2 = "SELECT * FROM users WHERE username='$usernamee'";
                            $result2 = $conn->query($sql2);
                            if ($result2->num_rows > 0) {
                              while($row2 = $result2->fetch_assoc()) {
                                if ($row2['ibt'] == 1) {
                                    echo '<a href="documentitself.php?id='.$row['id'].'">';
                                    echo '<div class="document-card">';
                                    echo '<img src="'.$row['img'].'">';
                                    echo '<h3>'.$row['name'].'</h3>';
                                    echo '</div></a>';
                                }
                              }
                            }
                        }
                    } else {
                    }
                ?>
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
