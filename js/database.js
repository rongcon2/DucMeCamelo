// OTHERS
var Server = 'http://ducme-camelo.rhcloud.com/index.php';
var mode = "Refresh";
var selRowContent = "&num=1&first=1&middle=1&last=1&email=1&date=1&status=1"; // init
var tags = ["", "", "&num=", "&first=", "&middle=", "&last=", "&email=", "&date=", "&status="];

function cellClicked(tag) {
    if (tag.localeCompare("refresh") === 0) {
        accessDatabase("0");
        mode = "Refreshed";
        return;
    }
    selRowContent = "";
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
        if (target) {
            var cells = target.getElementsByTagName("td");
            for (var i = 0; i < cells.length; i++) {
                data.push(cells[i].innerHTML);
            }
        }
        for (var i = 2; i < data.length; i++) {
            if (i < data.length - 1)
                selRowContent += tags[i] + data[i];
        }
        //console.log(selRowContent);
        if (tag.localeCompare("delete") === 0) {
            accessDatabase("4");
            mode = "Deleted";
        }
        if (tag.localeCompare("save") === 0) {
            accessDatabase("3");
            mode = "Saved";
        }
    };
}

function insertItem() {
    selRowContent = "";
    var input = document.getElementById("insert").value;
    //console.log(input);
    mode = "Inserted";
    var split = input.split(" ");
    for (var i = 2; i <= tags.length - 3; i++) {
        selRowContent += tags[i] + split[i - 2];// get policy number
    }
    selRowContent += tags[tags.length - 2] + "none";
    selRowContent += tags[tags.length - 1] + "none";
    //console.log(selRowContent);
    accessDatabase("2");
}

function checkExpiredClient() {
    $('#table td').each(function () { // check each cell
        var text = $(this).text().split(' ');
        if (($(this).text() === 'Expired') || (Number(text[0]) === 0)) {
            $(this).css('background-color', 'orange');
        }
        if ((Number(text[0]) > 0) && (Number(text[0]) <= 5)) {
            $(this).css('background-color', 'yellow');
        }
        //if (Number(text[0]) === 0) {
        //    console.log("Found 0 days left at Row index = " + $(this).closest('tr').index());
        //    setExpire($(this).closest('tr').index());
        //}
    });

    var table = document.getElementById("table");
    var numCol = table.rows[0].cells.length;// table column length where Status field resides   
    for (var r = 0, n = table.rows.length; r < n; r++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        for (var c = numCol - 1, m = table.rows[r].cells.length; c < m; c++) { // numCol-1 check Status column only
            //iterate through columns
            //columns would be accessed using the "col" variable assigned in the for loop
            console.log("checkExpiredClient "+table.rows[r].cells[c].innerHTML);
            var text = table.rows[r].cells[c].innerHTML.split(' ');
            if (Number(text[0]) === 0) {
                console.log("checkExpiredClient Found 0 days left at Row index = " + c);
                setExpire(c);
            }
        }
    }
    // OR do this
    //var table = document.getElementById("mytab1");
    //for (var i = 0, cell; cell = table.cells[i]; i++) {
    //iterate through cells
    //cells would be accessed using the "cell" variable assigned in the for loop
    //}
}

function setExpire(row) {
    selRowContent = "";
    mode = "Saved";
    var table = document.getElementById("table");
    // Get content of specified row
    // c = 2 will start getting at Policy Nummber
    for (var c = 2, r = row - 1, m = table.rows[r].cells.length; c < m - 1; c++) {
        //console.log("setExpire -> " + table.rows[r].cells[c].innerHTML);
        selRowContent += tags[c] + table.rows[r].cells[c].innerHTML;
    }
    selRowContent = selRowContent + tags[tags.length - 1] + "Expired";
    //console.log("setExpire -> " + selRowContent);
    accessDatabase("5");
}

function accessDatabase(code) {
    var params = "code=" + code + selRowContent;
    //console.log("accessDatabase params -> " + params);
    var retArray = new Array();
    //  var parameters = [{"HUAINS": "code=0"}, {"HUAINS": params}, {"HUAINS": params}, {"HUAINS": params}, {"HUAINS": params}, {"HUAINS": params}, {"HUAINS": params}];
    setTimeout(function () { // delay 
        // console.log("accessDatabase  " + params);
        $.post(Server, {"HUAINS": params}, function (data) { // sending ajax post request
            var temp = JSON.stringify(data);
            //console.log(temp); //return;
            retArray = JSON.parse(temp);
            setTable(retArray);
        });
    }, 50);
}

