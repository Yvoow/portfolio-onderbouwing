<?php
include('../config.php');

if (!isset($_GET['id'])) {
    echo "Agent ID not specified.";
    exit;
}
?>
<link rel="icon" type="/images/fslogo.png" sizes="32x32" href="/images/fslogo.png">
<div class="test">
<!-- =----= Als je op agent klikt informatie over die agent =----= -->
        <?php 
        $agent_id = $_GET['id'];
        $sql = "SELECT * FROM users WHERE id = ".$agent_id;
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo '<div class="collega-container agent-info left-div">';
                echo '    <div class="photoOfPersonWrapper"><img src="'.$row['img'].'" alt="Avatar" class="imageItSelf"></div>';
                echo '    <div class="inner-information middle-section">';
                echo '        <p><h3>Naam:</h3>'.$row['name'].'</p>';
                echo '    </div>';
                echo '    <div class="inner-information middle-section">';
                echo '        <p><h3>Rang:</h3>'.$row['rank'].'</p>';
                echo '    </div>';
                echo '    <div class="inner-information middle-section">';
                echo '        <h3>Roepnummer:</h3>';
                echo '        <p>'.$row['roepnummer'].'</p>';
                echo '    </div>';
                echo '    <div class="inner-information middle-section">';
                echo '        <h3>Laatste inlog:</h3>';
                echo '        <p>'.$row['lastlogin'].'</p>';
                echo '    </div>';
                echo '</div>';
                echo '    <div class="inner-information middle-section">';
                echo '        <h3>Specialisaties:</h3>';
                echo '        <p>'.$row['specialisaties'].'</p>';
                echo '    </div>';
                echo '</div>';
            }
        } else {
            echo "No agent found with ID " . $agent_id;
        }
        
        $agent = $result->fetch_assoc();
        ?>
</div>
    
<style>
.test {
    display: flex;
    gap: 50px;
    width: 100%;
}
.normal-button {
    margin-bottom: 50px;
}
.imageItSelf {
    width: 100%;
    border-radius: 50%;
}
.left-div {
    margin-left: 50px;
}
</style>
