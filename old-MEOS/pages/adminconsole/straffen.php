<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
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
            <div class="all-content">
                <div class="all-content" style="display: flex; justify-content: space-between;">
                    <div class="fine-search">
                            <button class="black-button">Straf toevoegen</button>
                    </div>
                    <div class="fine-search">
                        <input type="text" id="searchInput" placeholder="Zoek documenten...">
                    </div>
                </div>

            <!-- Static Boetes zelf -->
            <div class="fine-wrapper">
            <p id="no-fines-found" style="display: none; color: black; text-align:center; font-size:26px;">Geen straffen gevonden</p>
                <div class="fine-container verkeerswet">
                    <div class="fine-title">Title 1 - Verkeerswet</div>
                    <div class="fine-details">Boete: €50 | Hechtenis: 2 Maanden</div>
                    <span class="fine-question-mark">&#9998;</span>
                </div>
                <div class="fine-container strafrecht">
                    <div class="fine-title">Title 2 - Strafrecht</div>
                    <div class="fine-details">Boete: €100 | Hechtenis: 1 Maand</div>
                    <span class="fine-question-mark">&#9998;</span>
                </div>  
                <div class="fine-container opiumwet">
                    <div class="fine-title">Title 3 - Opiumwet</div>
                    <div class="fine-details">Boete: €200 | Hechtenis: 3 Maanden</div>
                    <span class="fine-question-mark" >&#9998;</span>
                </div>
            </div>
          </div>
        </div>
    </main>
    <!-- Modal Structure -->
    <div id="popup-straffen" class="modal">
        <div class="straffen-pop-up">
            <span class="close"><i class="fa-solid fa-xmark"></i></span>
            <div id="straffen-content-pop-up">Aan het laden</div>
        </div>
    </div>
</body>
</html>
<script src="/js/loader.js"></script>
<script src="/js/main.js"></script>
<script src="/js/searchfunctions/searchfilter.js"></script>
<script src="/js/modal-popups/straffenPopUp.js"></script>
