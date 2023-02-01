import { BackSide, Color, Mesh, ShaderMaterial, SphereGeometry } from 'three';

class Background extends Mesh {
    constructor() {
        super();
        this.name = 'Background';
        this.radius = 1;
        this.up.set(0, 0, 1);
        this.scale.set(10, 10, 10);
        this.geometry = new SphereGeometry(this.radius, 8, 8);
        this.geometry.computeBoundingBox();
        this.material = new ShaderMaterial({
            uniforms: {
                top: {  value: new Color("#0094ff") },
                bottom: { value: new Color("#ffffff") },
                min: { value: this.geometry.boundingBox.min },
                max: { value: this.geometry.boundingBox.max },
                scale: { value: 0.1 }
            },
            vertexShader: `
                uniform vec3 min;
                uniform vec3 max;
                uniform float scale;
                varying vec2 vUv;
                void main() {
                    vUv.y = (position.y - min.y) / (max.y - min.y);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 bottom;
                uniform vec3 top;
                varying vec2 vUv;
                void main() {
                    gl_FragColor = vec4(mix(bottom, top, vUv.y), 1.0);
                }
            `,
            side: BackSide
        });

        // Rotate to appear horizontal on z-axis
        this.rotation.x = Math.PI / 2;
    }

    update(delta, alpha) {
        if (this.target) {
            this.position.copy(this.target.position);
        }
    }
}

export { Background };