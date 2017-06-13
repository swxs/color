requirejs(["chai", "color"], function(chai, color) {
	var expect = chai.expect;
	var assert = chai.assert;
	var c1 = color("black");
	describe('mocha', function(){
		it('mocha start', function(){
			expect(chai).to.be.not.empty;	
		})
	})

	describe('color BASE', function(){
		it('color exist', function(){
			expect((new color()) instanceof color).to.equal(true);
		})

		it('new color()', function(){
			var c1 = new color("#fff");
			expect(c1).to.be.not.empty;
		})

		it('color()', function() {
			var c2 = color("#000");
			expect(c2).to.be.not.empty;
		})

		it('color init with config', function() {
			var c1 = color("black");
			expect(c1).to.be.not.empty;
			expect(c1.toString("hex")).to.equal('#000000');
		})

		it('color init with \'#[0-9A-Fa-f]{3}\'', function() {
			var c1 = color("#123");
			expect(c1).to.be.not.empty;
			expect(c1.toString("hex")).to.equal('#112233');
			var c2 = color("#1Ab");
			expect(c2).to.be.not.empty;
			expect(c2.toString("hex")).to.equal('#11aabb');
		})

		it('color init with \'#[0-9A-Fa-f]{6}\'', function() {
			var c1 = color("#158ABc");
			expect(c1).to.be.not.empty;
			expect(c1.toString("hex")).to.equal('#158abc');
		})

		it('color init with \'rgb(<0~255>{3})\'', function() {
			var c1 = color("rgb(3, 123, 255)");
			expect(c1).to.be.not.empty;
			expect(c1.toString("rgb")).to.equal('rgb(3,123,255)');
		})

		it('color init with \'rgba(<0~255>{3}, <0~1>{1})\'', function() {
			var c1 = color("rgb(3, 123, 255, 0.2)");
			expect(c1).to.be.not.empty;
			expect(c1.toString("rgba")).to.equal('rgba(3,123,255,0.2)');
		})

		it('color init with \'hsl(<0~360>{1}, <0~1>{2})\'', function() {
			var c1 = color("hsl(233,0.1,0.1)");
			expect(c1).to.be.not.empty;
			expect(c1.toString("hsl")).to.equal('hsl(233,10%,10%)');
		})

		it('color init with \'hsl(<0~360>{1}, <0~100>%{2})\'', function() {
			var c1 = color("hsl(233,10%,10%)");
			expect(c1).to.be.not.empty;
			expect(c1.toString("hsl")).to.equal('hsl(233,10%,10%)');
		})

		it('color init with \'hsla(<0~360>{1}, <0~1>{2}, <0~1>{1})\'', function() {
			var c1 = color("hsla(233,0.1,0.1,0.2)");
			expect(c1).to.be.not.empty;
			expect(c1.toString("hsla")).to.equal('hsla(233,10%,10%,0.2)');
		})

		it('color init with \'hsla(<0~360>{1}, <0~100>%{2}, <0~1>{1})\'', function() {
			var c1 = color("hsla(233,10%,10%,0.2)");
			expect(c1).to.be.not.empty;
			expect(c1.toString("hsla")).to.equal('hsla(233,10%,10%,0.2)');
		})

		it('color init with \'hsv(<0~360>{1}, <0~1>{2})\'', function() {
			var c1 = color("hsv(233,0.1,0.1)");
			expect(c1).to.be.not.empty;
			expect(c1.toString("hsv")).to.equal('hsv(233,10%,10%)');
		})

		it('color init with \'hsv(<0~360>{1}, <0~100>%{2})\'', function() {
			var c1 = color("hsv(233,10%,10%)");
			expect(c1).to.be.not.empty;
			expect(c1.toString("hsv")).to.equal('hsv(233,10%,10%)');
		})

		it('color init with \'hsva(<0~360>{1}, <0~1>{2}, <0~1>{1})\'', function() {
			var c1 = color("hsva(233,0.1,0.1,0.2)");
			expect(c1).to.be.not.empty;
			expect(c1.toString("hsva")).to.equal('hsva(233,10%,10%,0.2)');
		})

		it('color init with \'hsva(<0~360>{1}, <0~100>%{2}, <0~1>{1})\'', function() {
			var c1 = color("hsva(233,10%,10%,0.2)");
			expect(c1).to.be.not.empty;
			expect(c1.toString("hsva")).to.equal('hsva(233,10%,10%,0.2)');
		})

		it('color().random()', function() {
			var c1 = color().random();
			expect(c1).to.be.not.empty;
		})

		it('color.alpha(<0~1>{0,1})', function() {
			var c1 = color('rgba(10,20,30,0.5)');
			expect(c1.alpha()).to.equal(0.5);
			expect(c1.alpha(0.3).alpha()).to.equal(0.3);
		})

		it('color.init() & color.update() to init & update color', function() {
			var c1 = color("rgb(100,100,100)");
			var c2 = color().init("rgb(100,100,100)");
			var c3 = color().update("rgb(100,100,100)");
			expect(c1).to.deep.equal(c2);
			expect(c1).to.deep.equal(c3);
		})
	})

	describe('color PRINT', function() {
		it('toString()', function() {
			var c1 = new color("#fff");
			expect(c1.toString("hex")).to.equal('#ffffff');
			expect(c1.toString("rgb")).to.equal('rgb(255,255,255)');
			expect(c1.toString("rgba")).to.equal('rgba(255,255,255,1)');
			expect(c1.toString("hsv")).to.equal('hsv(0,0%,100%)');
			expect(c1.toString("hsva")).to.equal('hsva(0,0%,100%,1)');
			expect(c1.toString("hsl")).to.equal('hsl(0,0%,100%)');
			expect(c1.toString("hsla")).to.equal('hsla(0,0%,100%,1)');
			expect(c1.toString("hsb")).to.equal('hsb(0,0%,100%)');
			expect(c1.toString("hsba")).to.equal('hsba(0,0%,100%,1)');
		})
	})

	describe('color UTIL', function() {
		it('fade(ratio)', function(){
			var c1 = new color("hsva(120, 0.4, 0.4, 0.4)");
			expect(c1.fade(0.5).toString("hsva")).to.equal("hsva(120,40%,40%,0.2)");
		})

		it('opaquer(ratio)', function(){
			var c1 = new color("hsva(120, 0.4, 0.4, 0.4)");
			expect(c1.opaquer(0.5).toString("hsva")).to.equal("hsva(120,40%,40%,0.6)");
		})

		it('rotate(degrees)', function(){
			var c1 = new color("hsva(120, 0.4, 0.4, 0.8)");
			expect(c1.rotate(130).toString("hsva")).to.equal("hsva(130,40%,40%,0.8)");
		})

		it('luminosity(ratio)', function(){
			var c1 = new color("hsva(120, 0.4, 0.4, 0.8)");
			expect(c1.luminosity(0.5).toString("hsva")).to.equal("hsva(120,60%,40%,0.8)");
		})

		it('lighten(ratio)', function(){
			var c1 = new color("hsva(120, 0.4, 0.4, 0.8)");
			expect(c1.lighten(0.5).toString("hsva")).to.equal("hsva(120,60%,40%,0.8)");
		})

		it('darken(ratio)', function(){
			var c1 = new color("hsva(120, 0.4, 0.4, 0.8)");
			expect(c1.darken(0.5).toString("hsva")).to.equal("hsva(120,20%,40%,0.8)");
		})

		it('saturation(ratio)', function(){
			var c1 = new color("hsva(120, 0.4, 0.4, 0.8)");
			expect(c1.saturation(0.5).toString("hsva")).to.equal("hsva(120,40%,60%,0.8)");
		})

		it('saturate(ratio)', function(){
			var c1 = new color("hsva(120, 0.4, 0.4, 0.8)");
			expect(c1.saturate(0.5).toString("hsva")).to.equal("hsva(120,40%,60%,0.8)");

		})

		it('desaturate(ratio)', function(){
			var c1 = new color("hsva(120, 0.4, 0.4, 0.8)");
			expect(c1.desaturate(0.5).toString("hsva")).to.equal("hsva(120,40%,20%,0.8)");
		})

		it('grayscale()', function(){
			var c1 = new color("rgb(122,12,239)");
			expect(c1.grayscale().toString("rgb")).to.equal("rgb(37,7,26)");
		})

		it('reverse()', function(){
			var c1 = new color("rgb(122,12,239)");
			expect(c1.reverse().toString("rgb")).to.equal("rgb(133,243,16)");
		})

		it('mix(color, weight)', function () {
			expect(color('#f00').mix(color('#00f')).toString('hex')).to.equal('#800080');
			expect(color('#f00').mix(color('#00f'), 0.25).toString('hex')).to.equal('#bf0040');
			expect(color('rgba(255, 0, 0, 0.5)').mix(color('#00f')).toString('rgba')).to.equal('rgba(64,0,191,0.75)');
			expect(color('#f00').mix(color('#00f'), 0.5).toString('hex')).to.equal('#800080');
			expect(color('#f00').mix(color('#00f'), 0).toString('hex')).to.equal('#ff0000');
			expect(color('#f00').mix(color('#00f'), 1.0).toString('hex')).to.equal('#0000ff');
		});
	})

	describe('Exception', function() {
		it('color format error', function() {
			var errorFormat = function() {color().init("unknow")}
			expect(errorFormat).to.throw('color format error');
		})
	})

	mocha.run();
})