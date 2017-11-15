// DATABASE
var numMember = 0;
var newMemberIdx = 1000;
var numFields = 6;
var selRowContent = "&id=1&first=1&last=1&title=1&phone=1&email=1&table=";//CAMELO-VIET&mode=";
var tags = ["", "", "&id=", "&first=", "&last=", "&title=", "&phone=", "&email=", "&table=", "&mode="];
var headers = [['Danh Bạ Liên Lạc', 'Tên', 'Họ', 'Tiêu Đề', 'Điện Thoại', 'Email'],
    ['Leaders', 'First Name', 'Last Name', 'Title', 'Phone', 'Email'],
    ['Líderes', 'Nombre de Pila', 'Apellido', 'Título', 'Teléfono', 'Email']];
var dbtable = "CAMELO-MEMBERS";
var headerrow = 0;
var dbmode = "view";

//        <input id="save" onclick="setEnv('manage', 'CAMELO-ENG','English DBase')" type="button" value="English DBase">
//        <input id="save" onclick="setEnv('manage', 'CAMELO-ESP','Spanish DBase')" type="button" value="Spanish DBase">
var dbManagerDivStr = '<p class="textwrap">This page is for managing Duc Me Camelo site\'s members and its calendar. Members DBase Manager is shown initially. \
Click on desired button as needed.</p>'
        + '<input id="save" onclick="setEnv(' + "'manage', 'CAMELO-MEMBERS', 'Members DBase Manager')" + '" type="button" value="Members DBase Manager">'
        + '<input id="save" onclick="initcal(' + "'Calendar DBase Manager')" + '" type="button" value="Calendar DBase Manager">\
        <div id="dbtitle"><p><u>Members DBase Manager</u></p></div>\
    <div id="maincontent" class="membertable"></div>\
    </br>\
    <div id="ack"></div>\
    <div id="msg"></div>';
var memberDBSivStr = '<p class="textwrap">To <u>insert</u> new member, press the Insert button. A new row with template data will be appended to end of the table. \
        Click on each field on that row and set it with your value. Then press the "Save" button on that row to save the changes.</p>\
        <p class="textwrap">You can change <u>only</u> member\'s First Name, Last Name, Title, Phone, and Email. Click on their respective cells \
        and type in your changes.</p>\
        <p class="textwrap">Click on Delete button to remove intended member.</p>';
var nameTitle;

// CALLENDAR 
var month_of_year = [['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'],
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubure', 'noviembre', 'diciembre']];

// OTHERS
var Server = 'http://ducme-camelo.rhcloud.com/index.php';

function changeMonthYearData() {//(optionBox) { 
    var m = document.getElementById("monthBox");
    //  console.log(new Date().getFullYear());
    var date = new Date();
    $('#calendar').fullCalendar('gotoDate', new Date(date.getFullYear(), m.selectedIndex, 1));
}

function clearLogs() {
    setTimeout(function () { // delay
        $.post(Server, {"CLEARLOGS": "type=clear"}, function (data) { // sending ajax post request
        });
    }, 50);
}

function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}

function printMsg(id, msg) {
    document.getElementById(id).innerHTML = '<div id="' + id + '"><p>' + msg + '</p></div>';
}

