<?php 

$secure = true; 
$httponly = true;
$samesite = 'none';
$lifetime=600;

if(PHP_VERSION_ID < 70300) {
    session_set_cookie_params($maxlifetime, '/; samesite='.$samesite, $_SERVER['HTTP_HOST'], $secure, $httponly);
} else {
    session_set_cookie_params([
        'lifetime' => $maxlifetime,
        'path' => '/',
        'domain' => $_SERVER['HTTP_HOST'],
        'secure' => $secure,
        'httponly' => $httponly,
        'samesite' => $samesite
    ]);
}

session_start(); 

include "../../config.php";

function discordmsg($msg, $webhook) {
    if($webhook != "") {
        $ch = curl_init( $webhook );
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
        curl_setopt( $ch, CURLOPT_POST, 1);
        curl_setopt( $ch, CURLOPT_POSTFIELDS, $msg);
        curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt( $ch, CURLOPT_HEADER, 0);
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

        $response = curl_exec( $ch );
        // If you need to debug, or find out why you can't send message uncomment line below, and execute script.
        echo $response;
        curl_close( $ch );
    }
}

$webhook = "https://discord.com/api/webhooks/1196220288476643378/ul9Dfv0ACnIleiPBUWX4V32fDYBt3AUWxnpotztHOrb1Viws22tx4wqrWbcwXfJkdVpR"; 
$timestamp = date("c", strtotime("now"));

if (isset($_POST['uname']) && isset($_POST['password'])) {

    function validate($data){

       $data = trim($data);

       $data = stripslashes($data);

       $data = htmlspecialchars($data);

       return $data;

    }

    $uname = validate($_POST['uname']);

    $pass = validate($_POST['password']);

    if (empty($uname)) {

        header("Location: ../../index.php?error=Gebruikersnaam kan niet leeg zijn");

        exit();

    }else if(empty($pass)){

        header("Location: ../../index.php?error=Wachtwoord kan niet leeg zijn");

        exit();

    }else{

        $sql = "SELECT * FROM users WHERE username='$uname' AND pass='$pass'";

        $result = $conn->query($sql);

        if ($result->num_rows === 1) {

            $row = mysqli_fetch_assoc($result);

            if ($row['username'] === $uname && $row['pass'] === $pass) {

                $username = $row['username'];
                $koppeling = $row['koppeling'];
                $admin = $row['admin'];
                $ibt = $row['ibt'];
                $serverowner = $row['serverowner'];
                $msg = json_encode([

                    "embeds" => [
                        [
                            // Title
                            "title" => "User login",
                 
                            // Embed Type, do not change.
                            "type" => "rich",
                 
                            // Description
                            "description" => "Er is een user ingelogd",
                 
                 
                            // Timestamp, only ISO8601
                            "timestamp" => $timestamp,
                 
                            // Left border color, in HEX
                            "color" => hexdec( "3366ff" ),
                 
                            // Footer text
                            "footer" => [
                                "text" => "Fusion Scripts",
                                "icon_url" => "https://media.discordapp.net/attachments/1168953209033855108/1196220957770125342/Fusion_Test_Logo.png?ex=65b6d695&is=65a46195&hm=d99bdedcd99bd39ac8e97540c5b144f2394c05b3141528ca101e5c9f00b163c7&=&format=webp&quality=lossless&width=625&height=625"
                            ],
                
                 
                            // thumbnail
                            //"thumbnail" => [
                            //    "url" => "https://ru.gravatar.com/userimage/28503754/1168e2bddca84fec2a63addb348c571d.jpg?size=400"
                            //],
                 
                            // Author name & url
                            "author" => [
                                "name" => "Fusion Scripts",
                            ],
                 
                            // Custom fields
                            "fields" => [
                                // Field 1
                                [
                                    "name" => "User:",
                                    "value" => $username,
                                    "inline" => false
                                ],
                                // Field 2
                                [
                                    "name" => "Server:",
                                    "value" => $koppeling,
                                    "inline" => false
                                ],

                                [
                                    "name" => "Admin:",
                                    "value" => $admin,
                                    "inline" => true
                                ],

                                [
                                    "name" => "IBT:",
                                    "value" => $ibt,
                                    "inline" => true
                                ],

                                [
                                    "name" => "**Serverowner**:",
                                    "value" => $serverowner,
                                    "inline" => true
                                ],
                                // etc
                            ]
                        ]
                    ]
                 
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
                discordmsg($msg, $webhook);
                echo "Logged in!";
                $sql2 = "UPDATE users SET lastlogin=now() WHERE username='$uname'";

                $result2 = $conn->query($sql2);

                $_SESSION['username'] = $row['username'];

                $_SESSION['id'] = $row['id'];

                $_SESSION['admin'] = $row['admin'];

                $_SESSION['ibt'] = $row['ibt'];

                $_SESSION['rank'] = $row['rank'];

                $_SESSION['name'] = $row['name'];

                $_SESSION['koppeling'] = $row['koppeling'];

                $_SESSION['serverowner'] = $row['serverowner'];

                $koppeling = $_SESSION['koppeling'];
                $sql3 = "SELECT * FROM servers WHERE koppeling='$koppeling'";

                $result3 = $conn->query($sql3);

                if ($result3->num_rows > 0) {

                    $row3 = mysqli_fetch_assoc($result3);

                    $_SESSION['dbuserstable'] = $row3['dbuserstable'];
                    $_SESSION['dblicensestable'] = $row3['dblicensestable'];
                    $_SESSION['dblicensesidcolumn'] = $row3['dblicensesidcolumn'];

                    $_SESSION['dbvehiclestable'] = $row3['dbvehiclestable'];
                    $_SESSION['dbuseridentifiers'] = $row3['dbuseridentifiers'];
                    $_SESSION['dbphonecolumn'] = $row3['dbphonecolumn'];
                    $_SESSION['dbplatecolumn'] = $row3['dbplatecolumn'];
                    $_SESSION['dbvehownercolumn'] = $row3['dbvehownercolumn'];
                }

                header("Location: /pages/dashboard.php");

                
                exit();

            }else{

                header("Location: ../../index.php?error=Ongeldige gebruikersnaam/wachtwoord");

                exit();

            }

        }else{

            header("Location: ../../index.php?error=Ongeldige gebruikersnaam/wachtwoord");

            exit();

        }

    }

}else{

    header("Location: ../../index.php");

    exit();

}