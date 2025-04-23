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
    <title>MEOS | Database settings</title>
</head>

<body>
  <main>
        <?php include '../main/sidebar.php'; ?>
    <div class="content">

        <!-- =----= Buttons on top =----= -->
      <div class="top-container-buttons">
        <h1>Database Management</h1>
      </div>

      <form id="reportForm" class="rapport-wrapper" method="POST" action="../phpfunctions/updatedatabase.php" style="gap: 250px !important;">
        <div class="management-section">

        <?php
          $koppel = $_SESSION['koppeling'];
          $sql = "SELECT * FROM servers WHERE koppeling='$koppel'";
          $result = $conn->query($sql);
          if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo '<h1 style="font-size: 20px;">Database credentials</h1>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Database Hostname</label>';
                echo '    <input id="titelDocument" name="dbhost" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['dbhost'].'" required/>';
                echo '</div>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Database User</label>';
                echo '    <input id="titelDocument" name="dbuser" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['dbuser'].'" required/>';
                echo '</div>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Database Password</label>';
                echo '    <input id="titelDocument" name="dbpass" class="input-with-border-label-management" style="color: black;" type="password" value="'.$row['dbpass'].'"/>';
                echo '</div>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Database Name</label>';
                echo '    <input id="titelDocument" name="dbdatabase" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['dbdatabase'].'" required/>';
                echo '</div>';
                echo '<br><h1 style="font-size: 20px;">Database tables</h1>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Users table</label>';
                echo '    <input id="titelDocument" name="dbuserstable" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['dbuserstable'].'" required/>';
                echo '</div>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Vehicles table</label>';
                echo '    <input id="titelDocument" name="dbvehiclestable" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['dbvehiclestable'].'" required/>';
                echo '</div>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Licenses table</label>';
                echo '    <input id="titelDocument" name="dblicensestable" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['dblicensestable'].'" required/>';
                echo '</div>';
                echo '<br><h1 style="font-size: 20px;">Database columns</h1>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Identifier column</label>';
                echo '    <input id="titelDocument" name="dbuseridentifiers" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['dbuseridentifiers'].'" required/>';
                echo '</div>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Phone column</label>';
                echo '    <input id="titelDocument" name="dbphonecolumn" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['dbphonecolumn'].'" required/>';
                echo '</div>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Licenses id column</label>';
                echo '    <input id="titelDocument" name="dblicensesidcolumn" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['dblicensesidcolumn'].'" required/>';
                echo '</div>';
              }
          } else {
              echo "0 documenten gevonden";
          }
          ?>
        <div class="serverconsole-savebuttons">
            <button type="submit" form="reportForm" class="save-button"> Gegevens opslaan </button>
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