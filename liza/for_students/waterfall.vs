precision highp float;
precision highp int;

/*
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;*/

uniform float time;
uniform float speed;
uniform float frequency;
uniform float amplitude;
uniform float lowerBound;

varying vec3 vNormal;
varying float light;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
    
    float taper = clamp( position.y, lowerBound, 1.0 );
    vUv = uv;
    // To achieve this effect, we look at the object from the top. Imagine we
    // have a cross section of vertices. If it's a sphere, imagine it's the
    // vertices around the equator. We need to animate those vertices as if
    // the radius of the circle they lie on is undulating in a sine wave. To do
    // that, we can simply move their points to or away from the center using
    // vectors https://stackoverflow.com/questions/2353268/java-2d-moving-a-point-p-a-certain-distance-closer-to-another-point
    // In this case, distance is is the sine wave. Then all we need to do is offset
    // the sine wave by how far up/down we are vertex wise, aka the position.y
    vec3 offset = normalize(
        vec3( 0.0 ) - position ) * ( amplitude * sin( speed * time + position.y * frequency )
    ) * taper;
    
    // We throw away the position.y value, which would offset the vertices up
    // and down. We only want them to move "in" and "out"
    vec3 newPosition = position + vec3( offset.x, 0.0, offset.z );

    // To calculate the "top" of each undulation wave, simply add an offset
    // to "y" of the above equation. 1.0 was arrived at through guesswork.
    light = amplitude * sin( speed * time + 1.0 + position.y * frequency ) * taper;

    vPosition = newPosition;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}
