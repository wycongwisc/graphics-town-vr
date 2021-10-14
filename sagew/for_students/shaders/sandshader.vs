/*
Shader for sand blocks at base level
*/

uniform float xPlusNeighbor;
uniform float xMinusNeighbor;
uniform float zPlusNeighbor;
uniform float zMinusNeighbor;

out vec2 v_uv;
out vec3 wpos;

const float HEIGHT_FALLOFF_DIST = 0.3;

// hash based 3d value noise
// function taken from https://www.shadertoy.com/view/XslGRr
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// ported from GLSL to HLSL

float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

float noise( vec3 x )
{
    // The noise function returns a value in the range -1.0f -> 1.0f

    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;

    return mix(mix(mix( hash(n+0.0), hash(n+1.0),f.x),
                   mix( hash(n+57.0), hash(n+58.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
}

void main() {
    v_uv = uv;
    wpos = (modelMatrix * vec4(position, 1.0)).xyz;

    vec3 pos = position;

    float largeNoise = noise(2.94 * wpos + vec3(1.4, 2.1, 5.1));
    float smallNoise = noise(10.13 * wpos + vec3(0.1, 0.2, 0.3));

    // Calculate Falloff for edges of sand not neighboring other sand tiles
    float heighFalloff = 1.0-smoothstep(-0.5, -0.5+HEIGHT_FALLOFF_DIST, pos.x*(1.0-xMinusNeighbor));
    heighFalloff += 1.0-smoothstep(0.5, 0.5-HEIGHT_FALLOFF_DIST, pos.x*(1.0-xPlusNeighbor));
    heighFalloff += 1.0-smoothstep(-0.5, -0.5+HEIGHT_FALLOFF_DIST, pos.z*(1.0-zMinusNeighbor));
    heighFalloff += 1.0-smoothstep(0.5, 0.5-HEIGHT_FALLOFF_DIST, pos.z*(1.0-zPlusNeighbor));

    float raiseFactor = 0.2*largeNoise + 0.03*smallNoise - 0.2*heighFalloff; // This should range from 0 to 1

    pos.y += raiseFactor;
    pos.y = clamp(pos.y, 0.0, 100000.0);
    wpos.y = pos.y; // FIXME: Better sequencing

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}