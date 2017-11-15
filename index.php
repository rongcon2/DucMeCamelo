<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Nhac
$titleArray = array();
$linkArray = array();
$result = array();
$dbTables = array("CAMELO-VIET", "CAMELO-ENG", "CAMELO-ESP");

$testArray = '[" - ","title1 - artist1"," - ","title2 - artist2","","link1","","link2"]';
$url = "";
$decode = 99;
$which = 99;
$totalCnt = 0;
$pchcardfile = './pchgames2.txt';
$loginloc = "N/A";
$logVisitFile = "./test/ipLog.txt";
$debugFile = "./test/debugLog.txt";

$needRecalculate = 0;

if (!empty($_POST['CHKMATMA'])) {
    global $loginloc;
    global $logVisitFile;
    parse_str($_POST['CHKMATMA']);
    //cleanDebug();
    if (strcmp($matma, "dmcdb4321") == 0) {
        $loginloc = "logged into download at " . $loc;
        get_client_ip(1, $logVisitFile);
        echo die(json_encode("GOOD"));
    } else if (strcmp($matma, "votrang") == 0) {
        $loginloc = "visiting site at " . $loc;
        get_client_ip(1, $logVisitFile);
    } else {
        $loginloc = "failed logging into site at " . $loc;
        get_client_ip(1, $logVisitFile);
        echo die(json_encode("BAD"));
    }
}
if (!empty($_POST['CLEARLOGS'])) {
    parse_str($_POST['CLEARLOGS']);
    cleanLogFiles();
}

if (!empty($_POST['LICH'])) {
    parse_str($_POST['LICH']);
    $loginloc = "Accessing Calendar DB -> " . $code . " " . $index . " " . $colname . " " . $text . " " . $table . " " . $mode;
    get_client_ip(1, $logVisitFile);
    clearAllArrays();
    requestCalendarData($code, $index, $colname, $text, $table, $mode);
}
if (!empty($_POST['DATABASE'])) {
    parse_str($_POST['DATABASE']);
    $loginloc = "Accessing Database -> " . $code . " " . $id . " " . $first . " " . $last . " " . $title . " " . $phone . " " . $email . " " . $table;
    get_client_ip(1, $logVisitFile);
    clearAllArrays();
    requestDucMeData($code, $id, $first, $last, $title, $phone, $email, $table, $mode);
}
if (!empty($_POST['EMAIL'])) {
    parse_str($_POST['EMAIL']);
    if (strcmp($type, "comsubject") == 0) {
        $tagSubj = "DucMeCamelo Comment/Suggestion: " . $subj;
    }
    if (strcmp($type, "praysubject") == 0) {
        $tagSubj = "DucMeCamelo Prayer Request: " . $subj;
    }
    $encoded_text = "THIS IS AN AUTOMAYED SERVICE, NO NEED TO REPLY.\r\n\r\nSender's Content is:\r\n\r\n";
    $cmd = 'curl -s --user "api:key-a93e2845b3a2471b26d0fcc575fbe4e7" '
            . 'https://api.mailgun.net/v3/sandboxcfba7b686bc54e15bf2b927d8295d703.mailgun.org/messages '
            . '-F from="Excited User <mailgun@sandboxcfba7b686bc54e15bf2b927d8295d703.mailgun.org>" '
            . '-F to=rongcon2@yahoo.com ' // rongcon2@yahoo.com or songdepMeCamelo@gmail.com
            . '-F subject="' . $tagSubj
            . '" -F text="' . $encoded_text . "Name: " . $name . "\r\nEmail: " . $email . "\r\nPhone: " . $phone . "\r\n\r\n" . $content . '"';
    shell_exec($cmd);
    echo die(json_encode("DONE"));
}
if (!empty($_POST['LOGCAMELO'])) {
    parse_str($_POST['LOGCAMELO']);
    get_client_ip(1, $logVisitFile);
}
if (!empty($_POST['GETMHCG'])) {
    parse_str($_POST['GETMHCG']);
    if (strcmp($type, "parse") == 0) {
        clearAllArrays();
        requestXMLData3($prefix, $url1 . '=' . $url2, $tag, $attr, $val, $q, $q1, $q2, (int) $code); // MHCG radio site
    }
}

