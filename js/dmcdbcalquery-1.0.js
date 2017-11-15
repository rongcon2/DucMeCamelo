var Calendar = new Date();
var selRowContent = "";
var mode = "";
var cellArray;
var Server = 'http://ducme-camelo.rhcloud.com/index.php';
var monthSize = 42;
var monthData = new Array();
var startWeekDay;

var day_of_week = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
var month_of_year = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

var maxrTextChar = 99;
var dbTables = new Array('CAMELO-JAN', 'CAMELO-FEB', 'CAMELO-MAR', 'CAMELO-APR', 'CAMELO-MAY', 'CAMELO-JUN', 'CAMELO-JUL', 'CAMELO-AUG', 'CAMELO-SEP', 'CAMELO-OCT', 'CAMELO-NOV', 'CAMELO-DEC');
var refreshMonth = "Month refreshed";
var changeAct = "Day activity has been changed.";
var monthClear = "Month's Activities cleared.";
var dayToChange = "";

function initcal(tag) {
    var divstr = '<div id="maincontent"><div class="calendar">\
                <div id="calendar"></div>\
                <div>\
                    </br><div><input onclick="clearMonthData()" type="button" value="Clear This Month\'s Activities"></div>\
                    <p>Select desired month for current year:</p>\
                    <span>Month&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Year</span>\
                    <div id="controls"></div>\
                </div>\
                </div>\
                <div class="textareas">\
                <p class="textwrap2">Hover mouse over the day on calendar to view its event(s). Gold colored day is today\'s date. Green colored day has activity.</p>\
                <textarea readonly class="caltext" id="textcontent1" spellcheck="true" rows=10" cols="90"></textarea></br>\
                <p class="textwrap2">To add/change desired day\'s activty, click on its corresponding "Edit" button. Type in to add/change activity for a desired day (less than 1000 characters limit).</p>\
                <textarea  class="caltext" id="textcontent2" spellcheck="true" rows=10" cols="90" onkeyup="showTextCount(this)"></textarea>\
                <div id="textcnt">0 character.</div></br>\
                <div id="ack"></div><center><input id="clearDay" onclick="clearDay()" type="button" value="Clear Day">\
                                            <input id="changeDay" onclick="submitDayChange()" type="button" value="Save Day"></center>\
                </div></div>';
    document.getElementById("dbtitle").innerHTML = '<div id="dbtitle"><p><u>' + tag + '</u></p></div>';
    document.getElementById("maincontent").innerHTML = divstr;
    resetMonthData();
    Calendar = new Date();
    createCalendar(Calendar.getMonth(), Calendar.getFullYear());
    accessCalendarDB(null, 0, 1, refreshMonth);
    setChangeButton(true, "clearDay", "Clear Day");
    setChangeButton(true, "changeDay", "Save Day");
}

