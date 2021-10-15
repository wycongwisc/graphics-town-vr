/*
Shader for water blocks at base level
*/

uniform float time;

in vec2 v_uv;
in vec3 wpos;

void main() {
    vec4 BaseColor = vec4(0.0, 0.59, 0.67, 1);
    vec4 WaveColor = vec4(0.8, 0.86, 0.87, 1);

    float d = 0.5*sin((wpos.x + wpos.z + 0.5*time) * 10.0) + 0.5;

    vec4 color = mix(BaseColor, WaveColor, d);

    gl_FragColor = color;
}