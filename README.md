# color

> 颜色的设置 处理 及 颜色空间转换

####color("背景色").lighten(0.2).saturation(-0.2).fade(0.8).reverse().toString("hsla");

## 使用

var color = require('color');

var colorConfig = require('color.config');


## 初始化

var color = color('color format');

var color = color('balck');

####可以到color.config中添加自己的颜色配置，如添加设置{"背景色": "#334433"}

var color = color('背景色');

var color = color('#fff');

var color = color('#fffffff');

var color = color('rgb(12,23,45)');

var color = color('rgba(12,23,45,0.4)');

var color = color('hsl(12,0.23,0.45)');

var color = color('hsla(12,0.23,0.45,0.4)');

var color = color('hsl(12,23%,45%)');

var color = color('hsla(12,23%,45%,0.4)');

var color = color('hsv(12,0.23,0.45)');

var color = color('hsva(12,0.23,0.45,0.4)');

var color = color('hsv(12,23%,45%)');

var color = color('hsva(12,23%,45%,0.4)');

var color = color('hsb(12,0.23,0.45)');

var color = color('hsba(12,0.23,0.45,0.4)');

var color = color('hsb(12,23%,45%)');

var color = color('hsba(12,23%,45%,0.4)');

var color = color().random();

var color = color().init('color format');

var color = color().update('color format');


## 调整
#####支持链式调用
color.alpha(0.5)       // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 0.5)

color.fade(0.5)        // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 0.4)

color.opaquer(0.5)     // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 1.0)

color.luminosity(0.5)  // hsl(100, 50%, 50%) -> hsl(100, 50%, 75%)

color.lighten(0.5)     // hsl(100, 50%, 50%) -> hsl(100, 50%, 75%)

color.darken(0.5)      // hsl(100, 50%, 50%) -> hsl(100, 50%, 25%)

color.saturation(0.5)  // hsl(100, 50%, 50%) -> hsl(100, 75%, 50%)

color.saturate(0.5)    // hsl(100, 50%, 50%) -> hsl(100, 75%, 50%)

color.desaturate(0.5)  // hsl(100, 50%, 50%) -> hsl(100, 25%, 50%)

color.grayscale()      // #5CBF54 -> #969696

color.reverse()        // #000000 -> #FFFFFF

color.mix(Color("yellow"))        // cyan -> rgb(128, 255, 128)

color.mix(Color("yellow"), 0.3)   // cyan -> rgb(77, 255, 179)


## 输出

var color = color('#fffffff');

color.toString() 		//'#ffffff'

color.toString("hex") 	//'#ffffff'

color.toString("rgb") 	//'rgb(255,255,255)'

color.toString("rgba") 	//'rgba(255,255,255,1)'

color.toString("hsv") 	//'hsv(0,0%,100%)'

color.toString("hsva") 	//'hsva(0,0%,100%,1)'

color.toString("hsl") 	//'hsl(0,0%,100%)'

color.toString("hsla") 	//'hsla(0,0%,100%,1)'

color.toString("hsb") 	//'hsb(0,0%,100%)'

color.toString("hsba") 	//'hsba(0,0%,100%,1)'