if (!empty($_POST['GETNHACSONET'])) {
    parse_str($_POST['GETNHACSONET']);
    requestNhacSoNetData($loc, $tagName1, $tagName2);
}

function clearAllArrays() {
    global $titleArray;
    global $result;
    global $linkArray;

    $titleArray = array();
    $linkArray = array();
    $result = array();
}

function requestCalendarData($code, $index, $colname, $text, $table, $mode) {
    global $result;
    global $loginloc;
    global $debugFile;

    $data = array();
    define("DB_SERVER", getenv('OPENSHIFT_MYSQL_DB_HOST'));
    define("DB_USER", getenv('OPENSHIFT_MYSQL_DB_USERNAME'));
    define("DB_PASSWORD", getenv('OPENSHIFT_MYSQL_DB_PASSWORD'));
    define("DB_DATABASE", getenv('OPENSHIFT_APP_NAME'));
    $link = mysql_connect(DB_SERVER, DB_USER, DB_PASSWORD); // or die(mysql_error());
    $link = mysql_select_db(DB_DATABASE); // or die(mysql_error());

    mysql_set_charset("utf8");
    if ($code == 0) { // RETRIEVE all data
        getAllForMonth($table);
    }
    if ($code == 1) { // Save/update day's data
// UPDATE `CAMELO-JAN` SET `Mon` = 'HELLO THERE' WHERE `index` = 2
        $query = "UPDATE `" . $table . "` SET `" . $colname . "` = '" . $text . "' WHERE `index` = " . $index;
        $data = mysql_query($query) OR die(mysql_error());
        $loginloc = "ABOUT TO UPDATE DAY'S DATA" . "\n";
        get_client_ip(1, $debugFile);
        getAllForMonth($table);
        $loginloc = "PASS UPDATE DAY'S DATA" . "\n";
        get_client_ip(1, $debugFile);
    }
    if ($code == 2) { // RETRIEVE data of a day
//SELECT `Thu` FROM `CAMELO-JAN` WHERE `index`=3
        $query = "SELECT `" . $colname . "` FROM `" . $table . "` WHERE `index` = '" . $index;
        $data = mysql_query($query) OR die(mysql_error());
        $result[] = mysql_fetch_array($data)[0]; //getCalendarData($table, $colname);
        echo die(json_encode($result));
    }
    if ($code == 3) { // CLEAR MONTH'S activites
        $query = "UPDATE `" . $table . "` SET `Sun`='No activity set.',`Mon`='No activity set.',`Tue`='No activity set.',"
                . "`Wed`='No activity set.',`Thu`='No activity set.',`Fri`='No activity set.',`Sat`='No activity set.'";
        $data = mysql_query($query) OR die(mysql_error());
        $loginloc = "ABOUT TO CLEAR MONTH'S DATA" . "\n";
        get_client_ip(1, $debugFile);
        getAllForMonth($table);
        $loginloc = "PASS CLEAR MONTH'S DATA" . "\n";
        get_client_ip(1, $debugFile);
    }
    mysql_close();
}

function getAllForMonth($table) {
    global $result;
    // SELECT * FROM  `CAMELO-JAN` ORDER BY `CAMELO-JAN`.`index` ASC 
    $query = "SELECT * FROM `" . $table . "` ORDER BY `" . $table . "`.`index` ASC";
    $data = mysql_query($query); // OR die(mysql_error());
    while ($row = mysql_fetch_array($data)) {
        $result[] = $row['Sun'];
        $result[] = $row['Mon'];
        $result[] = $row['Tue'];
        $result[] = $row['Wed'];
        $result[] = $row['Thu'];
        $result[] = $row['Fri'];
        $result[] = $row['Sat'];
    }
    echo die(json_encode($result));
}

