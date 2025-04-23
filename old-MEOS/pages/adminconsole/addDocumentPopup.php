<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/newrapport.css">
</head>

<body>
  <main>
        <?php include '../main/sidebar.php'; ?>
    <div class="content">

        <!-- =----= Buttons on top =----= -->
      <div class="top-container-buttons">
        <button class="black-button">Opslaan</button>
        <h1>Nieuw document</h1>
        <button type="submit" form="reportForm" class="black-button"> Document indienen </button>
      </div>

      <form id="reportForm" class="rapport-wrapper" method="POST" action="#" style="gap: 250px !important;">
        <div class="report-section">

            <!-- =----= Type =----= -->
            <div class="input-container">
                <label for="reportType">Document type</label>
                <select id="reportType" class="input-with-border-label" required>
                    <option value="" selected >Kies type</option>
                    <option value="incident">Informatie</option>
                    <option value="accident">Trainingen</option>
                </select>
            </div>

            <!-- =----= Head agents =----= -->
            <div class="input-container">
                <label for="titelDocument">Titel van document</label>
                <input id="titelDocument" name="titelDocument" class="input-with-border-label" type="text" required/>
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

        <!-- =----= Foto xxxx hou je van he Yvo <3<3<3<3, maar dit moet wel anders word het niet mooi in de documenten pagina :( =----= -->
        <div class="report-section">
            <div class="input-container" style="border: none !important;">
                <h3>Upload hier je foto van de training</h3>
                <img src="/images/stockcar.png" style="width: auto; max-height: 250px;">
            </div>
        </div>
    </form>
    </div>
</main>
</body>
</html>
<script src="/js/loader.js"></script>
<script src="/js/charcterscounter.js"></script>
<script src="/js/main.js"></script>