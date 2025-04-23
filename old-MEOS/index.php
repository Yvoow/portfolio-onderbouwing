<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="icon" type="images/fslogo.png" sizes="32x32" href="images/fslogo.png">
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/login.css">
</head>
<body>
    <main>
        <div class="content">
            <div class="container">
                <h1>Login</h1>
                <div class="logo-wrapper">
                    <img src="/images/politie_logo.png" alt="" class="logo">
                </div>
                <?php if (isset($_GET['error'])) { ?>

                    <p class="error-login"><?php echo $_GET['error']; ?></p>
            
                  <?php } ?>
                <form action="pages/phpfunctions/login.php" method="POST">
                    <div class="input-group">
                        <ion-icon name="mail-outline"></ion-icon>
                        <input type="user" id="uname" name="uname" placeholder="Gebruiker">
                    </div>
                    <div class="input-group">
                        <input type="password" id="password" name="password" placeholder="Wachtwoord">
                    </div>
                    <button class="login-btn" type="submit">Login</button>
                </form>
            </div>
        </div> 
    </main>
</body>
</html>
<style>
    .error-login {
    color: #ff0000; 
    background-color: #fff4f4;
    border: 1px solid #ff0000; 
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    text-align: center;
    font-weight: bold;
}
</style>