function getCalendarData($data, $colname) {
    global $result;
    while ($row = mysql_fetch_array($data)) {
        $result[] = $row[$colname];
    }
    echo die(json_encode($result));
}

function requestDucMeData($code, $id, $first, $last, $title, $phone, $email, $table, $mode) {
    global $loginloc;
    global $needRecalculate;
    global $debugFile;

    $data = array();
    define("DB_SERVER", getenv('OPENSHIFT_MYSQL_DB_HOST'));
    define("DB_USER", getenv('OPENSHIFT_MYSQL_DB_USERNAME'));
    define("DB_PASSWORD", getenv('OPENSHIFT_MYSQL_DB_PASSWORD'));
    define("DB_DATABASE", getenv('OPENSHIFT_APP_NAME'));
    $link = mysql_connect(DB_SERVER, DB_USER, DB_PASSWORD); // or die(mysql_error());
    $link = mysql_select_db(DB_DATABASE); // or die(mysql_error());

    mysql_set_charset("utf8");

    if ($code == 0) { // GET ALL
//createMemberStatus();
        getALL($table, $mode);
    }
    if ($code == 1) { // GET BY firstName tag policyNumber
        $tag = "12345";
        getbyTag($table, $tag, $mode);
    }
    if ($code == 2) { // INSERT NEW member
//date_default_timezone_set('US/Central'); // For Dung's Texas
//$date = date("Y-m-d");
        $needRecalculate = 1;
        $query = "INSERT INTO `" . $table . "` (id, firstName, lastName, title, phone, email) VALUES ('$id','$first','$last','$title','$phone','$email')";
        $data = mysql_query($query) OR die(mysql_error());
        $loginloc = "ABOUT TO SYNC INSERT OTHER TABLES" . "\n";
        get_client_ip(1, $debugFile);
        //syncInsert($table, $first, $last, $title, $phone, $email, $id);        
        //  $loginloc = "PASSED SYNC INSERT OTHER TABLES" . "\n";
        //  get_client_ip(1, $debugFile);
        getALL($table, $mode);
        $loginloc = "PASSED SYNC INSERT getALL in -> " . $table . "\n";
        get_client_ip(1, $debugFile);
//createMemberStatus();
    }
    if ($code == 3) { // SAVE OR UPDATE member
        $needRecalculate = 1;
        $query = "UPDATE `" . $table . "` SET firstName='" . $first . "' ,lastName='" . $last . "' ,title='" . $title . "' ,phone='" . $phone . "' ,email='" . $email . "' WHERE id='" . $id . "'"; // id is row number     
        $data = mysql_query($query) OR die(mysql_error());
        $loginloc = "ABOUT TO UPDATE DELETE OTHER TABLES" . "\n";
        get_client_ip(1, $debugFile);
        //syncUpdate($table, $phone, $email, $id);
        //$loginloc = "PASSED SYNC UPDATE OTHER TABLES" . "\n";
        //get_client_ip(1, $debugFile);
        getALL($table, $mode);
        $loginloc = "PASSED SYNC UPDATE getALL in -> " . $table . "\n";
        get_client_ip(1, $debugFile);
//createMemberStatus();
    }
    if ($code == 4) { // DELETE  member
        $needRecalculate = 1;
        $query = "DELETE FROM `" . $table . "` WHERE id='" . $id . "'";
        $data = mysql_query($query) OR die(mysql_error());
        $loginloc = "ABOUT TO SYNC DELETE OTHER TABLES" . "\n";
        get_client_ip(1, $debugFile);
        //syncDelete($table, $id);
        //  $loginloc = "PASSED SYNC DELETE OTHER TABLES" . "\n";
        //  get_client_ip(1, $debugFile);
        getALL($table, $mode);
        $loginloc = "ABOUT TO recalculateIDS ALL TABLES" . "\n";
        get_client_ip(1, $debugFile);
    }
    if ($code == 5) { // SET EXPIRE  member
        $needRecalculate = 1;
        $query = "UPDATE `" . $table . "` SET firstName='" . $first . "' ,lastName='" . $last . "' ,title='" . $title . "' ,phone='" . $phone . "' ,email='" . $email . "' WHERE id='" . $id . "'"; // id is row number     
        $data = mysql_query($query) OR die(mysql_error());
        getALL($table, $mode);
    }
    mysql_close();
}