function setTableMgr(array) {
    var divStr = '<div id="maincontent">' + memberDBSivStr +
            '&nbsp;&nbsp;&nbsp;<input onclick="insertItem(' + "'" + dbtable + "'" + ')" type="button" value="Insert New Member">\
                <br><br><div class="membertable" id="mtable"><table id="table" bgcolor="lightgray" style="width:950px">\
                <caption><b>' + dbtable + ' List Of&nbsp;&nbsp;' + array.length + '&nbsp;&nbsp;Members</b></caption>\
                <thead>\
                    <tr>\
                        <th onclick="tableHeaderClicked()" class="sortable">Delete Member</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">Save Change</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">ID</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">First Name</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">Last Name</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">Title</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">Phone</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">Email</th>\
                    </tr>\
                </thead><tbody>';
    nameTitle = new Array();
    for (var i = 0; i < array.length; i++) { // allocate rows
        nameTitle.push([]);
    }

    for (var i = 0; i < array.length; i++) {
        // console.log(array[i]); //return;
        var temp = array[i].split(',');
        var first = temp[1].split(';');
        //console.log(first);
        var last = temp[2].split(';');
        var title = temp[3].split(';');
        nameTitle[i] = {first: first, last: last, title: title};
        divStr += '<tr class="members"><td><button id="delete" onclick="cellClicked(' + "'delete'" + ')" type="button">Delete</button></td>'
                + '<td><button id="save" onclick="cellClicked(' + "'save'" + ')" type="button">Save</button></td>'
                + '<td>' + temp[0] + '</td>' // ID
                + '<td>VIET <input type="Text" size="15" onkeyup="setInput(this,' + i + ',0,0)" value="' + first[0] + '"></br>ENGL <input type="Text" size="15" onkeyup="setInput(this,' + i + ',0,1)" value="' + first[1] + '"></br>ESPL <input type="Text" size="15" onkeyup="setInput(this,' + i + ',0,2)" value="' + first[2] + '"></td>'
                + '<td>VIET <input type="Text" size="15" onkeyup="setInput(this,' + i + ',1,0)" value="' + last[0] + '"></br>ENGL <input type="Text" size="15" onkeyup="setInput(this,' + i + ',1,1)" value="' + last[1] + '"></br>ESPL <input type="Text" size="15" onkeyup="setInput(this,' + i + ',1,2)" value="' + last[2] + '"></td>'
                + '<td>VIET <input type="Text" size="20" onkeyup="setInput(this,' + i + ',2,0)" value="' + title[0] + '"></br>ENGL <input type="Text" size="20" onkeyup="setInput(this,' + i + ',2,1)" value="' + title[1] + '"></br>ESPL <input type="Text" size="20" onkeyup="setInput(this,' + i + ',2,2)" value="' + title[2] + '"></td>'
                + '<td contenteditable="true" onclick="cellClicked(' + "'click'" + ')">' + temp[4] + '</td>'
                + '<td contenteditable="true" onclick="cellClicked(' + "'click'" + ')">' + temp[5] + '</td>'
                + '</tr>';
    }

    divStr += '</tbody></table></div></div>';
    $("#maincontent").replaceWith(divStr);
    printMsg("msg", "Item " + mode);
    //checkExpiredClient();
    // Had to do this twice to bring the Expired clients data to the top of table 
    //document.getElementById("clientstatus").click();
    //document.getElementById("clientstatus").click();
    setTimeout(function () { // delay              
        document.getElementById("msg").innerHTML = '<div id="msg"></div>';
    }, 2000);
}

function setInput(input, row, which, slot) {
    if (which === 0)
        nameTitle[row].first[slot] = input.value;
    if (which === 1)
        nameTitle[row].last[slot] = input.value;
    if (which === 2)
        nameTitle[row].title[slot] = input.value;
}

function setEnv(mode, table, tag) {
    if (tag.localeCompare("none") !== 0)
        document.getElementById("dbtitle").innerHTML = '<div id="dbtitle"><p><u>' + tag + '</u></p></div>';
    dbmode = mode;
    dbtable = table;
    selRowContent = "&id=1&first=1&last=1&title=1&phone=1&email=1&table=" + dbtable + "&mode=" + dbmode;
    cellClicked("refresh");
}

function accessMemberDatabase(tag, code) {
    var params = "code=" + code + selRowContent;
    var retArray = new Array();
    //  var parameters = [{"HUAINS": "code=0"}, {"HUAINS": params}, {"HUAINS": params}, {"HUAINS": params}, {"HUAINS": params}, {"HUAINS": params}, {"HUAINS": params}];
    setTimeout(function () { // delay 
        //console.log("accessMemberDatabase  " + params);
        $.post(Server, {"DATABASE": params}, function (data) { // sending ajax post request
            var temp = JSON.stringify(data);
            //console.log(temp);
            retArray = JSON.parse(temp);
            numMembers = retArray.length;
            if (dbmode.localeCompare('view') === 0)
                setTable(retArray, headerrow);
            else
                setTableMgr(retArray);
        });
    }, 50);
}

