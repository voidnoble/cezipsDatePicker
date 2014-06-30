(function($) {

    $.fn.cezipsDatePicker = function( options ) {
        var dateInputElement = this;
    
        var defaults = {
            weeks  : ["일","월","화","수","목","금","토"],
            months : ["1","2","3","4","5","6","7","8","9","10","11","12"]
        };
        
        var settings = $.extend( {}, defaults, options );

        var calendarContainerHTML = '<div id="calendar-container">'+
        '    <div class="calendar-controlbar">'+
        '        <button id="prevMonth">&lt;</button>'+
        '        <select name="year" id="year"></select>'+
        '        <select name="month" id="month"></select>'+
        '        <button id="nextMonth">&gt;</button>'+
        '    </div>'+
        '    <table class="calendar">'+
        '        <thead>'+
        '            <tr></tr>'+
        '        </thead>'+
        '        <tbody>'+
        '        </tbody>'+
        '        <tfoot>'+
        '            <tr>'+
        '                <td colspan="7"><button id="btnCalendarToday">오늘</button><button id="btnCalendarClose">닫기</button></td>'+
        '            </tr>'+
        '        </tfoot>'+
        '    </table>'+
        '</div>';

        $("body").append(calendarContainerHTML);
        var calendar = $("#calendar-container");

        // 현재 날짜
        var d = new Date();
        var countOfWeek = 7;
        var currentDate = {
            year : d.getFullYear(),
            month : d.getMonth() + 1,
            day : d.getDate()
        };

        String.prototype.toInteger = function() {
            return parseInt(this);
        };
        
        String.prototype.pad = function(length, strPad) {
            var input = this;
            strPad = strPad || '0';
            input = input + '';
            return input.length >= length ? input : new Array(length - input.length + 1).join(strPad) + input;
        };

        /*
            해당 년-월 첫날의 요일을 구하는 함수
            Sun = 0
        */
        function getWeekFirstDayOfMonth(y, m) {
            var theDate = new Date(y, m - 1, 1);
            var week = theDate.getDay();
            return week;
        }

        /*
            해당 년-월의 마지막 일을 구하는 함수            
        */
        function getLastDayOfMonth(y, m) {
            var theDate = new Date(y, m, 0);
            var lastDayOfMonth = theDate.getDate();
            return lastDayOfMonth;
        }


        function printCalendarDays(y, m) {
            // 현재 년-월의 첫날의 요일은?
            var weekFirstDayOfCurrentMonth = getWeekFirstDayOfMonth(y, m);

            // 현재 년-월의 마지막날짜는?
            var lastDayOfCurrentMonth = getLastDayOfMonth(y, m);

            var cols = countOfWeek; // 열 수는 요일의 수
            var rows = Math.ceil( (lastDayOfCurrentMonth + weekFirstDayOfCurrentMonth) / cols ); // 무조건 반올림하여 최대 행 수를 계산

            var firstDayOfCalendar = 1, lastDayOfPastMonth = 31,
                bCurrentMonth = true;
            // 첫 행의 첫 컬럼 일자
            if (weekFirstDayOfCurrentMonth != 0) {
                bCurrentMonth = false;
                // 지난 달의 마지막 일자 구하고
                lastDayOfPastMonth = getLastDayOfMonth(y, --m);                
                // 첫 행의 첫 컬럼 일자 = 지난 달의 마지막 일자 - --weekFirstDayOfCurrentMonth
                firstDayOfCalendar = lastDayOfPastMonth - --weekFirstDayOfCurrentMonth;
            }

            var col = 1, row = 1, calDay = firstDayOfCalendar,                
                calendarHTML = "", calDayCSSClass = "";

            while (row <= rows) {
                calendarHTML += "<tr>";
                col = 1;
                while (col <= cols) {                    
                    if (!bCurrentMonth) {
                        if (calDay > lastDayOfPastMonth) {
                            calDay = 1;
                            bCurrentMonth = true;
                        } else {
                            bCurrentMonth = false;
                        }
                    }

                    calDayCSSClass = "";
                    if (currentDate.year == $("#year").val() && currentDate.month == $("#month").val() && currentDate.day == calDay) {
                        calDayCSSClass = "current";
                    } else if (!bCurrentMonth) {
                        calDayCSSClass = "not-current-month";
                    }

                    if (calDayCSSClass != "") calDayCSSClass = ' class="'+ calDayCSSClass +'"';
                    calendarHTML += "<td"+ calDayCSSClass +">"+ calDay +"</td>";

                    ++col;
                    ++calDay;

                    if (bCurrentMonth && calDay > lastDayOfCurrentMonth) {
                        calDay = 1;
                        bCurrentMonth = false;
                    }
                }

                calendarHTML += "</tr>";
                ++row;
            }

            $("table.calendar tbody").html(calendarHTML);
        }

        // 연도 최소,최대값
        var minYear = 1950;
        var maxYear = currentDate.year + 100;

        var selectOptions;

        // 연도 선택상자 항목
        selectOptions = "";
        for ( var y = minYear; y <= maxYear; y++ ) {
            selectOptions += '<option value="'+ y +'">'+ y +'</option>';
        }
        // 연도 선택상자 항목 채우고 현재 년도로 값 설정
        $("#year").append(selectOptions).val(currentDate.year);

        // 월 선택상자 항목
        selectOptions = "";
        for ( var i = 0; i < settings.months.length; i++) {
            var m = settings.months[i];
            selectOptions += '<option value="'+ m +'">'+ m +'</option>';
        }
        // 달 선택상자
        $("#month").append(selectOptions).val(currentDate.month);

        // 주 표시
        lableWeek = "";
        for ( var i = 0; i < settings.weeks.length; i++) {
            var w = settings.weeks[i];
            lableWeek += '<td>'+ w +'</td>';
        }
        $("table.calendar thead tr").html(lableWeek);

        // 현재 달력
        printCalendarDays(currentDate.year, currentDate.month);

        // 이전 달 버튼 클릭시
        $("#prevMonth").click(function() {
            var m = $("#month").val().toInteger();
            if (m == 1) {
                $("#year").val( $("#year").val().toInteger() - 1 );
                $("#month").val(12);
            } else {
                $("#month").val( --m );
            }

            printCalendarDays( $("#year").val(), $("#month").val() );
        });

        // 다음 달 버튼 클릭시
        $("#nextMonth").click(function() {
            var m = $("#month").val().toInteger();
            if (m == 12) {
                $("#year").val( $("#year").val().toInteger() + 1 );
                $("#month").val(1);
            } else {
                $("#month").val( ++m );
            }            

            printCalendarDays( $("#year").val(), $("#month").val() );
        });

        // 년/월 선택상자 변경시
        $("#year, #month").change(function() {
            printCalendarDays( $("#year").val(), $("#month").val() );
        });

        // 오늘 버튼 클릭시
        $("#btnCalendarToday").click(function() {
            $("#year").val( currentDate.year );
            $("#month").val( currentDate.month );

            printCalendarDays( $("#year").val(), $("#month").val() );
            
            var ymd = currentDate.year.toString() +"-"+ currentDate.month.toString().pad(2, 0) +"-"+ currentDate.day.toString().pad(2, 0);
            
            dateInputElement.val( ymd );
            calendar.hide();
        });
        
        // 닫기 버튼 클릭시
        $("#btnCalendarClose").click(function() {
            calendar.hide();
        });
        
        // 날짜 클릭시
        $(calendar).find(".calendar tbody td").click(function() {
            var newDate, y = "", m = "", day = $(this).text();
            
            if ( $(this).hasClass("not-current-month") ) {
                if ( $(this).text().toInteger() < 7 ) {
                    newDate = new Date(new Date(d).setMonth(d.getMonth() + 1));
                    y = newDate.getFullYear();
                    m = newDate.getMonth() + 1;
                } else if ($(this).text().toInteger() >= 25) {
                    newDate = new Date(new Date(d).setMonth(d.getMonth() - 1));
                    y = newDate.getFullYear();
                    m = newDate.getMonth() + 1;
                }
            } else {
                y = $("#year").val();
                m = $("#month").val();
            }
            
            var ymd = y +"-"+ m.toString().pad(2,0) +"-"+ day.pad(2,0);
            dateInputElement.val( ymd );
            calendar.hide();
        });
        
        this.click(function() {
            calendar.toggle();
        });
        
        // 마무으리
        return this;
    };

})(jQuery);