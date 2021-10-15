precision highp float;
precision highp int;

/*
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;*/

uniform float highlightIntensity;
uniform vec3 highlightColor;

varying vec3 vNormal;
varying vec3 vPosition;
varying float light;
uniform sampler2D wavetexture;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec4 ocean = texture2D( wavetexture, uv );
    vec4 combine = vec4(clamp( highlightColor * highlightIntensity * light, 0.0, 1.0 ), 1.0 );
    gl_FragColor = mix(ocean,combine,0.0);
}