function syncUpdate($table, $phone, $email, $id) { // due to language diff, just sync these only
    global $loginloc;
    global $dbTables;
    global $debugFile;
    foreach ($dbTables as $item) { // if npt equal, insert new item
        $loginloc = "CHECK SYNC UPDATE table -> " . $item . " id" . $id . "\n";
        get_client_ip(1, $debugFile);
        if (strcmp($item, $table) != 0) { // if npt equal, update needed for this table also
            $query = "UPDATE `" . $item . "` SET phone='" . $phone . "' ,email='" . $email . "' WHERE id='" . $id . "'"; // id is row number     
            $data = mysql_query($query) OR die(mysql_error());
            $loginloc = "SYNC UPDATE table -> " . $item . " id" . $id . "\n";
            get_client_ip(1, $debugFile);
        }
    }
}

function syncInsert($table, $first, $last, $title, $phone, $email, $id) {
    global $loginloc;
    global $dbTables;
    global $debugFile;
    foreach ($dbTables as $item) { // if npt equal, insert new item
        $loginloc = "CHECK SYNC INSERT item -> " . $item . " table" . $table . " id" . $id . "\n";
        get_client_ip(1, $debugFile);
        if (strcmp($item, $table) != 0) { // if npt equal, delete needed for this table also          
            $loginloc = "SYNC INSERT item -> " . $item . " NOT IN table" . $table . " id" . $id . "\n";
            get_client_ip(1, $debugFile);
            $query = "INSERT INTO `" . $item . "` (id, firstName, lastName, title, phone, email) VALUES ('$id','$first','$last','$title','$phone','$email')";
            $data = mysql_query($query) OR die(mysql_error());
        }
    }
}

function syncDelete($table, $id) {
    global $loginloc;
    global $dbTables;
    global $debugFile;
    foreach ($dbTables as $item) {
        $loginloc = "CHECK SYNC DELETE item -> " . $item . " table " . $item . " id " . $id . "\n";
        get_client_ip(1, $debugFile);
        if (strcmp($item, $table) != 0) { // if npt equal, delete needed for this table also
            $loginloc = "SYNC DELETE item -> " . $item . " NOT IN table " . $item . " id " . $id . "\n";
            get_client_ip(1, $debugFile);
            $query = "DELETE FROM `" . $item . "` WHERE id='" . $id . "'";
            $data = mysql_query($query) OR die(mysql_error());
        }
    }
}

function recalculateIDS($table, $mode) {
    global $loginloc;
    global $dbTables;
    global $debugFile;
    global $needRecalculate;
//    $cnt = 0;
//    foreach ($dbTables as $item) {
    $cnt = 1;
    $query = "SELECT * FROM `" . $table . "` ORDER BY `" . $table . "`.`id` ASC";
    $data = mysql_query($query); // OR die(mysql_error());
    $loginloc = "ABOUT TO recalculateIDS FOR TABLE " . $table . "\n";
    get_client_ip(1, $debugFile);
    while ($row = mysql_fetch_array($data)) {
        $query = "UPDATE `" . $table . "` SET id='" . (string) $cnt . "' WHERE email='" . $row['email'] . "'"; // id is row number     
        $reqdat = mysql_query($query) OR die(mysql_error());
        $loginloc = "SET recalculateIDS FOR TABLE " . $table . "\n";
        get_client_ip(1, $debugFile);
        $cnt++;
    }
//    }
    $needRecalculate = 0;
    $loginloc = "getALL for table " . $table; //SET recalculateIDS 0 " . "\n";
    get_client_ip(1, $debugFile);
    getALL($table, $mode);
}

