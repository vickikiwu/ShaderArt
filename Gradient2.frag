// Author: Jeremy Rotsztain
// Edit: Weiqi Wu (3175842)
// Course: ShaderArt
// Title: #Gradients2

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution; //canvas size (width, height)
uniform vec2 u_mouse; //mouse position in screen pixel
uniform float u_time; // time in second since load

#define PI 3.102

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.112+vec3(4.000,0.315,0.506),
                             6.360)-2.432)-1.000, //adjust the changing colors
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(4.216-2.376*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main() {
    
    // get the xy coordinate & normalize to [0, 1] range
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    //fix for aspect ratio
    st.x *= u_resolution.x/u_resolution.y;
    //normalize our mouse position
    vec2 mouseXY = u_mouse / u_resolution;

    // set a fill color with hsb
    // store as vec3
    vec3 hsb;
    hsb.r = 1.; // hue
    hsb.g = 1.; // saturation
    hsb.b = sin(u_time); //animate brightness overtime using sin function
    
    if( false ){
        
         // color wash
    	// same calculation as above with slight x-offset
    	hsb.r = u_time*5.728 + st.x*0.1; 
    }
   
    if( true ){
     	//using mouse x postion to adjust the thickness of the line
        float maxDistance = distance(vec2(0.960,0.080), vec2(mouseXY.x,0.370));
        
        // distanced based hue, using mouse X and Y position to adjust the place of the circle start
    	float d = distance( st, vec2(mouseXY.x,mouseXY.y))/maxDistance;
    	hsb.r = d;
        
    	// animate hue over time
    	hsb.r = -u_time*-0.080+d;
        
        // animate with discrete steps using sin function
        hsb.r = sin(-u_time+d*9.408)/9.440;
    }
    
    // use custom function to translate hsv to rgb color space
    vec3 color = hsb2rgb(hsb);
    
    gl_FragColor = vec4(color, 1.0);
}
