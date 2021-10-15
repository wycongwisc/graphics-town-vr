/*
Shader for water blocks at base level
*/

uniform float time;

out vec2 v_uv;
out vec3 wpos;

void main() {
    v_uv = uv;
    wpos = (modelMatrix * vec4(position, 1.0)).xyz;

    vec3 pos = position;

    // TODO: More detail to this!
    float d = 0.5*sin((wpos.x + wpos.z + 0.5*time) * 10.0);

    pos.y += 0.05 * d;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}