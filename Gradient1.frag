// Author: Weiqi Wu (3175842)
// Course: ShaderArt
// Title: #Gradients1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution; //canvas size (width, height)
uniform vec2 u_mouse; //mouse position in screen pixel
uniform float u_time; // time in second since load
    
void main() {
    
    // normalize our canvas
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    //Function from @patriciogv - 2015
	// http://patriciogonzalezvivo.com
    
    //calculating the radius and angles of each pixel
    vec2 pos = vec2(0.5)-st;
    //calculate the distance to the center
    float r = length(pos)*2.0;
    //set up the return angle of the arctangent
    float a = atan(pos.y,pos.x);
    
    /*Chaning the radius of a circle depending on the angle to achieve
    differnt shapes, which is shaping function */
    float f = cos(a*3.);
    
    //set up the blue and pink colors
    vec3 blue = vec3(0.601,0.867,0.960);
    vec3 pink = vec3(1.064,0.773,0.888);
    
    /*smmothstep()to performs smooth Hermite interpolation of the shaping function
    so that it has the angle and has the shape.And using it to mix the blue and 
    pink colors */
    vec3 color = mix(blue,pink,0.912-smoothstep(f,f+2.652,r));
    
    gl_FragColor = vec4(color, 1.0);
}
