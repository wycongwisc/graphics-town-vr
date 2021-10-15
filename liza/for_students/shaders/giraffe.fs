/* a simple procedural texture: dots */

/* pass interpolated variables to from the vertex */
varying vec2 v_uv;

/* colors for the dots */
uniform vec3 light;
uniform vec3 dark;

/* number of dots over the UV range */
uniform float dots;

/* how big are the circles */
uniform float radius;

// @@Snippet:simple_lighting
varying vec3 v_normal;

// note that this is in VIEW COORDINATES
const vec3 lightDir = vec3(0,0,1);

void main()
{
    float x = v_uv.x * dots;
    float y = v_uv.y * dots;

    float xc = floor(x);
    float yc = floor(y);

    float dx = x-xc-.5;
    float dy = y-yc-.5;

    float d = sqrt(dx*dx + dy*dy);
    float dc = step(d,radius);

        // we need to renormalize the normal since it was interpolated
    vec3 nhat = normalize(v_normal);

    // deal with two sided lighting
    // light comes from above and below (use clamp rather than abs to get one sided)
    float amb_light = clamp(abs(dot(nhat, lightDir)), .4, 1.);

    // brighten the base color
    //gl_FragColor = vec4(light * baseColor,1);

        gl_FragColor = vec4(amb_light * mix(light,dark,dc), 1.);


}

