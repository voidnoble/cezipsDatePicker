cezipsDatePicker
================

jQuery date picker plugin. Default language is korean now.<br>
jQuery 팝업 날짜 선택기 플러그인입니다. 현재 기본 언어는 한국어입니다.

**Screen Shot :**<br>
![cezipsDatePicker](https://raw.githubusercontent.com/cezips76/cezipsDatePicker/master/images/screenshot.png)

**Usage :**
<html>
<head>
    <link rel="stylesheet" href="css/cezipsDatePicker.css">
</head>
<body>
    <input type="text" id="strDate" name="strDate" size="10" maxlength="10" required placeholder="DATE">
   
    <script src=".../jquery.xxx.js"></script>
    <script src="js/jquery.cezipsDatePicker.js"></script>
    <script type="text/javascript">
        $("#strDate").cezipsDatePicker({
            weeks  : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
            months : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        });
    </script>
</body>
</html>