function cellClicked(tag) {
    if (tag.localeCompare("refresh") === 0) {
        accessMemberDatabase("cellClicked refresh", "0");
        mode = "Refreshed";
        return;
    }
    //selRowContent = "";
    //console.log(tag);
    // $('td[contenteditable=true]').parent('tr').find('button').removeAttr('disabled');
    var table = document.getElementsByTagName("table")[0];
    var tbody = table.getElementsByTagName("tbody")[0];
    tbody.onclick = function (e) {
        e = e || window.event;
        var data = [];
        var target = e.srcElement || e.target;
        while (target && target.nodeName !== "TR") {
            target = target.parentNode;
        }
        // alert("row = " + target.rowIndex + ", column = " + e.srcElement.cellIndex);
        if (target) {
            var cells = target.getElementsByTagName("td");
            for (var i = 0; i < cells.length; i++) {
                data.push(cells[i].innerHTML);
            }
        }
        selRowContent = "";
        for (var i = 2; i < data.length; i++) {
            selRowContent += tags[i] + data[i];
        }
        selRowContent += tags[tags.length - 2] + dbtable;
        selRowContent += tags[tags.length - 1] + dbmode;
        //console.log(selRowContent);
        var tt = selRowContent.split('"');
        var r = target.rowIndex - 1; // -1 minus heading row
        var str = tt[0].replace(/VIET <input type=/g, "")
                + nameTitle[r].first[0] + ";" + nameTitle[r].first[1] + ";" + nameTitle[r].first[2]
                + "&last=" + nameTitle[r].last[0] + ";" + nameTitle[r].last[1] + ";" + nameTitle[r].last[2]
                + "&title=" + nameTitle[r].title[0] + ";" + nameTitle[r].title[1] + ";" + nameTitle[r].title[2]
                + tt[72].replace(/>/g, "");
        selRowContent = str;
        //console.log(selRowContent);
        //return;
        if (tag.localeCompare("delete") === 0) {
            accessMemberDatabase("cellClicked delete", "4");
            mode = "Deleted";
        }
        if (tag.localeCompare("save") === 0) {
            accessMemberDatabase("cellClicked Saved", "3");
            mode = "Saved";
        }
    };
}

function insertItem(table) {
    mode = "Inserted";
    console.log(newMemberIdx);
    selRowContent = "&id=" + newMemberIdx + "&first=VJohn;EJohn;SJohn&last=VDoe;EDoe;SDoe&title=VTitle;ETitle;STitle&phone=(XXX) XXX-XXXX&email=jdoe" + newMemberIdx + "@gmail.com&table=" + table + "&mode=manage";
    // console.log(selRowContent);
    newMemberIdx--;
    accessMemberDatabase("insertItem", "2");
    var objDiv = document.getElementById("mtable");
    objDiv.scrollTop = objDiv.scrollHeight;
}

