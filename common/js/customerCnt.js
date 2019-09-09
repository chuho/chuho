//�P�_�ù��e��
    function fnCheckWidthStatus() {
        var intStatus = 0;
        if (($(window).width() <= 768)) {
            //��ʪ�
            intStatus = 1;
        } else if (($(window).width() > 768)) {
            //����O
            intStatus = 2;
        }
        //if (($(window).width() <= 768) && (winWidth >= 768)) {
        //    //��ʪ�
        //    intStatus = 1;
        //} else if (($(window).width() > 768) && (winWidth < 768)) {
        //    //����O
        //    intStatus = 2;
        //}
        winWidth = $(window).width();
        return intStatus;
    }
    //�P�_�s����
    function fnGetBrowser() {
        var gAgent = navigator.userAgent;
        var gName = navigator.appName;
        var fullVer = "" + parseFloat(navigator.appVersion);
        var majorVer = parseInt(navigator.appVersion, 10);
        var sName, sVer, sTrim;
        if ((sVer = gAgent.indexOf("Opera")) != -1) {
            gName = "Opera";
            fullVer = gAgent.substring(sVer + 6);
            if ((sVer = gAgent.indexOf("Version")) != -1) fullVer = gAgent.substring(sVer + 8);
        } else if ((sVer = gAgent.indexOf("MSIE")) != -1) {
            gName = "IE";
            fullVer = gAgent.substring(sVer + 5);
        } else if ((sVer = gAgent.indexOf("Sleipnir")) != -1) {
            gName = "Sleipnir";
            fullVer = gAgent.substring(sVer + 9);
        } else if ((sVer = gAgent.indexOf("Chrome")) != -1) {
            gName = "Chrome";
            fullVer = gAgent.substring(sVer + 7);
        } else if ((sVer = gAgent.indexOf("Safari")) != -1) {
            gName = "Safari";
            fullVer = gAgent.substring(sVer + 7);
            if ((sVer = gAgent.indexOf("Version")) != -1) fullVer = gAgent.substring(sVer + 8);
        } else if ((sVer = gAgent.indexOf("Firefox")) != -1) {
            gName = "Firefox";
            fullVer = gAgent.substring(sVer + 8);
        } else if ((sName = gAgent.lastIndexOf(' ') + 1) < (sVer = gAgent.lastIndexOf('/'))) {
            /* �h���s�������W�٪����O�b userAgent ������*/
            gName = gAgent.substring(sName, sVer);
            fullVer = gAgent.substring(sVer + 1);
            if (gName.toLowerCase() == gName.toUpperCase()) {
                gName = navigator.appName;
            }
        }
        return gName;
    }