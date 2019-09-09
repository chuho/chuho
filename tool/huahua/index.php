<!-- 感謝www.openrise.com/lab/FlowerPower/# 源代碼由朱賀漢化 -->
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>zhuhe&wangchun</title>
    <meta name="description" content="FlowerPower是一個JavaScript實驗由mhepekka使用JavaScript和Canvas開發。繪製的花朵!">
    <meta name="keywords" content="FlowerPower,zhuhe">
    <meta name="author" content="mhepekka&zhuhe">
    <meta name="robots" content="index,follow">
    <meta name="copyright" content="朱賀漢化且進行了優化">
	<link href="default.css" type="text/css" rel="stylesheet">
	<script type="text/javascript" async="" src="ga.js"></script>
	<script type="text/javascript" src="jquery.min.js"></script>
	<script type="text/javascript" src="jquery-ui.min.js"></script>
    <link href="jquery-ui-1.8.2.custom.css" rel="stylesheet" type="text/css">
    <script type="text/javascript">
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-17073626-1']);
	_gaq.push(['_trackPageview']);
	(function () {
	    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
    </script>
    <script type="text/javascript">
	(function ($) {
	function Vector(x, y) {
	    this.x = x;
	    this.y = y;
	};
	Vector.prototype = {
	    rotate: function (theta) {
	        var x = this.x;
	        var y = this.y;
	        this.x = Math.cos(theta) * x - Math.sin(theta) * y;
	        this.y = Math.sin(theta) * x + Math.cos(theta) * y;
	        return this;
	    },
	    mult: function (f) {
	        this.x *= f;
	        this.y *= f;
	        return this;
	    },
	    clone: function () {
	        return new Vector(this.x, this.y);
	    },
	    length: function () {
	        return Math.sqrt(this.x * this.x + this.y * this.y);
	    },
	    subtract: function (v) {
	        this.x -= v.x;
	        this.y -= v.y;
	        return this;
	    },
	    set: function (x, y) {
	        this.x = x;
	        this.y = y;
	        return this;
	    }
	};
	function Petal(stretchA, stretchB, startAngle, angle, growFactor, bloom) {
	    this.stretchA = stretchA;
	    this.stretchB = stretchB;
	    this.startAngle = startAngle;
	    this.angle = angle;
	    this.bloom = bloom;
	    this.growFactor = growFactor;
	    this.r = 1;
	    this.isfinished = false;
	    //this.tanAngleA = Garden.random(-Garden.degrad(Garden.options.tanAngle), Garden.degrad(Garden.options.tanAngle));
	    //this.tanAngleB = Garden.random(-Garden.degrad(Garden.options.tanAngle), Garden.degrad(Garden.options.tanAngle));
	}
	Petal.prototype = {
	    draw: function () {
	        var ctx = this.bloom.garden.ctx;
	        var v1, v2, v3, v4;
	        v1 = new Vector(0, this.r).rotate(Garden.degrad(this.startAngle));
	        v2 = v1.clone().rotate(Garden.degrad(this.angle));
	        v3 = v1.clone().mult(this.stretchA); //.rotate(this.tanAngleA);
	        v4 = v2.clone().mult(this.stretchB); //.rotate(this.tanAngleB);
	        ctx.strokeStyle = this.bloom.c;
	        ctx.beginPath();
	        ctx.moveTo(v1.x, v1.y);
	        ctx.bezierCurveTo(v3.x, v3.y, v4.x, v4.y, v2.x, v2.y);
	        ctx.stroke();
	    },
	    render: function () {
	        if (this.r <= this.bloom.r) {
	            this.r += this.growFactor; // / 10;
	            this.draw();
	        } else {
	            this.isfinished = true;
	        }
	    }
	}
	function Bloom(p, r, c, pc, garden) {
	    this.p = p;
	    this.r = r;
	    this.c = c;
	    this.pc = pc;
	    this.petals = [];
	    this.garden = garden;
	    this.init();
	    this.garden.addBloom(this);
	}
	Bloom.prototype = {
	    draw: function () {
	        var p, isfinished = true;
	        this.garden.ctx.save();
	        this.garden.ctx.translate(this.p.x, this.p.y);
	        for (var i = 0; i < this.petals.length; i++) {
	            p = this.petals[i];
	            p.render();
	            isfinished *= p.isfinished;
	        }
	        this.garden.ctx.restore();
	        if (isfinished == true) {
	            this.garden.removeBloom(this);
	        }
	    },
	    init: function () {
	        var angle = 360 / this.pc;
	        var startAngle = Garden.randomInt(0, 90);
	        for (var i = 0; i < this.pc; i++) {
	            this.petals.push(new Petal(Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), startAngle + i * angle, angle, Garden.random(Garden.options.growFactor.min, Garden.options.growFactor.max), this));
	        }
	    }
	}
	function Garden(ctx, element) {
	    this.blooms = [];
	    this.element = element;
	    this.ctx = ctx;
	}
	Garden.prototype = {
	    render: function () {
	        for (var i = 0; i < this.blooms.length; i++) {
	            this.blooms[i].draw();
	        }
	    },
	    addBloom: function (b) {
	        this.blooms.push(b);
	    },
	    removeBloom: function (b) {
	        var bloom;
	        for (var i = 0; i < this.blooms.length; i++) {
	            bloom = this.blooms[i];
	            if (bloom === b) {
	                this.blooms.splice(i, 1);
	                return this;
	            }
	        }
	    },
	    createRandomBloom: function (x, y) {
	        this.createBloom(x, y, Garden.randomInt(Garden.options.bloomRadius.min, Garden.options.bloomRadius.max), Garden.randomrgba(Garden.options.color.min, Garden.options.color.max, Garden.options.color.opacity), Garden.randomInt(Garden.options.petalCount.min, Garden.options.petalCount.max));
	    },
	    createBloom: function (x, y, r, c, pc) {
	        new Bloom(new Vector(x, y), r, c, pc, this);
	    },
	    clear: function () {
	        this.blooms = [];
	        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
	    }
	}
	Garden.options = {
	    petalCount: {
	        min: 5,
	        max: 15
	    },
	    petalStretch: {
	        min: 0.1,
	        max: 3
	    },
	    growFactor: {
	        min: 0.1,
	        max: 1
	    },
	    bloomRadius: {
	        min: 5,
	        max: 20
	    },
	    density: 10,
	    growSpeed: 1000 / 60,
	    color: {
	        min: 0,
	        max: 255,
	        opacity: 0.5
	    },
	    tanAngle: 90
	};
	Garden.random = function (min, max) {
	    return Math.random() * (max - min) + min;
	};
	Garden.randomInt = function (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	Garden.circle = 2 * Math.PI;
	Garden.degrad = function (angle) {
	    return Garden.circle / 360 * angle;
	};
	Garden.raddeg = function (angle) {
	    return angle / Garden.circle * 360;
	};
	Garden.rgba = function (r, g, b, a) {
	    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	};
	Garden.randomrgba = function (min, max, a) {
	    return Garden.rgba(Math.round(Garden.random(min, max)), Math.round(Garden.random(min, max)), Math.round(Garden.random(min, max)), a);
	};
	Garden.previewColor = "rgba(127,127,127,0.4)";
	$(function () {
	    function renderPreview(caller) {
	        clearInterval(previewInterval);
	        previewInterval = setInterval(function () {
	            preview.render();
	        }, 1);
	        preview.clear();
	        var $caller = $(caller);
	        var id = $caller.attr("id");
	        $previewArea.css({
	            top: 50,
	            left: $caller.position().left - 40
	        }, 100).fadeIn("slow");
	    }
	    function previewBloomRadius() {
	        $lblPreview.html("Size [left: min, right: max]");
	        preview.createBloom(80, 100, Garden.options.bloomRadius.min, Garden.previewColor, Garden.options.petalCount.min);
	        preview.createBloom(220, 100, Garden.options.bloomRadius.max, Garden.previewColor, Garden.options.petalCount.max);
	    }
	    function previewPetalCount() {
	        $lblPreview.text("Petals [left: min, right: max]");
	        preview.createBloom(80, 100, 30, Garden.previewColor, Garden.options.petalCount.min);
	        preview.createBloom(220, 100, 30, Garden.previewColor, Garden.options.petalCount.max);
	    }
	    function previewPetalStretch() {
	        $lblPreview.text("Bezier stretch factor");
	        preview.createBloom(80, 100, 30, Garden.previewColor, Garden.options.petalCount.min);
	        preview.createBloom(220, 100, 30, Garden.previewColor, Garden.options.petalCount.max);
	    }
	    function previewColor() {
	        $lblPreview.text("Color variability");
	        for (var i = 1; i < 5; i++) {
	            for (var j = 1; j < 4; j++) {
	                preview.createBloom(i * 60, j * 50, 20, Garden.randomrgba(Garden.options.color.min, Garden.options.color.max, Garden.options.color.opacity), Garden.random(Garden.options.petalCount.min, Garden.options.petalCount.max));
	            }
	        }
	    }
	    function onChangeBloomRadius(v, caller) {
	        saveValues("bloomRadius", v);
	        renderPreview(caller);
	        previewBloomRadius();
	    }
	    function onChangePetalCount(v, caller) {
	        saveValues("petalCount", v);
	        renderPreview(caller);
	        previewPetalCount();
	    }
	    function onChangePetalStretch(v, caller) {
	        saveValues("petalStretch", v);
	        renderPreview(caller);
	        previewPetalStretch();
	    }
	    function onChangeColor(v, caller) {
	        saveValues("color", v);
	        renderPreview(caller);
	        previewColor();
	    }
	    function saveValues(name, values) {
	        Garden.options[name].min = values[0];
	        Garden.options[name].max = values[1];
	    }
	    // variables
	    var mousePressed = false, lastPos = new Vector(0, 0), actualPos = new Vector(0, 0), $window = $(window), $lblPreview = $("#lblPreview");
	    // garden
	    var gardenCtx, gardenCanvas, $garden, garden, previewInterval;
	    // preview
	    var previewCtx, previewCanvas, $preview, preview, $previewArea;
	    // saveCanvas
	    var saveCtx, saveCanvas;
	    // setup save
	    saveCanvas = $("#save")[0];
	    saveCanvas.width = $window.width();
	    saveCanvas.height = $window.height();
	    saveCtx = saveCanvas.getContext("2d");
	    saveCtx.globalCompositeOperation = "lighter";
	    // setup garden
	    $garden = $("#garden");
	    gardenCanvas = $garden[0];
	    gardenCanvas.width = $window.width();
	    gardenCanvas.height = $window.height() - 20;
	    gardenCtx = gardenCanvas.getContext("2d");
	    gardenCtx.globalCompositeOperation = "lighter";
	    garden = new Garden(gardenCtx, gardenCanvas);
	    // setup preview
	    $preview = $("#preview");
	    $previewArea = $("#previewArea");
	    previewCanvas = $preview[0];
	    previewCtx = previewCanvas.getContext("2d");
	    previewCtx.globalCompositeOperation = "lighter";
	    preview = new Garden(previewCtx, previewCanvas);
	    // renderLoop
	    setInterval(function () {
	        garden.render();
	    }, Garden.options.growSpeed);
	    // sliders
	    $("#sliderBloomRadius").slider({
	        range: true,
	        min: 3,
	        max: 40,
	        values: [5, 20],
	        start: function (e, ui) {
	            onChangeBloomRadius(ui.values, this);
	        },
	        slide: function (e, ui) {
	            onChangeBloomRadius(ui.values, this);
	        }
	    });
	    $("#sliderPetalCount").slider({
	        range: true,
	        min: 3,
	        max: 25,
	        values: [5, 15],
	        start: function (e, ui) {
	            onChangePetalCount(ui.values, this);
	        },
	        slide: function (e, ui) {
	            onChangePetalCount(ui.values, this);
	        }
	    });
	    $("#sliderPetalStretch").slider({
	        range: true,
	        min: 0.2,
	        max: 5,
	        values: [0.1, 3],
	        start: function (e, ui) {
	            onChangePetalStretch(ui.values, this);
	        },
	        slide: function (e, ui) {
	            onChangePetalStretch(ui.values, this);
	        }
	    });
	    $("#sliderColor").slider({
	        range: true,
	        min: 0,
	        max: 255,
	        values: [0, 255],
	        start: function (e, ui) {
	            onChangeColor(ui.values, this);
	        },
	        slide: function (e, ui) {
	            onChangeColor(ui.values, this);
	        }
	    });
	    // events
	    $garden.bind("mouseover", function (e) {
	        clearInterval(previewInterval);
	        $previewArea.fadeOut("slow");
	    });
	    //$(".label").bind("mouseover", function (e) {
	    //    clearInterval(previewInterval);
	    //    $previewArea.fadeOut("slow");
	    //});
	    $garden.bind("mousedown", function (e) {
	        e.preventDefault();
	        var x = e.clientX;
	        var y = e.clientY - 30;
	        mousePressed = true;
	        garden.createRandomBloom(x, y);
	    });
	    $garden.bind("mouseup", function (e) {
	        mousePressed = false;
	    });
	    $garden.bind("mousemove", function (e) {
	        var x = e.clientX;
	        var y = e.clientY - 30;
	        var l = actualPos.set(x, y).subtract(lastPos).length();
	        if (mousePressed && l > (Garden.options.bloomRadius.max)) {
	            garden.createRandomBloom(x, y);
	            lastPos.set(x, y);
	        }
	    });
	    $("#btnClear").click(function (e) {
	        garden.clear();
	    });
	    $("#btnSave").click(function (e) {
	        saveCtx.fillStyle = '#000000';
	        saveCtx.fillRect(0, 0, saveCanvas.width, saveCanvas.height);
	        saveCtx.drawImage(gardenCanvas, 0, 0);
	        window.open(saveCanvas.toDataURL('image/png'), 'FlowerPowerImage');
	    });
	    // Welcome screen
	    $("#welcomeScreen").css({
	        top: $window.height() - 100,
	        left: $window.width() / 2 - 300
	    }).fadeIn("slow");
	    $("body").bind("click", function (e) {
	        $("#welcomeScreen").fadeOut("slow");
	        $(this).unbind("click");
	    });
	    // About
	    $("#btnAbout").toggle(function (e) {
	        $("#aboutScreen").css({
	            width: $("#configArea div.label:first").width() - 20,
	            left: 10,
	            top: 25
	        }).fadeIn("slow");
	    }, function (e) {
	        $("#aboutScreen").fadeOut("slow");
	    });
	});
	})(jQuery);
	</script>
</head>
<body>
    <div id="aboutScreen">
    <h3>朱賀旗下</h3>
    <p>
    <a href="http://blog.zhuhe.tw">朱賀博客</a><br>
    <a href="http://zhuhe.tw/tv">朱賀電視</a><br>
    <a href="http://zhuhe.tw/zhuhe">朱賀簡介</a><br>
    </p>
    <h3>聯繫方式</h3>
    <p>
    <b>字:</b>清平
    <br>
    <b>地址: </b>山東冠縣
    <br>
zhuhe@zhuhe.tw
    </p>
    </div>
    <div id="configArea">
        <div class="label"><span style="padding: 4px 10px; background: #a7d7f9; color: Black;"><b>朱賀畫畫</b> ? <a href="./" id="btnAbout">重新加載</a></span></div>
    <div class="label">大小</div>
    <div class="slider"><div id="sliderBloomRadius" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all"><div class="ui-slider-range ui-widget-header" style="left: 5.405405405405405%; width: 40.54054054054055%; "></div><a href="FlowerPower.htm" class="ui-slider-handle ui-state-default ui-corner-all" style="left: 5.405405405405405%; "></a><a href="FlowerPower.htm" class="ui-slider-handle ui-state-default ui-corner-all" style="left: 45.94594594594595%; "></a></div></div>
    <div class="label">花瓣</div>
    <div class="slider"><div id="sliderPetalCount" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all"><div class="ui-slider-range ui-widget-header" style="left: 9.090909090909092%; width: 45.454545454545446%; "></div><a href="FlowerPower.htm" class="ui-slider-handle ui-state-default ui-corner-all" style="left: 9.090909090909092%; "></a><a href="FlowerPower.htm" class="ui-slider-handle ui-state-default ui-corner-all" style="left: 54.54545454545454%; "></a></div></div>
    <div class="label">曲線</div>
    <div class="slider"><div id="sliderPetalStretch" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all"><div class="ui-slider-range ui-widget-header" style="left: 0%; width: 58.333333333333336%; "></div><a href="FlowerPower.htm" class="ui-slider-handle ui-state-default ui-corner-all" style="left: 0%; "></a><a href="FlowerPower.htm" class="ui-slider-handle ui-state-default ui-corner-all" style="left: 58.333333333333336%; "></a></div></div>
    <div class="label">配色</div>
    <div class="slider"><div id="sliderColor" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all"><div class="ui-slider-range ui-widget-header" style="left: 0%; width: 100%; "></div><a href="FlowerPower.htm" class="ui-slider-handle ui-state-default ui-corner-all" style="left: 0%; "></a><a href="FlowerPower.htm" class="ui-slider-handle ui-state-default ui-corner-all" style="left: 100%; "></a></div></div>
    <div class="label" style="float:right;">
    <script type="text/javascript">
        var flattr_url = 'http://www.openrise.com/lab/FlowerPower/';
        var flattr_btn = 'compact';
    </script>
    <iframe src="saved_resource.htm" width="110" height="20" frameborder="0" scrolling="no" border="0" marginheight="0" marginwidth="0" allowtransparency="true"></iframe><script src="load.js" type="text/javascript"></script></div>
        <div class="label" style="float: right;"><a id="btnSave" href="./">保存</a></div>
        <div class="label" style="float: right;"><a id="btnClear" href="./">清除</a></div>
    <div style="clear: both;"></div>
    </div>
	<canvas id="garden" width="1280" height="655" style="cursor: crosshair;"></canvas>
    <canvas id="save" style="display:none" width="1280" height="675"></canvas>
    <div id="previewArea"><div id="lblPreview">Preview</div>
    <canvas id="preview" width="300" height="200"></canvas>
    </div>
    <div id="welcomeScreen" style="top: 575px; left: 340px; display: none; ">朱賀:試著劃一劃</div>
</body></html>