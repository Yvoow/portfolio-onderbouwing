<?php
session_start();
if (!isset($_SESSION['username'])) {
  header('location: ../../index.php');
}
?>
<?php include('../../config.php');?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
    <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
    <link rel="icon" type="../../images/fslogo.png" sizes="32x32" href="../../images/fslogo.png">
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/straffen.css">
    <link rel="stylesheet" href="/css/newrapport.css">
    <link rel="stylesheet" href="/css/document.css">
    <title>Document</title>
</head>
<body>
    <div class="scrollbar" id="style-1">
        <div class="force-overflow"></div>
      </div>
    <main>
          <?php include '../main/sidebar.php'; ?>
          <div class="content">
            <div class="all-content" style="display: flex; justify-content: space-between;">
                <div class="fine-search">
                        <button class="black-button">Document toevoegen</button>
                </div>
                <div class="fine-search">
                    <input type="text" id="searchInput" placeholder="Zoek documenten...">
                </div>
            </div>
            <h2 style="margin-top: 50px; margin-bottom: 20px;">Informatie</h2>
            <div class="document-container">
            <?php
                    $koppeling = $_SESSION['koppeling'];
                    $usernamee = $_SESSION['username'];
                    $sql = "SELECT * FROM documents WHERE training='0' AND koppeling='$koppeling'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            echo '<div class="document-card">';
                            echo '<a href="phpfunctions/deletedocu.php?id=' . $row['id'] . '" class="delete-document"><i class="fas fa-trash-alt"></i></a>';
                            echo '<img src="'.$row['img'].'">';
                            echo '<h3>'.$row['name'].'</h3>';
                            echo '</div></a>';
                        }
                    } else {
                        echo "401 error";
                    }
                    ?>
            </div>


            <h2 style="margin-top: 50px; margin-bottom: 20px;">Trainingen</h2>
            <div class="document-container">
            <?php
                    $koppeling = $_SESSION['koppeling'];
                    $usernamee = $_SESSION['username'];
                    $sql = "SELECT * FROM documents WHERE training='1' AND koppeling='$koppeling'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            echo '<div class="document-card">';
                            echo '<a href="phpfunctions/deletedocu.php?id=' . $row['id'] . '" class="delete-document"><i class="fas fa-trash-alt"></i></a>';
                            echo '<img src="'.$row['img'].'">';
                            echo '<h3>'.$row['name'].'</h3>';
                            echo '</div></a>';
                        }
                    } else {
                        echo "401 error";
                    }
                    ?>
            </div>
        </div>
        </div>
    </div>
    </div>

    <!-- Popup gebeuren -->
    <div id="addDocumentPopup" class="addDocumentPopup">
        <div class="document-added-content">
            <span class="close"></span>
          <div class="top-container-buttons">
            <button class="black-button">Opslaan</button>
            <h1>Nieuw document</h1>
            <button type="submit" form="docuform" class="black-button"> Document indienen </button>
          </div>
    
          <form id="docuform" class="rapport-wrapper" method="POST" action="../phpfunctions/createdocu.php" style="gap: 200px !important;">
            <div class="report-section">
    
                <!-- =----= Type =----= -->
                <div class="input-container">
                    <label for="training">Document type</label>
                    <select id="training" name="training"  class="input-with-border-label" required>
                        <option value="" selected >Kies type</option>
                        <option value="0">Informatie</option>
                        <option value="1">Trainingen</option>
                    </select>
                </div>
    
                <!-- =----= Head agents =----= -->
                <div class="input-container">
                    <label for="titelDocument">Titel van document</label>
                    <input id="titelDocument" name="titelDocument" class="input-with-border-label" type="text" required/>
                </div>

                <div class="input-container">
                    <label for="titelDocument">Image (url)</label>
                    <input id="titelDocument" name="imagedocu" class="input-with-border-label" type="text" required/>
                </div>

                <!-- =----= Box information =----= -->
                <div class="input-container text-information" id="editableContainer">
                <label for="description">Beschrijving</label>
                    <div class="counts-container">
                        <span id="wordCount">0 woorden</span> | <span id="charCount">0 Karakters</span>
                    </div>
                    <textarea id="extraInformation" class="input-with-border-label" oninput="countWordsAndCharacters()" name="extraInformation"></textarea>
                </div>
            </div>
        </form>
        </div>
        </div>

    </main>
</body>
</html>
<script src="/js/loader.js"></script>
<script src="/js/main.js"></script>
<script src="/js/charcterscounter.js"></script>
<script src="/js/searchfunctions/searchdocuments.js"></script>
<script src="/js/modal-popups/documentsModalPopup.js"></script>