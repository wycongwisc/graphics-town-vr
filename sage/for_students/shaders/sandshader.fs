/*
Shader for sand blocks at base level
*/

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

in vec2 v_uv;
in vec3 wpos;

void main() {
    vec4 BaseColor = vec4(0.97, 0.9, 0.42, 1);
    vec4 DarkColor = vec4(0.91, 0.77, 0.31, 1);

    float n = smoothstep(0.5, 0.7, wpos.y);
    // TODO: Better coloring: step functions going on gradient
    // TODO: Small dirt particle noise

    vec4 color = mix(DarkColor, BaseColor, n);
    // color = mix(BaseColor, DarkColor, step(0.0, noise(wpos * 10.0)));

    gl_FragColor = color;
}