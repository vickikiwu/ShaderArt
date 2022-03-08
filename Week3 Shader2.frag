// Author: Jeremy Rotsztain
// Edit: Weiqi Wu (3175842)
// Title: Week3 Shader#2

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution; //canvas size (width, height)
uniform vec2 u_mouse; //mouse position in screen pixel
uniform float u_time; // time in second since load

vec2 createGrid( in vec2 st, in vec2 grid, out vec2 indices ){
    
    // multiply by the number of cells
    // [0,1] range => [0,10] (for example)
    st *= grid;
    
    // get the cell indices
    // for example, in a grid of 10x10:
    // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    indices = floor(st);
    
    // use fract to get the fractional amount of st
    // 9.5 => 0.5
    // shows the xy coordinate in each cell
    st = fract(st);

    return st;
}

//set up the rotate2D floating point vector
vec2 rotate2D (vec2 st, float _angle) {
    st -= 0.5;
    st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * st;
    st += 0.5;
    return st;
}

//set up the drawDots vector
vec3 drawDots(vec2 st, vec3 colorA, vec3 colorB ){
    
    st += 0.;
    st = fract(st);
    
    float circ = distance( st, vec2(0.5,0.5));
    circ = 1.0 - step( 0.352, circ);
    
    return mix( colorA, colorB, circ);
}


void main() {
    
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec2 st0 = st;
    
    // we create a grid by
    // 1. multiplying the canvas by a factor (greater than one)
    // 2. calculate the cell indices (rows, colums) by getting the floor of step 1.
    // 3. calculate the cell coordinates (again) by getting the fract of step 1.
    st *= vec2(5., 5.); // 1.
    vec2 index = floor(st); // 2.
    st = fract(st); // 3.
    
    // see the canvas' 2D coordinates repeated in each of the grid cells
    vec3 color = vec3( st,-0.016);
    
    if( true ){
        
        // skew the canvas a bit on the y axis
        st = st0;
        st.y += st.x* 0.;
        
        // do the drop step pattern:
        // shift every odd colum a half-step
        //add the rotation
        if( mod(index.x, 2.0)==0.){
            st.y += 0.100;
            st = rotate2D(st,PI*0.5);
        }
        
        //add the movement 
        if( mod(index.y, 2.0)==0.){
            st.x += u_time*0.1; 
        }

        // recalculate the grid 
        // after the drop pattern
        st = st * vec2(5., 5.); // 1.
        index = floor(st); // 2.
        st = fract(st); // 3.

        st.x -= 0.;
        color = drawDots(st, vec3(160.920,216.000,105.840)/255., vec3(183.000,146.676,171.445)/255.);
    }  
    
    gl_FragColor = vec4(color,1.0);
}





