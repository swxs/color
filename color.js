(function (factory) {
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(colorConfig);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["colorConfig"], factory);
    } else {
        // Browser globals
        factory(colorConfig);
    }
}(function (colorConfig) {
    var colorRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsva?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i;

    // 数组映射
    var map = function(array, fun) {
        if (typeof fun !== 'function') {
            throw new TypeError();
        }
        var len = array ? array.length : 0;
        for ( var i = 0; i < len; i++) {
            array[i] = fun(array[i]);
        }
        return array;
    }

    // 调整值区间
    var adjust = function(value, region) {
        return Math.max(region[0], Math.min(value, region[1]));
    }
    
    // 参见 http:// www.easyrgb.com/index.php?X=MATH
    var _HSV_2_RGB = function(data) {
        var H = data[0] / 360.0;
        var S = data[1];
        var V = data[2];
        // HSV from 0 to 1
        var R, G, B;
        if (S === 0) {
            R = V * 255;
            G = V * 255;
            B = V * 255;
        } else {
            var h = H * 6;
            if (h === 6) {
                h = 0;
            }
            var i = Math.floor(h);
            var v1 = V * (1 - S);
            var v2 = V * (1 - S * (h - i));
            var v3 = V * (1 - S * (1 - (h - i)));
            var r = 0;
            var g = 0;
            var b = 0;

            if (i === 0) {
                r = V;
                g = v3;
                b = v1;
            } else if (i === 1) {
                r = v2;
                g = V;
                b = v1;
            } else if (i === 2) {
                r = v1;
                g = V;
                b = v3;
            } else if (i === 3) {
                r = v1;
                g = v2;
                b = V;
            } else if (i === 4) {
                r = v3;
                g = v1;
                b = V;
            } else {
                r = V;
                g = v1;
                b = v2;
            }

            // RGB results from 0 to 255
            R = r * 255;
            G = g * 255;
            B = b * 255;
        }
        return [ R, G, B ];
    }

    var _HUE_2_RGB = function(v1, v2, vH) {
        if (vH < 0) {
            vH += 1;
        }
        if (vH > 1) {
            vH -= 1;
        }
        if ((6 * vH) < 1) {
            return (v1 + (v2 - v1) * 6 * vH);
        }
        if ((2 * vH) < 1) {
            return (v2);
        }
        if ((3 * vH) < 2) {
            return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
        }
        return v1;
    }

    var _HSL_2_RGB = function(data) {
        var H = data[0] / 360.0;
        var S = data[1];
        var L = data[2];
        // HSL from 0 to 1
        var R, G, B;
        if (S === 0) {
            R = L * 255;
            G = L * 255;
            B = L * 255;
        } else {
            var v2;
            if (L < 0.5) {
                v2 = L * (1 + S);
            } else {
                v2 = (L + S) - (S * L);
            }

            var v1 = 2 * L - v2;

            R = 255 * _HUE_2_RGB(v1, v2, H + (1 / 3));
            G = 255 * _HUE_2_RGB(v1, v2, H);
            B = 255 * _HUE_2_RGB(v1, v2, H - (1 / 3));
        }
        return [ R, G, B ];
    }

    var _RGB_2_HSV = function(data) {
        // RGB from 0 to 255
        var R = (data[0] / 255);
        var G = (data[1] / 255);
        var B = (data[2] / 255);

        var vMin = Math.min(R, G, B); // Min. value of RGB
        var vMax = Math.max(R, G, B); // Max. value of RGB
        var delta = vMax - vMin; // Delta RGB value
        var V = vMax;
        var H;
        var S;

        // HSV results from 0 to 1
        if (delta === 0) {
            H = 0;
            S = 0;
        } else {
            S = delta / vMax;

            var deltaR = (((vMax - R) / 6) + (delta / 2)) / delta;
            var deltaG = (((vMax - G) / 6) + (delta / 2)) / delta;
            var deltaB = (((vMax - B) / 6) + (delta / 2)) / delta;

            if (R === vMax) {
                H = deltaB - deltaG;
            } else if (G === vMax) {
                H = (1 / 3) + deltaR - deltaB;
            } else if (B === vMax) {
                H = (2 / 3) + deltaG - deltaR;
            }

            if (H < 0) {
                H += 1;
            }
            if (H > 1) {
                H -= 1;
            }
        }
        H = H * 360.0;
        S = S;
        V = V;
        return [ H, S, V ];
    }

    var _RGB_2_HSL = function(data) {
        // RGB from 0 to 255
        var R = (data[0] / 255);
        var G = (data[1] / 255);
        var B = (data[2] / 255);

        var vMin = Math.min(R, G, B); // Min. value of RGB
        var vMax = Math.max(R, G, B); // Max. value of RGB
        var delta = vMax - vMin; // Delta RGB value

        var L = (vMax + vMin) / 2;
        var H;
        var S;
        // HSL results from 0 to 1
        if (delta === 0) {
            H = 0;
            S = 0;
        } else {
            if (L < 0.5) {
                S = delta / (vMax + vMin);
            } else {
                S = delta / (2 - vMax - vMin);
            }

            var deltaR = (((vMax - R) / 6) + (delta / 2)) / delta;
            var deltaG = (((vMax - G) / 6) + (delta / 2)) / delta;
            var deltaB = (((vMax - B) / 6) + (delta / 2)) / delta;

            if (R === vMax) {
                H = deltaB - deltaG;
            } else if (G === vMax) {
                H = (1 / 3) + deltaR - deltaB;
            } else if (B === vMax) {
                H = (2 / 3) + deltaG - deltaR;
            }

            if (H < 0) {
                H += 1;
            }

            if (H > 1) {
                H -= 1;
            }
        }

        H = H * 360.0;
        S = S;
        L = L;

        return [ H, S, L ];
    }


    var COLOR = COLOR || {};

    COLOR = function(color) {
        if (!(this instanceof COLOR)) {
            return new COLOR(color);
        }

        if(color) {
            this.init(color);
        }
    };

    COLOR.prototype.constructor = COLOR;

    /**
     * 移除颜色字符串中多余空格
     * @param {String} color 颜色
     * @return {String} 无空格颜色
     */
    COLOR.prototype.__trim = function(color) {
        color = String(color);
        color = color.replace(/(^\s*)|(\s*$)/g, '');
        if (/^[^#]*?$/i.test(color)) {
            color = color.replace(/\s/g, '');
        }
        return color;
    };

    /**
     * 整理颜色字符串, 将config设置, ‘#[0-9a-f]{3}’转换成‘#[0-9a-f]{6}’格式, hsb转换成hsv
     * @param {String} color 颜色
     * @return {String} 规整颜色
     */
    COLOR.prototype.__normalize = function(color) {
        var config_color;
        // 颜色名
        try {
            config_color = colorConfig.find(color);
        } catch (err) {
            console.error("not found color.config.js!");
        }
        if(config_color === undefined) {
            // 去掉空格
            color = this.__trim(color);
            // hsv与hsb等价
            color = color.replace(/hsb/i, 'hsv');
        } else {
            color = config_color
        }
        // rgb转为rrggbb
        if (/^#[0-9a-f]{3}$/i.test(color)) {
            var d = color.replace('#', '').split('');
            color = '#' + d[0] + d[0] + d[1] + d[1] + d[2] + d[2];
        }
        return color;
    };

    /**
     * 获取颜色值数组
     * RGB 范围[0-255] <br/>
     * HSL/HSV/HSB 范围[0-1]<br/>
     * A透明度范围[0-1]
     * 支持格式：
     * #rgb
     * #rrggbb
     * rgb(r,g,b)
     * rgb(r%,g%,b%)
     * rgba(r,g,b,a)
     * hsb(h,s,b) // hsv与hsb等价
     * hsb(h%,s%,b%)
     * hsba(h,s,b,a)
     * hsv(h,s,v) // hsv与hsb等价
     * hsv(h%,s%,v%)
     * hsva(h,s,v,a)
     * hsl(h,s,l)
     * hsl(h%,s%,l%)
     * hsla(h,s,l,a)
     * @param {string} color 颜色
     * @return {this}
     */
    COLOR.prototype.init = function(colorString) {
        var d,
            rgb,
            r;
        r = this.__normalize(colorString);
        r = r.match(colorRegExp);

        if (r === null) {
            throw new Error('color format error'); // 颜色格式错误
        }
        this.data = [];
        this.valpha = 1;

        if (r[2]) {
            this.type = "rgb";
            // #rrggbb
            d = r[2].replace('#', '').split('');
            rgb = [ d[0] + d[1], d[2] + d[3], d[4] + d[5] ];
            this.data = map(rgb,
                function(c) {
                    return adjust(parseInt(c, 16), [ 0, 255 ]);
            });
        } else if (r[4]) {
            this.type = "rgb";
            // rgb rgba
            var rgba = (r[4]).split(',');
            var a = rgba[3];
            rgb = rgba.slice(0, 3);

            this.data = map(
                rgb,
                function(c) {
                    c = Math.floor(
                        c.indexOf('%') > 0 ? parseInt(c, 0) * 2.55 : c
                    );
                    return adjust(c, [ 0, 255 ]);
                }
            );

            if( typeof a !== 'undefined') {
                this.type += "a";
                this.valpha = adjust(parseFloat(a), [ 0, 1 ]);
            }
        } else if (r[5] || r[6]) {
            if (r[5]) {
                this.type = "hsv";
            } else {
                this.type = "hsl";
            }
            
            // hsv hsva hsl hsla
            var hsxa = (r[5] || r[6]).split(',');
            var h = adjust(parseInt(hsxa[0], 10), [ 0, 360]);
            var s = hsxa[1];
            var x = hsxa[2];
            var a = hsxa[3];

            this.data = map(
                [ s, x ],
                function(c) {
                    c = c.indexOf('%') > 0 ? parseInt(c, 0) * 0.01 : c
                    return adjust(parseFloat(c), [ 0, 1 ]);
                }
            );
            this.data.unshift(h);

            if( typeof a !== 'undefined') {
                this.type += "a";
                this.valpha = adjust(parseFloat(a), [ 0, 1 ]);
            }
        }
        return this;
    };
    COLOR.prototype.update = COLOR.prototype.init;

    /**
     * 修改获取alpha值
     * @param {number} alpha 设置alpha值选填
     * @return {this(设置) / this.alpha(读取) }
     */
    COLOR.prototype.alpha = function(alpha) {
        if(alpha) {
            this.valpha = adjust(Number(alpha).toFixed(4), [ 0, 1 ]);
            return this;
        } else {
            return this.valpha;
        }  
    };


    /**
     * 修改顔色格式
     * @param {String} format 目标格式
     * @param {boolean} forever 是否保存修改
     * @return {data} 颜色Array
     */
    COLOR.prototype.change = function(format, forever) {
        var format_tmp = (format || "hex") == "hex" ? "rgb" : format.replace("a", "");
        var data; 

        if (this.type.indexOf(format_tmp) > -1) {
            data = [this.data[0], this.data[1], this.data[2]];
        } else {
            if (format_tmp.indexOf('rgb') > -1) {
                if (this.type.indexOf('hsv') > -1 || this.type.indexOf('hsb') > -1) {
                    data = _HSV_2_RGB(this.data);
                }

                if (this.type.indexOf('hsl') > -1) {
                    data = _HSL_2_RGB(this.data);
                }    
            }

            if (format_tmp.indexOf('hsv') > -1 || format_tmp.indexOf('hsb') > -1) {
                if (this.type.indexOf('rgb') > -1) {
                    data = _RGB_2_HSV(this.data);
                }

                if (this.type.indexOf('hsl') > -1) {
                    data = _RGB_2_HSV(_HSL_2_RGB(this.data));
                }    
            }

            if (format_tmp.indexOf('hsl') > -1) {
                if (this.type.indexOf('rgb') > -1) {
                    data = _RGB_2_HSL(this.data);
                }

                if (this.type.indexOf('hsv') > -1) {
                    data = _RGB_2_HSL(_HSL_2_RGB(this.data));
                }   
            }
        }

        if(forever) {
            this.data = data;
            this.type = format_tmp;
        }

        return data;
    };


    /**
     * @param {string} type 输出类型
     * hex  -> @return {string} 16进制颜色，#rrggbb格式
     * rgb  -> @return {string} rgb颜色，rgb(0,0,0)格式
     * rgba -> @return {string} rgba颜色，rgba(r,g,b,a)
     * hsv  -> @return {string} HSV颜色，hsv(h,s,v)
     * hsva -> @return {string} HSVA颜色，hsva(h,s,v,a)
     * hsl  -> @return {string} HSL颜色，hsl(h,s,l)
     * hsla -> @return {string} HSLA颜色，hsla(h,s,l,a)
     * hsb  -> @return {string} HSB颜色，hsb(h,s,b)
     * hsba -> @return {string} HSBA颜色，hsba(h,s,b,a)
     */
    COLOR.prototype.toString = function(format) {
        var format = format || 'hex';

        var data = this.change(format);

        if (data && data.length === 3) {
            if (format.indexOf('hs') > -1) {
                data[0] = parseInt(adjust(Number(data[0]).toFixed(4), [ 0, 255 ]), 10);
                var sx = map(data.slice(1, 3),
                    function(c) {
                        return parseInt(adjust(Number(c*100).toFixed(4), [ 0, 100 ]), 10) + '%';
                });
                data[1] = sx[0];
                data[2] = sx[1];
            } else if (format.indexOf('rgb') > -1) {
                data = map(data,
                    function(c) {
                        return c > 0 ? Math.round(c) : 0;
                });
            } else if (format.indexOf('hex') > -1) {
                data = map(data,
                    function(c) {
                        return c > 0 ? Math.round(c) : 0;
                });
                data = map(data.slice(0, 3),
                    function(c) {
                        c = Number(c).toString(16);
                        return (c.length === 1) ? '0' + c : c;
                });
                return '#' + data.join('');
            }

            if (format.indexOf('a') > -1) {
                if(this.valpha) {
                    this.valpha = adjust(this.valpha, [ 0, 1 ]);
                } else {
                    this.valpha = 1;
                }
                
                return format + '(' + data.slice(0, 3).join(',') + ',' + this.valpha + ')';
            }

            return format + '(' + data.slice(0, 3).join(',') + ')';
        }
    };


    /**
     * @return {this} 随机颜色
     */
    COLOR.prototype.random = function() {
        this.type = "rgba";
        this.valpha = this.valpha || 1;
        this.data = [
            Math.round(Math.random() * 256),
            Math.round(Math.random() * 256),
            Math.round(Math.random() * 256)
        ]
        return this;
    };


    /**
     * 颜色不透明读变低
     * @param {number} ratio 倍数
     * @return {this} 
     */
    COLOR.prototype.fade = function (ratio) {
        return this.alpha(this.valpha - (this.valpha * ratio));
    };

    /**
     * 颜色不透明读变高
     * @param {number} ratio 倍数
     * @return {this} 
     */
    COLOR.prototype.opaquer = function (ratio) {
        return this.alpha(this.valpha + (this.valpha * ratio));
    };

    /**
     * 色相旋转
     * @param {number} degrees 角度
     * @return {this} 
     */
    COLOR.prototype.rotate = function (degrees) {
        var old_type = this.type;
        this.change('hsv', true);
        this.data[0] = adjust(degrees, [0, 360]);
        this.change(old_type, true);
        return this;
    };

    /**
     * 颜色亮度变化
     * @param {number} ratio 倍数
     * @return {this} 
     */
    COLOR.prototype.luminosity = function(ratio) {
        var old_type = this.type;
        this.change('hsv', true);
        this.data[1] += this.data[1] * ratio;
        this.change(old_type, true);
        return this;
    };

    /**
     * 颜色变亮
     * @param {number} ratio 倍数
     * @return {this} 
     */
    COLOR.prototype.lighten = function(ratio) {
        return this.luminosity(ratio);
    };

    /**
     * 颜色变暗
     * @param {number} ratio 倍数
     * @return {this} 
     */
    COLOR.prototype.darken = function(ratio) {
        return this.luminosity(-ratio);
    };


    /**
     * 颜色饱和度变化
     * @param {number} ratio 倍数
     * @return {this}
     */
    COLOR.prototype.saturation = function(ratio) {
        var old_type = this.type;
        this.change('hsv', true);
        this.data[2] += this.data[2] * ratio;
        this.change(old_type, true);
        return this;
    }

    /**
     * 颜色饱和度增强
     * @param {number} ratio 倍数
     * @return {this} 
     */
    COLOR.prototype.saturate = function(ratio) {
        return this.saturation(ratio);
    }

    /**
     * 颜色饱和度减弱
     * @param {number} ratio 倍数
     * @return {this} 
     */
    COLOR.prototype.desaturate = function(ratio) {
        return this.saturation(-ratio);
    }

    /**
     * 颜色灰度值
     * @param {number} ratio 倍数
     * @return {this}
     */
    COLOR.prototype.grayscale = function () {
        // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
        var old_type = this.type;
        this.change('rgb', true);
        this.data[0] *= 0.3;
        this.data[1] *= 0.59;
        this.data[2] *= 0.11;
        this.change(old_type, true);
        return this;
    }

    /**
     * 颜色翻转,[255-r,255-g,255-b,1-a]
     * @return {this}
     */
    COLOR.prototype.reverse = function() {
        var old_type = this.type;
        this.change('rgb', true);
        this.data = map(this.data,
            function(c) {
                return 255 - c;
        });
        this.change(old_type, true);
        return this;
    }


    /**
     * 颜色加深或减淡，当level>0加深，当level<0减淡
     * @param {number} level 升降程度,取值区间[-1,1]
     * @return {string} 加深或减淡后颜色值
     */
    COLOR.prototype.lift = function(level) {
        var old_type = this.type;
        var direct = level > 0 ? 1 : -1;
        if (typeof level === 'undefined') {
            level = 0;
        }
        level = Math.abs(level) > 1 ? 1 : Math.abs(level);
        this.data = this.change('rgb', true);
        for ( var i = 0; i < 3; i++) {
            if (direct === 1) {
                this.data[i] = Math.floor(this.data[i] * (1 - level));
            } else {
                this.data[i] = Math.floor((255 - this.data[i]) * level + this.data[i]);
            }
        }
        this.data = this.change(old_type, true);
        return this;
    }
    
    /**
     * 简单两种颜色混合
     * @param {String} color 第二种颜色
     * @param {String} weight 混合权重[0-1]
     * @return {String} 结果色,rgb(r,g,b)或rgba(r,g,b,a)
     */
    COLOR.prototype.mix = function(color, weight) {
        var old_type = this.type;
        this.change('rgb', true);

        var color_data = color.change('rgb');
        if(typeof weight === 'undefined') {
            weight = 0.5;
        }
        weight = 1 - adjust(weight, [0, 1]);
        var w = weight * 2 - 1;
        var d = this.valpha - color.valpha;
        var weight1 = (((w * d === -1) ? w : (w + d) / (1 + w * d)) + 1) / 2;
        var weight2 = 1 - weight1;
        for ( var i = 0; i < 3; i++) {
            this.data[i] = this.data[i] * weight1 + color_data[i] * weight2;
        }
        this.change(old_type, true);

        this.valpha = this.valpha * weight + color.valpha * (1 - weight);
        this.valpha = adjust(this.valpha, [0, 1]);

        return this;
    }

    return COLOR;
}));