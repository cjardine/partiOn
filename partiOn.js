/*
 Welcome to PartiOn!
 ================================================================================================
 The most fun with particle emitters you'll (probably) ever have!

 */
/////////////////////////////////////////////////////////////////////////////////////////////////
// CONSTRUCTOR
/////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * PartiOn: The fun and easy particle library
 * @param {Element} [canvas]
 * @constructor
 */
class PartiOn {
    constructor(canvas) {
        this.canvas = null;
        this.showGenerator = false;
        this.canvasContext = null;
        this.emitters = [];
        this.active = true;
        this.dimensions = {
            height: 0,
            width: 0
        };
        this.debounceTimer = null;
        if (canvas) {
            this.setCanvas(canvas);
        }
        document.addEventListener('resize', (event) => {
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = null;
            }
            this.debounceTimer = setTimeout(() => {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.emitters.forEach((emmitter, index) => {
                });
                clearTimeout(this.debounceTimer);
                this.debounceTimer = null;
            }, 500);
        });
    }
    setCanvas(canvas) {
        if (canvas.nodeName === 'CANVAS') {
            this.canvas = canvas;
            this.canvasContext = this.canvas.getContext('2d');
        }
    }
    setBackgroundColor(color) {
        if (this._checkCanvas()) {
            this.canvas.style.backgroundColor = color;
        }
    }
    setBlendMode(blendMode) {
        if (this._checkCanvas()) {
            this.canvasContext.globalCompositeOperation = blendMode;
        }
    }
    addEmitter(options) {
        let wasEmpty;
        if (this._checkCanvas()) {
            wasEmpty = (this.emitters.length === 0);
            this.emitters.push(new Emitter(options));
            if (wasEmpty && (this.emitters.length === 1)) {
                this._runLoop();
            }
        }
    }
    clearCanvas() {
        if (this._checkCanvas()) {
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    queue() {
        window.requestAnimationFrame(() => {
            this._runLoop();
        });
    }
    _checkCanvas() {
        if (this.canvas && this.canvasContext && this.canvas.constructor.name === "HTMLCanvasElement" && this.canvasContext.constructor.name === "CanvasRenderingContext2D") {
            return true;
        }
        else {
            console.error('No canvas or canvas context available. Use "setCanvas" with a valid canvas element, then add emitter.');
            return false;
        }
    }
    _runLoop() {
        if (this.active) {
            this.clearCanvas();
            this._updateEmitters();
        }
        if (this.emitters.length > 0) {
            this.queue();
        }
    }
    _updateEmitters() {
        let currentEmitter;
        for (let iteration = 0; iteration < this.emitters.length; iteration++) {
            currentEmitter = this.emitters[iteration];
            currentEmitter.update();
            this._drawParticles(currentEmitter);
        }
    }
    _drawParticles(emitter) {
        let currentParticle;
        let gradient, r, g, b, a;
        for (let iteration = 0; iteration < emitter.pool.length; iteration++) {
            currentParticle = emitter.pool[iteration];
            if (currentParticle.active) {
                currentParticle.speed = currentParticle.speed + currentParticle.speedTheta;
                currentParticle.position = {
                    x: ((currentParticle.directions.x * currentParticle.speed) + currentParticle.position.x),
                    y: ((currentParticle.directions.y * currentParticle.speed) + currentParticle.position.y)
                };
                currentParticle.size = Math.abs((currentParticle.size + currentParticle.sizeTheta));
                if (!(((currentParticle.directions.y + currentParticle.size / 2) < 0) ||
                    ((currentParticle.directions.y - currentParticle.size / 2) > this.canvas.height) ||
                    ((currentParticle.directions.x + currentParticle.size / 2) < 0) ||
                    ((currentParticle.directions.x - currentParticle.size / 2) > this.canvas.width))) {
                    this.canvasContext.beginPath();
                    gradient = this.canvasContext.createRadialGradient(currentParticle.position.x, currentParticle.position.y, (currentParticle.size / 2), currentParticle.position.x, currentParticle.position.y, 0);
                    r = Math.round(currentParticle.color1[0] + currentParticle.color1Theta[0]);
                    g = Math.round(currentParticle.color1[1] + currentParticle.color1Theta[1]);
                    b = Math.round(currentParticle.color1[2] + currentParticle.color1Theta[2]);
                    a = (currentParticle.color1[3] + currentParticle.color1Theta[3]);
                    currentParticle.color1 = [r, g, b, a];
                    gradient.addColorStop(1, "rgba(" + r + ", " + g + ", " + b + ", " + a + ")");
                    r = Math.round(currentParticle.color2[0] + currentParticle.color2Theta[0]);
                    g = Math.round(currentParticle.color2[1] + currentParticle.color2Theta[1]);
                    b = Math.round(currentParticle.color2[2] + currentParticle.color2Theta[2]);
                    a = (currentParticle.color2[3] + currentParticle.color2Theta[3]);
                    currentParticle.color2 = [r, g, b, a];
                    gradient.addColorStop(0, "rgba(" + r + ", " + g + ", " + b + ", " + a + ")");
                    switch (emitter.options.shape) {
                        case PartiOn.constants.particle.shapes.SQUARE:
                            this.canvasContext.rect(currentParticle.position.x, currentParticle.position.y, currentParticle.size, currentParticle.size);
                            break;
                        case PartiOn.constants.particle.shapes.TEARDROP:
                            this.canvasContext.beginPath();
                            this.canvasContext.lineJoin = 'round';
                            this.canvasContext.moveTo(currentParticle.position.x, currentParticle.position.y);
                            this.canvasContext.quadraticCurveTo(currentParticle.position.x - (currentParticle.size / 4), currentParticle.position.y + currentParticle.size / 3, currentParticle.position.x + currentParticle.size, currentParticle.position.y + currentParticle.size);
                            this.canvasContext.arc(currentParticle.position.x, currentParticle.position.y + currentParticle.size, (currentParticle.size / 2), 0, 2 * Math.PI, false);
                            this.canvasContext.quadraticCurveTo(currentParticle.position.x - (currentParticle.size / 4), currentParticle.position.y + currentParticle.size / 2, currentParticle.position.x, currentParticle.position.y);
                            break;
                        case PartiOn.constants.particle.shapes.CIRCLE:
                        // fall through
                        default:
                            this.canvasContext.arc(currentParticle.position.x, currentParticle.position.y, (currentParticle.size / 2), 0, 2 * Math.PI, false);
                            break;
                    }
                    this.canvasContext.fillStyle = gradient;
                    this.canvasContext.fill();
                    this.canvasContext.closePath();
                }
            }
        }
    }
}
PartiOn.constants = {
    particle: {
        shapes: {
            SQUARE: 'SQUARE',
            CIRCLE: 'CIRCLE',
            TEARDROP: 'TEARDROP'
        },
        colorTypes: {
            SOLID: 'SOLID',
            GRADIENT: 'GRADIENT'
        },
        gradientTypes: {
            VERTICAL: 'VERTICAL',
            HORIZONTAL: 'HORIZONTAL',
            RADIAL: 'RADIAL'
        }
    },
    canvas: {
        blendModes: {
            "NORMAL": "normal",
            "MULTIPLY": "multiply",
            "SCREEN": "screen",
            "OVERLAY": "overlay",
            "DARKEN": "darken",
            "LIGHTEN": "lighten",
            "COLOR_DODGE": "color-dodge",
            "COLOR_BURN": "color-burn",
            "HARD_LIGHT": "hard-light",
            "SOFT_LIGHT": "soft-light",
            "DIFFERENCE": "difference",
            "EXCLUSION": "exclusion",
            "HUE": "hue",
            "SATURATION": "saturation",
            "COLOR": "color",
            "LUMINOSITY": "luminosity",
            "SOURCE_OVER": "source-over",
            "SOURCE_IN": "source-in",
            "SOURCE_OUT": "source-out",
            "SOURCE_ATOP": "source-atop",
            "DESTINATION_IN": "destination-in",
            "DESTINATION_OUT": "destination-out",
            "DESTINATION_ATOP": "destination-atop",
            "LIGHTER": "lighter",
            "COPY": "copy",
            "XOR": "xor"
        }
    },
    emitter: {}
};
//# sourceMappingURL=partiOn.js.map