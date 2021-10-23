/*
 * Simple Shader for exercise 8-3
 * The student should make this more interesting, but the interesting parts
 * might be the fragment shader.
  */

/* pass interpolated variables to the fragment */
varying vec2 v_uv;
uniform sampler2D colormap;
uniform float amplitude;
uniform float amplitudeScale;
/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */
void main() {
    // pass the texture coordinate to the fragment
    v_uv = uv;
    vec3 bumpMap = vec3(texture2D(colormap,uv));
    float height = dot(bumpMap, vec3(1))*amplitude;  
    vec3 pos = position - height*normal;

    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}