function createCalendar(month, year) {
    cellArray = new Array();

    //  DECLARE AND INITIALIZE VARIABLES
    Calendar = new Date();

    var curyear = Calendar.getFullYear();     // Returns year
    var curmonth = Calendar.getMonth();    // Returns month (0-11)
    var today = Calendar.getDate();    // Returns day (1-31)
    var dbIdx = 0;
    var dbWeekDayCol = 0;    // Returns day of teh week (0-6) weekday
    var weekday = Calendar.getDay();    // Returns day of teh week (0-6) 

    var DAYS_OF_WEEK = 7;    // "constant" for number of days in a week
    var DAYS_OF_MONTH = 31;    // "constant" for number of days in a month
    var cal;    // Used for printing

    Calendar.setDate(1);    // Start the calendar day at '1'
    Calendar.setMonth(month);    // Start the calendar month at now
    Calendar.setYear(year);    // Start the calendar month at now

    startWeekDay = Calendar.getDay();    // Returns day of teh week (0-6) 
    //console.log("Start day is " + day_of_week[startWeekDay - 1]);

    /* VARIABLES FOR FORMATTING
     NOTE: You can format the 'border', 'BGCOLOR', 'CELLPADDING', 'bordercolor'
     tags to customize your caledanr's look. */

    var tr_start = '<tr>';
    var tr_end = '</tr>';
    var today_start1 = '<td WIDTH="30"><CENTER><input id="';
    var today_start2 = '" class="edit" onclick="editDayEvent(this)" type="button" value="Edit"><input id="save" class="today" onmouseover="displayDayData(this.value,' + "'textcontent1'" + ')" type="button" value="';

    var activity_with_btn1 = '<td WIDTH="30"><CENTER><input id="';
    var activity_with_btn2 = '" class="edit"  onclick="editDayEvent(this)" type="button" value="Edit"><input id="save" class="activity" onmouseover="displayDayData(this.value,' + "'textcontent1'" + ')" type="button" value="';

    var highlight_end = '"></CENTER></td>';
    var td_start_no_btn = '<td WIDTH="30"><CENTER>';
    var td_end_no_btn = '</CENTER></td>';

    var td_start_with_btn1 = '<td WIDTH="30"><CENTER><input id="';
    var td_start_with_btn2 = '" class="edit" onclick="editDayEvent(this)" type="button" value="Edit"><input id="save" onmouseover="displayDayData(this.value,' + "'textcontent1'" + ')" type="button" value="';

    var td_end_with_btn = '"></CENTER></td>';
    var td_day_cell_start = '<td WIDTH="30" class="today"><CENTER>';
    var tdday_cell_end = '</CENTER></td>';

    /* BEGIN CODE FOR CALENDAR
     NOTE: You can format the 'border', 'BGCOLOR', 'CELLPADDING', 'bordercolor'
     tags to customize your calendar's look.*/

    cal = '<p></p><p></p><p></p><table border=1 CELLSPACING=0 CELLPADDING=0 bordercolor=BBBBBB><tr><td>';
    cal += '<p></p><p></p><p></p><table id="myCal" class="calendar" border=0 CELLSPACING=0 CELLPADDING=2>' + tr_start;
    cal += '<td COLSPAN="' + DAYS_OF_WEEK + '" bgcolor="thistle"><CENTER><B>';
    cal += month_of_year[month] + '   ' + year + '</B>' + tr_end;
    cal += tr_start;

    // LOOPS FOR EACH DAY OF WEEK
    for (var index = 0; index < DAYS_OF_WEEK; index++)
    {
        // BOLD TODAY'S DAY OF WEEK
        if ((month === curmonth) && (year === curyear) && (weekday === index)) // if (weekday == index)
            cal += td_day_cell_start + day_of_week[index] + tdday_cell_end;

        // PRINTS DAY
        else
            cal += td_start_no_btn + day_of_week[index] + td_end_no_btn;
    }
    cal += tr_end;
    cal += tr_start;

    // FILL IN BLANK GAPS UNTIL TODAY'S DAY      
    dbIdx = 0;
    for (var index = 0; index < Calendar.getDay(); index++) {
        cal += td_start_no_btn + '' + td_end_no_btn;
    }

    // LOOPS FOR EACH DAY IN CALENDAR
    for (index = 0; index < DAYS_OF_MONTH; index++)
    {
        if (Calendar.getDate() > index)
        {
            // RETURNS THE NEXT DAY TO PRINT
            dbWeekDayCol = Calendar.getDay();

            //  console.log(dbWeekDayCol);
            // START NEW ROW FOR FIRST DAY OF WEEK
            if (dbWeekDayCol === 0) {
                cal += tr_start;
                dbIdx++;
            }

            if (dbWeekDayCol !== DAYS_OF_WEEK)
            {
                // SET VARIABLE INSIDE LOOP FOR INCREMENTING PURPOSES
                var day = Calendar.getDate();
                //console.log(dbIdx + "," + day_of_week[dbWeekDayCol]);
                cellArray.push(dbIdx + "," + day_of_week[dbWeekDayCol]);

                // HIGHLIGHT TODAY'S DATE
                if (today === Calendar.getDate()) {
                    if ((month === curmonth) && (year === curyear))
                        cal += today_start1 + day + today_start2 + day + highlight_end;
                    else
                        cal += td_start_with_btn1 + day + td_start_with_btn2 + day + td_end_with_btn;
                }
                // PRINTS DAY
                else {
                    // console.log(monthData);
                    var s = monthData[startWeekDay + index];
                    //console.log(s);
                    if (s.localeCompare("No activity set.") !== 0) // activity_start
                        cal += activity_with_btn1 + day + activity_with_btn2 + day + td_end_with_btn;
                    else
                        cal += td_start_with_btn1 + day + td_start_with_btn2 + day + td_end_with_btn;
                }
                //   console.log((index + 1).toString());
            }
            // END ROW FOR LAST DAY OF WEEK
            if (dbWeekDayCol === DAYS_OF_WEEK) {
                cal += tr_end;
            }
        }
        // INCREMENTS UNTIL END OF THE MONTH
        Calendar.setDate(Calendar.getDate() + 1);
    }// end for loop

    // FILL IN BLANK GAPS UNTIL TODAY'S DAY
    for (var j = index; j < DAYS_OF_WEEK - index; j++)
        cal += td_start_no_btn + 'fff' + td_end_no_btn;

    cal += '</td></tr></table></table>';

    //  PRINT CALENDAR
    //document.write(cal);
    document.getElementById("calendar").innerHTML = cal;

    /* select month control */
    var select_month_control = '<select id="monthBox" class="monyr" onChange="changeMonthYearData();">';
    //select_month_control += '<option disabled selected> -- select an option -- </option>';
    for (var x = 0; x < month_of_year.length; x++) {
        select_month_control += '<option value="' + month_of_year[x] + '"' + (x !== month ? '' : ' selected="selected"') + '>' + month_of_year[x] + '</option>';
    }
    select_month_control += '</select>';

    /* select year control */
    var year_range = 1;
    var select_year_control = '<select id="yearBox" class="monyr" onChange="changeMonthYearData();">';
    //echo $year - floor($year_range / 2);
    //echo $year + floor($year_range / 2);
    // for (x = ($year - floor($year_range / 2)); x <= ($year + floor($year_range / 2)); x++) {
    for (var x = curyear; x < (curyear + year_range); x++) { // current year to next 7 years
        select_year_control += '<option value="' + x + '"' + (x !== year ? '' : ' selected="selected"') + '>' + x + '</option>';
    }
    select_year_control += '</select>';
    document.getElementById("controls").innerHTML = select_month_control + select_year_control;
}

