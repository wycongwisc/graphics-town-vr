/*
 * Simple Vertex 
 * Simple vertex shader, except that we add the UV coordinate
 * All we do is pass this to the fragment shader 
 */

 /* Provided by THREE: (see https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram)
uniform mat4 modelViewMatrix;
attribute vec3 position;
attribute vec2 uv;
  */

/* pass interpolated variables to the fragment */
varying vec2 v_uv;

varying vec3 v_normal;
varying vec3 v_position;

/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */
void main() {
    // compute the position in view space
    vec4 pos = (modelViewMatrix * vec4(position,1.0));
    
    // the main output of the shader (the vertex position)
  //  gl_Position = projectionMatrix * pos;
    
    // pass position to fragment shader
    v_position = pos.xyz;
    
    // compute the view-space normal and pass it to fragment shader
    v_normal = normalMatrix * normal;



    // pass the texture coordinate to the fragment
    v_uv = uv;

    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

