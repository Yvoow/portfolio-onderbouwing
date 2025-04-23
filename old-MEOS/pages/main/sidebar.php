<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
</head>
<body>
  <div class="side-bar">
    <a href="/pages/dashboard.php">
    <div class="sidebar-text-logo">
      <?php
          $koppel = $_SESSION['koppeling'];
          $sql2 = "SELECT * FROM servers WHERE koppeling='$koppel'";
          $result2 = $conn->query($sql2);
          if ($result2->num_rows > 0) {
            while($row2 = $result2->fetch_assoc()) {
              echo '<img src="'.$row2['serverlogo'].'" alt="Logo" class="sidebar-logo">';
                echo '<h3 class="server-name">'.$row2['servername'].'</h3>';
              }
          }

          function isPageActive($pageName) {
            $currentPage = basename($_SERVER['PHP_SELF']);
            return ($currentPage == $pageName) ? 'active' : '';
        }
          ?>
    </div>
    </a>
      <ul>
      <li class="side-bar-item">
        <a class="<?php echo isPageActive('dashboard.php'); ?>" href="/pages/dashboard.php">
            <i class="fas sidebar-icon fa-home"></i>
            Dashboard
        </a>
    </li>
        <li class="side-bar-item">
          <a  class="<?php echo isPageActive('newrapport.php'); ?>" href="/pages/newrapport.php">
              <i class="fas sidebar-icon fa-plus"></i>
              Maak rapport
          </a>
        </li>
        <li class="side-bar-item dropdown">
          <a href="javascript:void(0)" class="dropbtn" onclick="toggleDropdown('dropdown2', 'arrow2')">
            <i class="fas sidebar-icon fa-search"></i>
            Zoeken
            <i class="fas dropdown-arrow fa-chevron-down" id="arrow2"></i> 
          </a>            
          <div class="dropdown-content" id="dropdown2">
            <a class="<?php echo isPageActive('persons.php'); ?>" href="/pages/persons.php"><i class="fas sidebar-icon fa-user"></i>Personen</a>
            <a class="<?php echo isPageActive('vehicles.php'); ?>" href="/pages/vehicles.php"><i class="fas sidebar-icon fa-car"></i>Auto's</a>
            <a class="<?php echo isPageActive('reports.php'); ?>" href="/pages/reports.php"><i class="fas sidebar-icon fa-sticky-note"></i>Rapporten</a>
          </div>

        </li>
        <li class="side-bar-item">
          <a class="<?php echo isPageActive('arrestatiebevelen.php'); ?>" href="/pages/arrestatiebevelen.php">
              <i class="fas sidebar-icon fa-asterisk"></i>
              Arrestiebevelen
          </a>
        </li>
        <li class="side-bar-item">
          <a class="<?php echo isPageActive('collega.php'); ?>" href="/pages/collega.php">
              <i class="fas sidebar-icon fa-users"></i>
              Collega's
          </a>
        </li>
        <li class="side-bar-item">
          <a class="<?php echo isPageActive('straffen.php'); ?>" href="/pages/straffen.php">
              <i class="fas sidebar-icon fa-book"></i>
              Straffen
          </a>
        </li>
        <li class="side-bar-item">
          <a  class="<?php echo isPageActive('documents.php'); ?>" href="/pages/documents.php">
              <i class="fas sidebar-icon fa-folder"></i>
              Documenten
          </a>
        </li>

        <?php
          $usernamee = $_SESSION['username'];
          $sql = "SELECT * FROM users WHERE username='$usernamee'";
          $result = $conn->query($sql);
          if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
              if ($row['admin'] == 1) {
                echo '<li class="side-bar-item dropdown">';
                echo '  <a href="javascript:void(0)" class="dropbtn" onclick="toggleDropdown(\'dropdown1\', \'arrow1\')">';
                echo '    <i class="fas sidebar-icon fa-crown"></i>';
                echo '    Adminconsole';
                echo '    <i class="fas dropdown-arrow fa-chevron-down" id="arrow1"></i>';
                echo '  </a>';
                echo '  <div class="dropdown-content" id="dropdown1">';
                echo '    <a class="' . isPageActive('collega2.php') . '" href="/pages/collega2.php"><i class="fas sidebar-icon fa-user"></i>Personeel</a>';
                echo '    <a class="' . isPageActive('straffenMakeIt.php') . '" href="/pages/straffenMakeIt.php"><i class="fas sidebar-icon fa-user"></i>Staffen</a>';
                echo '    <a class="' . isPageActive('admindocument.php') . '" href="/pages/adminconsole/admindocument.php"><i class="fas sidebar-icon fa-file"></i>Documenten</a>';
                echo '  </div>';
                echo '</li>';                
                } if ($row['serverowner'] == 1) {
                  echo '<li class="side-bar-item dropdown">';
                  echo '  <a href="javascript:void(0)" class="dropbtn" onclick="toggleDropdown(\'dropdown3\', \'arrow3\')">';
                  echo '    <i class="fas sidebar-icon fa-gears"></i>';
                  echo '    Server';
                  echo '    <i class="fas dropdown-arrow fa-chevron-down" id="arrow3"></i>';
                  echo '  </a>';
                  echo '  <div class="dropdown-content" id="dropdown3">';
                  echo '    <a class="' . isPageActive('databasesettings.php') . '" href="/pages/serverconsole/databasesettings.php"><i class="fas sidebar-icon fa-database"></i>Database settings</a>';
                  echo '    <a class="' . isPageActive('serversettings.php') . '" href="/pages/serverconsole/serversettings.php"><i class="fas sidebar-icon fa-gear"></i>Server settings</a>';
                  echo '    <a class="' . isPageActive('admins.php') . '" href="/pages/serverconsole/admins.php"><i class="fas sidebar-icon fa-user"></i>Admins</a>';
                  echo '  </div>';
                  echo '</li>';                  
                } if ($row['ibt'] == 1) {
                  echo '<li class="side-bar-item dropdown">';
                  echo '  <a href="javascript:void(0)" class="dropbtn" onclick="toggleDropdown(\'dropdown4\', \'arrow4\')">';
                  echo '    <i class="fas sidebar-icon fa-school"></i>';
                  echo '    IBT';
                  echo '    <i class="fas dropdown-arrow fa-chevron-down" id="arrow4"></i>';
                  echo '  </a>';
                  echo '  <div class="dropdown-content" id="dropdown4">';
                  echo '    <a class="' . isPageActive('ibtaanvragen.php') . '" href="/pages/ibtaanvragen.php"><i class="fas sidebar-icon fa-school"></i>Aanvragen</a>';
                  echo '  </div>';
                  echo '</li>';
                  
                }
              }
          } else {
              echo "0 documenten gevonden";
          }
          ?>

      </ul>
      <?php
          $usernamee = $_SESSION['username'];
          $sql = "SELECT * FROM users WHERE username='$usernamee'";
          $result = $conn->query($sql);
          if ($result->num_rows > 0) {
              // output data of each row
              while($row = $result->fetch_assoc()) {
                  echo '<a href="profile.php?id='.$row['id'].'" class="bottom-section-sidebar">';
                  echo '<img src=' .$row['img']. ' alt="Icon" class="sidebar-icon-bottom">';
                  echo '<div class="text-section-sidebar">';
                  echo '<p class="text-sidebar">' .$row['name']. '</p>';
                  echo '<p class="text-sidebar">' .$row['rank']. ' <br> '.$row['roepnummer'].'</p>';
                  echo '</div>';
                  echo '</a>';
              }
          } else {
              echo "0 documenten gevonden";
          }
          ?>
    <span style="color: white; font-size: 25px; margin-bottom: 20px;"><a href="../pages/phpfunctions/logout.php" style="color: white; text-decoration: none;"><i class="fas header-nav-icon fa-door-open"></i>Uitloggen</a></span>
    </div>
</body>
</html>