function printMsg(id, msg) {
    document.getElementById(id).innerHTML = '<div id="' + id + '"><p>' + msg + '</p></div>';
}

function setTable(array) {
    var divStr = '<div id="content"><table id="table" bgcolor="lightgray" style="width:900px">\
                <caption><b>Insurance List Of&nbsp;&nbsp;' + array.length + '&nbsp;&nbsp;Clients</b></caption>\
                <thead>\
                    <tr>\
                        <th onclick="tableHeaderClicked()" class="sortable">Delete Client</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">Save Change</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">Policy Number</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">First Name</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">Middle Name</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">Last Name</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">Email</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">Renew Date</th>\
                        <th id="clientstatus" onclick="tableHeaderClicked()" class="sortable">Account Status</th>\
                    </tr>\
                </thead><tbody>';
    for (var i = 0; i < array.length; i++) {
        // console.log(array[i]); //return;
        var temp = array[i].split(',');
        divStr += '<tr><td><button id="delete" onclick="cellClicked(' + "'delete'" + ')" type="button">Delete</button></td>'
                + '<td><button id="save" onclick="cellClicked(' + "'save'" + ')" type="button">Save</button></td>'
                + '<td onclick="cellClicked(' + "'click'" + ')">' + temp[0] + '</td>'
                + '<td contenteditable="true" onclick="cellClicked(' + "'click'" + ')">' + temp[1] + '</td>'
                + '<td contenteditable="true" onclick="cellClicked(' + "'click'" + ')">' + temp[2] + '</td>'
                + '<td contenteditable="true" onclick="cellClicked(' + "'click'" + ')">' + temp[3] + '</td>'
                + '<td contenteditable="true" onclick="cellClicked(' + "'click'" + ')">' + temp[4] + '</td>'
                + '<td contenteditable="true" onclick="cellClicked(' + "'click'" + ')">' + temp[5] + '</td>'
                + '<td onclick="cellClicked(' + "'click'" + ')">' + temp[6] + '</td>'
                + '</tr>';
    }
    divStr += '</tbody></table></div>';
    $("#content").replaceWith(divStr);
    printMsg("msg", "Item " + mode);
    checkExpiredClient();
    // Had to do this twice to bring the Expired clients data to the top of table 
    document.getElementById("clientstatus").click();
    document.getElementById("clientstatus").click();
    setTimeout(function () { // delay              
        document.getElementById("msg").innerHTML = '<div id="msg"></div>';
    }, 2000);
}

function tableHeaderClicked() {
    //grab all header rows
    $('th').each(function (column) {
        $(this).addClass('sortable').click(function () {
            var findSortKey = function ($cell) {
                return $cell.find('.sort-key').text().toUpperCase() + ' ' + $cell.text().toUpperCase();

            };
            var sortDirection = $(this).is('.sorted-asc') ? -1 : 1;
            var $rows = $(this).parent().parent().parent().find('tbody tr').get();
            var bob = 0;
            //loop through all the rows and find
            $.each($rows, function (index, row) {
                row.sortKey = findSortKey($(row).children('td').eq(column));
            });

            //compare and sort the rows alphabetically or numerically
            $rows.sort(function (a, b) {
                if (a.sortKey.indexOf('-') === -1 && (!isNaN(a.sortKey) && !isNaN(a.sortKey))) {
                    //Rough Numeracy check                          

                    if (parseInt(a.sortKey) < parseInt(b.sortKey)) {
                        return -sortDirection;
                    }
                    if (parseInt(a.sortKey) > parseInt(b.sortKey)) {
                        return sortDirection;
                    }

                } else {
                    if (a.sortKey < b.sortKey) {
                        return -sortDirection;
                    }
                    if (a.sortKey > b.sortKey) {
                        return sortDirection;
                    }
                }
                return 0;
            });

            //add the rows in the correct order to the bottom of the table
            $.each($rows, function (index, row) {
                $('tbody').append(row);
                row.sortKey = null;
            });

            //identify the collumn sort order
            $('th').removeClass('sorted-asc sorted-desc');
            var $sortHead = $('th').filter(':nth-child(' + (column + 1) + ')');
            sortDirection === 1 ? $sortHead.addClass('sorted-asc') : $sortHead.addClass('sorted-desc');

            //identify the collum to be sorted by
            $('td').removeClass('sorted').filter(':nth-child(' + (column + 1) + ')').addClass('sorted');
        });
    });
}