function getDanhBaStatus($renewDate) {
    date_default_timezone_set('US/Central'); // For Dung's Texas
    $todays_date = date("Y-m-d");
    $date1 = date_create($renewDate);
    $date2 = date_create($todays_date);
    $numdays = date_diff($date1, $date2);
    $maxDaysThisMonth = date('t'); // num days for current month
//$currentDayOfMonth = date('j'); // todays date
    if ($numdays->format("%a") > $maxDaysThisMonth) {
        return 'Expired';
    } else {
        return ($maxDaysThisMonth - $numdays->format("%a")) . " days left";
    }
}

function createMemberStatus($table, $mode) {
    $query = "SELECT * FROM " . $table;
    $data = mysql_query($query) OR die(mysql_error());
    while ($row = mysql_fetch_array($data)) {
        $query = "UPDATE HUAINS SET status='" . getDanhBaStatus($row['start']) . "' WHERE id='" . $row['id'] . "'"; // id is row number     
        $req = mysql_query($query) OR die(mysql_error());
    }
    getALL($table, $mode);
}

function getALL($table, $mode) {
    global $loginloc;
    global $needRecalculate;
    global $debugFile;

    if ($needRecalculate == 1) {
        recalculateIDS($table, $mode);
        return;
    }

    $query = "SELECT * FROM `" . $table . "` ORDER BY `" . $table . "`.`id` ASC";
    $data = mysql_query($query); // OR die(mysql_error());
    $loginloc = "ABOUT TO getALL " . $table . "\n";
    get_client_ip(1, $debugFile);
    report("GET ALL", $data, $table, $mode);
}

function getbyTag($table, $num, $mode) {
    $query = "SELECT * FROM " . $table . " WHERE id=" . $num;
    $data = mysql_query($query) OR die(mysql_error());
    report("GET BY TAG", $data, $table, $mode);
}

function report($msg, $data, $table, $mode) {
    global $loginloc;
    global $result;

    while ($row = mysql_fetch_array($data)) {
        $id = "";
        if (strcmp($mode, "manage") == 0) {
            $id = $row['id'] . ",";
        }
        $temp = $id .
                $row['firstName'] . "," .
                $row['lastName'] . "," .
                $row['title'] . "," .
                $row['phone'] . "," .
                $row['email'];
        $result[] = $temp;
    }
// $result = array_filter($arr, 'is_not_null'); // remove al null values
    echo die(json_encode($result));
}

function getResult() {
    global $titleArray;
    global $linkArray;
    global $artistArray;
    global $result;

    for ($r = 0; $r < count($titleArray); $r++) {
        if ((strlen($titleArray[$r]) > 0) && (strlen($artistArray[$r]) > 0)) {
            $result[] = $titleArray[$r] . " - " . $artistArray[$r];
        }
    }
    for ($r = 0; $r < count($linkArray); $r++) {
        if (strlen($linkArray[$r]) > 0) {
            $result[] = $linkArray[$r];
        }
    }

    echo die(json_encode($result));
}

function getMHCGResult() {
    global $titleArray;
    global $linkArray;
    global $result;

    $result = array_merge($titleArray, $linkArray);
    echo die(json_encode($result));
}

function requestNhacSoNetData($url, $tag1, $tag2) {
    global $result;

    libxml_use_internal_errors(true); // ignore warnings
    $contents = file_get_contents($url, false);
    $dom = new DOMDocument();
    $dom->loadXML($contents);
    $titles = $dom->getElementsByTagName($tag1);
    $link = $dom->getElementsByTagName($tag2);
    foreach ($titles as $t) {
        $result[] = $t->firstChild->data;
    }
    foreach ($link as $l) {
        $result[] = $l->firstChild->data;
    }
    echo die(json_encode($result));
}