function handleClick(which, myRadio) {
    var editStr = "";
    if (which.localeCompare("map") === 0) {
        var editStr = "";
        clearAllmarkers();
        if (myRadio.value == 1) { // find
            action = "find";
            editStr = '<div id="pano" style="clear:both;width:800px; height:500px;"><img style="width:800px; height:500px;" src="http://i1322.photobucket.com/albums/u579/rong4ever/Photobucket%20Desktop%20-%20NSWCDD-D0065DC2/Misc/Google-Maps_zps67189c6f.jpg"></div>';
            $("#pano").replaceWith(editStr);
            editStr = '<div id="mapinput" style="clear:both;">'
                    + '<span style="color:black;">Find:&nbsp;&nbsp;</span>';
            if (usermode.localeCompare("auto") === 0) {
                editStr += '<input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapfind" type="text" value=""></div>';
                $("#mapinput").replaceWith(editStr);
                var auto = new google.maps.places.Autocomplete(document.getElementById("mapfind"));
                google.maps.event.addListener(auto, 'place_changed', function () {
                    codeAddress(getAddress(auto), "mapfind", usermode);
                });
            }
            if (usermode.localeCompare("manual") === 0) {
                editStr += '<input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapfind" type="text" value="Required Format -> title,123 Victor Dr,Charlotte NC"><br><br><button onclick="findAddress()">Goto</button></div>';
                $("#mapinput").replaceWith(editStr);
            }
            var panelStr = '<div id="mappanel"><div id="map-canvas" style="width:800px; height:500px;background:#1B1D1A;"></div></div>';
            $("#mappanel").replaceWith(panelStr);
            map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        }
        else if (myRadio.value == 2) { // get direction
            action = "direction";
            editStr = '<div id="pano" style="clear:both;width:800px; height:500px;"><img style="width:800px; height:500px;" src="http://i1322.photobucket.com/albums/u579/rong4ever/Photobucket%20Desktop%20-%20NSWCDD-D0065DC2/Misc/Google-Maps_zps67189c6f.jpg"></div>';
            $("#pano").replaceWith(editStr);
            editStr = '<div id="mapinput" style="clear:both;">';
            $("#mapinput").replaceWith(editStr);
            if (usermode.localeCompare("auto") === 0) {
                editStr += '<span style="color:black;">Start:&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapStart" type="text" value="">'
                        + '<br>'
                        + '<span style="color:black;"> End:&nbsp;&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapEnd" type="text" value="">'
                        + '<br><br><button onclick="getDirection()">Get Direction</button></div>';
                $("#mapinput").replaceWith(editStr);
                var auto1 = new google.maps.places.Autocomplete(document.getElementById("mapStart"));
                google.maps.event.addListener(auto1, 'place_changed', function () {
                    startAddr = getAddress(auto1);
                });
                var auto2 = new google.maps.places.Autocomplete(document.getElementById("mapEnd"));
                google.maps.event.addListener(auto2, 'place_changed', function () {
                    endAddr = getAddress(auto2);
                });
            }
            if (usermode.localeCompare("manual") === 0) {
                editStr += '<span style="color:black;">Start:&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapStart" type="text" value="Required Format -> Joe\'s house,123 Victor Dr,Charlotte NC">'
                        + '<br>'
                        + '<span style="color:black;"> End:&nbsp;&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapEnd" type="text" value="Required Format -> Mary\'s house,321 Panel St,Richmond NY">'
                        + '<br><br><button onclick="getDirection()">Get Direction</button></div>';
                $("#mapinput").replaceWith(editStr);
            }
            var panelStr = '<div id="mappanel"><div id="map-canvas" style="width:800px; height:500px;background:#1B1D1A;"></div></div>';
            $("#mappanel").replaceWith(panelStr);
            map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        }
        else if (myRadio.value == 3) { // auto complete
            usermode = "auto";
            editStr = '<div id="mapinput" style="clear:both;">';
            if (action.localeCompare("find") === 0) {
                editStr += '<span style="color:black;">Location:&nbsp;&nbsp;</span> <input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapfind" type="text" value=""></div>';
                $("#mapinput").replaceWith(editStr);
                var ac1 = new google.maps.places.Autocomplete(document.getElementById('mapfind'));
                google.maps.event.addListener(ac1, 'place_changed', function () {
                    codeAddress(getAddress(ac1), "mapfind", usermode);
                });
            }
            if (action.localeCompare("direction") === 0) {
                editStr += '<span style="color:black;">Start:&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapStart" type="text" value="">'
                        + '<br>'
                        + '<span style="color:black;">End:&nbsp;&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapEnd" type="text" value="">'
                        + '<br><br><button onclick="getDirection()">Get Direction</button></div>';
                $("#mapinput").replaceWith(editStr);
                var ac2 = new google.maps.places.Autocomplete(document.getElementById("mapStart"));
                google.maps.event.addListener(ac2, 'place_changed', function () {
                    startAddr = getAddress(ac2);
                });
                var ac3 = new google.maps.places.Autocomplete(document.getElementById("mapEnd"));
                google.maps.event.addListener(ac3, 'place_changed', function () {
                    endAddr = getAddress(ac3);
                });
            }
        }
        else if (myRadio.value == 4) { // manual input
            usermode = "manual";
            editStr = '<div id="mapinput" style="clear:both;">';
            if (action.localeCompare("find") === 0) {
                editStr += '<span style="color:black;">Location:</span> <input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapfind" type="text" value="Required Format -> title,123 Victor Dr,Charlotte NC">'
                        + '<br><br><button onclick="findAddress()">Goto</button></div>';
                $("#mapinput").replaceWith(editStr);
            }
            if (action.localeCompare("direction") === 0) {
                editStr += '<span style="color:black;">Start:&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapStart" type="text" value="Required Format -> Joe\'s house,123 Victor Dr,Charlotte NC">'
                        + '<br>'
                        + '<span style="color:black;"> End:&nbsp;&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapEnd" type="text" value="Required Format -> Mary\'s house,321 Panel St,Richmond NY">'
                        + '<br><br><button onclick="getDirection()">Get Direction</button></div>';
                $("#mapinput").replaceWith(editStr);
            }
        }
    }
}

function Log(msg) {
    console.log(msg);
}

function Check(x) {
    if (x.localeCompare('login') === 0)
        x = document.getElementById("myPsw").value;
    var divStr = '<div id="psswdVidMsg">';
    setTimeout(function () { // delay
        $.post("https://ducme-camelo.rhcloud.com/index.php", {"CHKMATMA": "matma=" + x + "&loc=database manager"}, function (data) { // sending ajax post request
            var temp = JSON.stringify(data);
            var result = JSON.parse(temp);
            if (result.localeCompare("BAD") !== 0) {
                //divStr += '<iframe src="' + dbManagerDivStr + '" width="100%" height="2000"/></iframe>';
                divStr += dbManagerDivStr + '</div>';
                $("#chkVidPswd").replaceWith(divStr);
                setEnv('manage', 'CAMELO-MEMBERS', 'Members DBase Manager');
            } else {
                divStr += '<p>No Cigar. Try Again.</p></div>';
                divStr += '</div>';
                $("#psswdVidMsg").replaceWith(divStr);
                setTimeout(function () { // delay              
                    $("#psswdVidMsg").replaceWith('<div id="psswdVidMsg"></div>');
                }, 2000);
            }
        });
    }, 50);
}
