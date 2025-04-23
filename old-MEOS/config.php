<?php

$meosname= "localhost";

$meosmae= "root";

$meospass = "";

$meos_db = "meos";

$conn = mysqli_connect($meosname, $meosmae, $meospass, $meos_db);


if (!$conn) {

    echo "Connection to meos database failed!";

}