function requestXMLData3($prefix, $url, $tagName, $tagAttr, $containStr, $queryStr, $attr1, $attr2, $code) { // MHCG radio site
    global $result;
    global $linkArray;
    global $titleArray;
    //echo die(json_encode("PHP " . $prefix . " " . $url . " " . $tagName . " " . $tagAttr . " " . $containStr . " " . $queryStr. " " . $attr1 . " " . $attr2));
    libxml_use_internal_errors(true); // ignore warnings
    $links = array();
    $doc = new DOMDocument();
    $doc->loadHTMLFile($url, LIBXML_NOWARNING | LIBXML_NOERROR);
    $tags = $doc->getElementsByTagName($tagName);
    foreach ($tags as $tag) {
        // echo $tag->getAttribute('value') . "\n";
        if (strpos($tag->getAttribute($tagAttr), $containStr) !== false) { // if contain
            $links[] = str_replace($containStr, $prefix, $tag->getAttribute($tagAttr));
        }
    }
    // echo die(json_encode($links[0]));
    // echo die(json_encode($links[1]));
    $options = array('http' => array('user_agent' => 'Mozilla/5.0 (Windows NT 6.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
            'Content-Encoding' => 'gzip'));
    $context = stream_context_create($options);
    $contents = file_get_contents($links[$code], false, $context);
    $dom = new DOMDocument();
    $dom->loadXML($contents);
    $xpath = new DOMXPath($dom);
    $elements = $xpath->query($queryStr);
    if (!is_null($elements)) {
        foreach ($elements as $element) {
            $linkArray[] = $element->getAttribute($attr1); // file
            $titleArray[] = $element->getAttribute($attr2); // title
        }
    }
    getMHCGResult();
}

function ExtractDataAttrToSrcArray($dom, $root, $tag, $attr, $which) { // if tag has "namespace.tag", just use "tag"
    global $linkArray;
    global $chapterArray;
    if (!is_null($dom)) {
        foreach ($dom->getElementsByTagName($root) as $feeditem) {
            $nodes = $feeditem->getElementsByTagName($tag);
            foreach ($nodes as $node) {
                if ($which == 1) {
                    $linkArray[] = $node->nodeValue;
                }
                if ($which == 2) {
                    $chapterArray[] = $node->nodeValue;
                }
                if ($which == 3) {
                    $linkArray[] = $node->getAttribute($attr);
                }
            }
        }
    }
}

function is_not_null($var) {
    return !is_null($var);
}

function createHtml($html) {
    $temp = genRandomHTMLFileName();
    copy("./test/" . $html, "./" . $temp . ".html");
    chmod($temp . ".html", 0777);
    echo die(json_encode($temp . ".html" . ";https://rongphp-rongforeverphpav.rhcloud.com/" . $temp . ".html"));
}

function deleteFile($file) {
// chmod($file, 0777);
// unlink($file);
    if (is_file($file)) {
// chmod($file, 0777);
        if (unlink($file)) {
            $loginloc = 'File deleted';
        } else {
            $loginloc = 'Cannot remove that file';
        }
    } else {
        $loginloc = 'File does not exist';
    }
    get_client_ip(1, $logVisitFile);
    sleep(2);
// echo die(json_encode("deleteFile"));
}

function get_redirect_url($url) {
    $redirect_url = null;

    $url_parts = @parse_url($url);
    if (!$url_parts)
        return false;
    if (!isset($url_parts['host']))
        return false; //can't process relative URLs
    if (!isset($url_parts['path']))
        $url_parts['path'] = '/';

    $sock = fsockopen($url_parts['host'], (isset($url_parts['port']) ? (int) $url_parts['port'] : 80), $errno, $errstr, 30);
    if (!$sock)
        return false;

    $request = "HEAD " . $url_parts['path'] . (isset($url_parts['query']) ? '?' . $url_parts['query'] : '') . " HTTP/1.1\r\n";
    $request .= 'Host: ' . $url_parts['host'] . "\r\n";
    $request .= "Connection: Close\r\n\r\n";
    fwrite($sock, $request);
    $response = '';
    while (!feof($sock))
        $response .= fread($sock, 8192);
    fclose($sock);

    if (preg_match('/^Location: (.+?)$/m', $response, $matches)) {
        if (substr($matches[1], 0, 1) == "/")
            return $url_parts['scheme'] . "://" . $url_parts['host'] . trim($matches[1]);
        else
            return trim($matches[1]);
    } else {
        return false;
    }
}