function showTextCount(input) {
    // if ((input.value.length) > maxrTextChar)
    //     input.value = input.value.substring(0, maxrTextChar);
    // else
    document.getElementById("textcnt").innerHTML = '<div id="textcnt">' + (input.value.length) + '  characters.</div>';
}

function displayDayData(value, divId) {
    var idx = Number(value);//startWeekDay
    var s = cellArray[idx - 1].split(',');
    var m = Calendar.getMonth() - 1;
    if (m === -1) // December
        m = 11;
    var date = s[1] + " " + month_of_year[m] + " " + idx + ", " + Calendar.getFullYear() + "\n\n";
    var t = monthData[startWeekDay + idx - 1].split('|');
    for (var i = 0; i < t.length; ++i)
        date += (i + 1) + ". " + t[i] + "\n";
    var editdate = monthData[startWeekDay + idx - 1];
    if (divId.localeCompare('textcontent1') === 0)
        document.getElementById(divId).innerHTML = date;
    else {
        document.getElementById(divId).innerHTML = editdate;
        showTextCount(document.getElementById(divId));
    }
}

function setChangeButton(stat, id, val) {
    var m = document.getElementById(id);
    m.value = val;
    m.disabled = stat;
}

function editDayEvent(input) {
    dayToChange = $(input).attr('id');
    displayDayData($(input).attr('id'), 'textcontent2');
    setChangeButton(false, "clearDay", "Clear Day " + dayToChange);
    setChangeButton(false, "changeDay", "Save Day " + dayToChange);
}

function resetMonthData() {
    monthSize = 42;
    while (monthSize--) {
        monthData[monthSize] = "No activity set.";
    }
}

function clearMonthData() {
    accessCalendarDB(null, 3, 1, monthClear);
}

function changeMonthYearData() {//(optionBox) {
    accessCalendarDB(null, 0, 0, refreshMonth);
    setChangeButton(true, "clearDay", "Clear Day");
    setChangeButton(true, "changeDay", "Save Day");  
}

function clearDay() {
    var m = document.getElementById("textcontent2");
    m.value = "No activity set.";
    accessCalendarDB(dayToChange, 1, 1, changeAct);
}

function submitDayChange() {
    accessCalendarDB(dayToChange, 1, 1, changeAct);
}

function accessCalendarDB(dayvalue, which, refresh, msg) {
    var m = document.getElementById("monthBox");
    var table;
    if (m !== null)
        table = dbTables[m.selectedIndex];
    var baseParam = "";
    var params = "";

    if (which === 0) { // // RETRIEVE whole month's data
        params = "code=0&index=1&colname=1&text=empty&table=" + table + "&mode=manage";
    }

    if (which === 1) { // Save/update day's data
        var s = cellArray[Number(dayvalue) - 1].split(',');
        //console.log("idx = " + s[0] + " col= " + s[1]); // row and col indices for database referecing
        var input = document.getElementById("textcontent2");
        console.log(input.value);
        baseParam = "&index=" + s[0] + "&colname=" + s[1] + "&text=" + input.value + "&table=" + table + "&mode=manage";
        params = "code=1" + baseParam;
    }

    if (which === 3) { // CLEAR MONTH'S activites
        params = "code=3&index=1&colname=1&text=empty&table=" + table + "&mode=manage";
    }

    setTimeout(function () { // delay 
        //console.log("accessCalendarDB  " + params);
        $.post(Server, {"LICH": params}, function (data) { // sending ajax post request
            var temp = JSON.stringify(data);
            //console.log(temp);
            monthData = JSON.parse(temp);
            var m = document.getElementById("monthBox");
            var y = document.getElementById("yearBox");
            document.getElementById("textcontent1").innerHTML = ""; // for readonly    
            document.getElementById("textcontent2").innerHTML = ""; // for readonly
            document.getElementById("textcnt").innerHTML = '<div id="textcnt">0 character.</div>';
            //console.log(m.selectedIndex + " " + Number(y.options[y.selectedIndex].value)); 
            createCalendar(m.selectedIndex, Number(y.options[y.selectedIndex].value));
            // if (which === 1) {
            document.getElementById("ack").innerHTML = msg;
            setTimeout(function () { // delay 
                document.getElementById("ack").innerHTML = '<div id="ack"></div>';
            }, 3000);
            //}
        });
    }, 50);
}