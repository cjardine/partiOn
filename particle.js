/**
 * Created by Chris on 2015-12-18.
 */
function Particle() {
    this.active = false;
    this.steps = 0;
    this.step = 0;
    this.position = { x: 0, y: 0 };
    this.size = 0;
    this.sizeTheta = 0;
    this.speed = 0;
    this.speedTheta = 0;
    this.directions = {};
    this.color1 = [];
    this.color2 = [];
    this.color1Theta = [];
    this.color2Theta = [];
}
Particle.prototype.reset = function () {
    this.active = false;
    this.steps = 0;
    this.step = 0;
    this.position = { x: 0, y: 0 };
    this.size = 0;
    this.sizeTheta = 0;
    this.speed = 0;
    this.speedTheta = 0;
    this.directions = {};
    this.color1.length = 0;
    this.color2.length = 0;
    this.color1Theta.length = 0;
    this.color2Theta.length = 0;
};
Particle.prototype.update = function () {
    if (this.active) {
        this.step = this.step + 1;
        if (this.step === this.steps) {
            this.reset();
        }
    }
};
//# sourceMappingURL=particle.js.map