function get_all_redirects($url) {
    $redirects = array();
    while ($newurl = get_redirect_url($url)) {
        if (in_array($newurl, $redirects)) {
            break;
        }
        $redirects[] = $newurl;
        $url = $newurl;
    }
    return $redirects;
}

function get_true_url($url) {
    $signal = 0;
    if (strpos($url, 'zing') !== false) {
        $signal = 10;
    }
    if (strpos($url, 'nhaccuatui') !== false) {
        $signal = 11;
    }
    $rez1 = get_all_redirects($url);
    $token = strtok($rez1[0], "=");
    $cnt = 0;
    $trueUrl = "";
    while ($token !== false) {
        if ($signal == 10) {
            if ($cnt == 1) {
                $temp = str_replace("&autostart", "", $token);
                $trueUrl = $trueUrl . $temp;
            }
        }
        if ($signal == 11) {
            if (($cnt == 1) || ($cnt == 2)) {
                $temp = str_replace("&autostart", "", $token);
                if ($cnt == 1) {
                    $trueUrl = $trueUrl . $temp . "=";
                } else {
                    $trueUrl = $trueUrl . $temp;
                }
            }
        }
        $token = strtok("=");
        $cnt++;
    }
    return $trueUrl;
}

function check_url_response($url) {
    $status = false;
// Check website valid. Create a curl handle
    $ch = curl_init($url);
// Execute
    curl_exec($ch);
// Check if any error occurred
    if (!curl_errno($ch)) {   // Website returns OK, no error
        $status = true;
    }
// Close handle
    curl_close($ch);
    echo die(json_encode($status));
}

function clean($string) {
    $string = str_replace(' ', '', $string); // Remove all spaces.
    return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

function cleanLogFiles() {
    global $logVisitFile, $debugFile;

    if (file_exists($logVisitFile)) {
        file_put_contents($logVisitFile, ''); // empty it
    }
    if (file_exists($debugFile)) {
        file_put_contents($debugFile, ''); // empty it
    }
}

function get_client_ip($logging, $fileName) {
    global $loginloc;
    $ipaddress = 'N/A';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if (isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if (isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';

    date_default_timezone_set('America/New_York');
    $log = $ipaddress . " on " . date("m/d/Y h:i:s a", time()) . " " . $loginloc . "\n";
//chmod("./test/ipLog.txt", 0666);
//chmod("./giadinh.html", 0600);
    if ($logging == 1) {
        file_put_contents($fileName, $log, FILE_APPEND);
    }
//echo die(json_encode($ipaddress));
//file_put_contents("http://rongphp-rongforeverphpav.rhcloud.com/test/ipLog.txt", $log, FILE_APPEND);
    return str_replace('.', '_', $ipaddress);
//return ($ipaddress);
}

function genRandomHTMLFileName($length = 20) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function getAllFileNamesInDir($dirname) {
    global $result;
    $result = array();
    foreach (new DirectoryIterator($dirname) as $fileInfo) {
        $result[] = $fileInfo->getFilename(); //"$filename\n";
    }
    echo die(json_encode($result));
}

function exceptions_error_handler($severity, $message, $filename, $lineno) {
    if (error_reporting() == 0) {
        return;
    }
    if (error_reporting() & $severity) {
        throw new ErrorException($message, 0, $severity, $filename, $lineno);
    }
}

?>
