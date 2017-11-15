
<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$result;
define("DB_SERVER", getenv('OPENSHIFT_MYSQL_DB_HOST'));
define("DB_USER", getenv('OPENSHIFT_MYSQL_DB_USERNAME'));
define("DB_PASSWORD", getenv('OPENSHIFT_MYSQL_DB_PASSWORD'));
define("DB_DATABASE", getenv('OPENSHIFT_APP_NAME'));

mysql_connect(DB_SERVER, DB_USER, DB_PASSWORD) or die(mysql_error());
mysql_select_db(DB_DATABASE) or die(mysql_error());

// GET ALL
getALL();

// GET BY firstName tag policyNumber
$tag = "12345";
getbyTag($tag);

// INSERT NEW DATA date("Y-m-d")
$num = "65339";
$first = "Trinh";
$mid = "Hong";
$last = "Le";
$email = "tringhong@yahoo.com";
$date = date("Y-m-d");
$query = "INSERT INTO HUAINS (policyNum, firstName, middleName, lastName, email, renewDate) VALUES ('" . $num . "','" . $first . "','" . $mid . "','" . $last . "','" . $email . "','" . $date . "')";
$result = mysql_query($query) OR die(mysql_error());
getALL();
echo("INSERTING NEW" . "\n");
getALL();

// UPDATE BY POLICY NUMBER
$query = "UPDATE HUAINS SET middleName='Trinh' WHERE policyNum='14327'"; // id is row number     
$result = mysql_query($query) OR die(mysql_error());
echo("UPDATING" . "\n");
getALL();

mysql_close();

function getALL() {
    $query = "SELECT * FROM HUAINS";
    $result = mysql_query($query) OR die(mysql_error());
    report("GET ALL", $result);
}

function getbyTag($num) {
    $query = "SELECT * FROM HUAINS WHERE policyNum='" . $num . "'";
    $result = mysql_query($query) OR die(mysql_error());
    report("GET BY TAG", $result);
}

function report($msg, $result) {
    echo $msg . "\n";
    while ($row = mysql_fetch_array($result)) {
        echo $row['policyNum'] . "\n" .
        $row['firstName'] . "\n" .
        $row['middleName'] . "\n" .
        $row['lastName'] . "\n" .
        $row['email'] . "\n" .
        $row['renewDate'] . "\n";
    }
}
?>
