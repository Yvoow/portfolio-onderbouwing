<?php
session_start();
if (!isset($_SESSION['serverowner']) || $_SESSION['serverowner'] !== '1') {
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
    <link rel="icon" type="../../images/fslogo.png" sizes="32x32" href="../../images/fslogo.png">
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/newrapport.css">
    <link rel="stylesheet" href="/css/serverconsole.css">
    <title>MEOS | Admins</title>
</head>

<body>
  <main>
        <?php include '../main/sidebar.php'; ?>
    <div class="content">

        <!-- =----= Buttons on top =----= -->
      <div class="top-container-buttons">
        <h1>Admin Management</h1>
      </div>

      <form id="promoteuser" class="rapport-wrapper" method="POST" action="../phpfunctions/updateuser.php" style="gap: 250px !important;">
      <div class="management-section">
        <div class="input-container">
            <label for="username">User:</label>
            <select id="username" name="username" class="input-with-border-label-management" required>
                <option value="">Selecteer een gebruiker</option>
                <?php
                $koppeling = $_SESSION['koppeling'];
                $sql = "SELECT * FROM users WHERE koppeling='$koppeling'";
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    // output data of each row
                    while ($row = $result->fetch_assoc()) {
                        echo '<option value="' . $row['username'] . '">' . $row['name'] . '</option>';
                    }
                } else {
                    echo '<option value="">Geen gebruikers gevonden</option>';
                }
                ?>
            </select>
        </div>
        <div class="serverconsole-savebuttons">
            <button type="submit" form="promoteuser" class="save-button"> Admin maken </button>
      </div>
        </div>
    </form>

    <form id="createadmin" class="rapport-wrapper" method="POST" action="../phpfunctions/createadmin.php" style="gap: 250px !important;">
        <div class="management-section">
          <div class="input-container-management">
              <label for="titelDocument">Username</label>
                <input id="titelDocument" name="username" class="input-with-border-label-management" style="color: black;" type="text" required/>
            </div>
            <div class="input-container-management">
              <label for="titelDocument">password</label>
              <input id="titelDocument" name="pass" class="input-with-border-label-management" style="color: black;" type="password" required/>
            </div>
            <div class="input-container-management">
                <label for="titelDocument">Naam</label>
                <input id="titelDocument" name="name" class="input-with-border-label-management" style="color: black;" type="text" required/>
            </div>      
        <div class="serverconsole-savebuttons">
            <button type="submit" form="createadmin" class="save-button"> Account aanmaken </button>
      </div>
        </div>
    </form>

    <form id="removeadmin" class="rapport-wrapper" method="POST" action="../phpfunctions/removeadminperms.php" style="gap: 250px !important;">
        <div class="management-section">
        <div class="input-container">
            <label for="username">User:</label>
            <select id="username" name="username" class="input-with-border-label-management" required>
                <option value="">Selecteer een gebruiker</option>
                <?php
                $koppeling = $_SESSION['koppeling'];
                $sql = "SELECT * FROM users WHERE koppeling='$koppeling' and admin='1'";
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    // output data of each row
                    while ($row = $result->fetch_assoc()) {
                        echo '<option value="' . $row['username'] . '">' . $row['name'] . '</option>';
                    }
                } else {
                    echo '<option value="">Geen gebruikers gevonden</option>';
                }
                ?>
            </select>
        </div>
        <div class="serverconsole-savebuttons">
            <button type="submit" form="removeadmin" class="save-button">Perms verwijderen </button>
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