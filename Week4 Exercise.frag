// Author: Jeremy Rotsztain
// Edit: Weiqi Wu (3175842)
// Title: Week4 Exercise

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution; //canvas size (width, height)
uniform vec2 u_mouse; //mouse position in screen pixel
uniform float u_time; // time in second since load

// map()
// remap values from one range to another
// just like in Processing or p5.js
// by Rick Companje

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// rgb_normalize()
vec3 rgb_normalize( int r, int g, int b){
    return vec3(float(r)/255., float(g)/255., float(b)/255.);
}

// convert from RGB to HSB space
vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

// convert from HSB to RGB space
vec3 hsb2rgb( in vec3 c )
{
	vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	return c.z * mix( vec3(1.0), rgb, c.y);
}

// calculateHueLerp()
// select a color from a collection of 6 based on a percentage
// interpolate between colors
// returns a RGB color
vec3 calculateHueLerp(vec3 colors[12], float pct){

    pct = mod( pct, 1.0);
    float stepSize = 0.0833;
    
    vec3 result = colors[0];
    
    if( pct < 0.0833 ){

        pct = map( pct, 0.0, 0.0833, 0.0, 1.0);
        result = mix( colors[0], colors[1], pct);

    } else if( pct < 0.1666){

        pct = map( pct, 0.0833, 0.1666, 0.0, 1.0);
        result = mix( colors[1], colors[2], pct);

    } else if( pct < 0.2499){

        pct = map( pct, 0.1666, 0.2499, 0.0, 1.0);
        result = mix( colors[2], colors[3], pct);

    } else if( pct < 0.3332){

        pct = map( pct, 0.2499, 0.3332, 0.0, 1.0);
        result = mix( colors[3], colors[4], pct);

    } else if( pct < 0.4165){

        pct = map( pct, 0.3332, 0.4165, 0.0, 1.0);
        result = mix( colors[4], colors[5], pct);
        
    } else if( pct < 0.4998){
        
        pct = map( pct, 0.4165, 0.4998, 0.0, 1.0);
        result = mix( colors[5], colors[6], pct);
        
    } else if( pct < 0.5831){
        
        pct = map( pct, 0.4998, 0.5831, 0.0, 1.0);
        result = mix( colors[6], colors[7], pct);
        
    } else if( pct < 0.6664){
        
        pct = map( pct, 0.5831, 0.6664, 0.0, 1.0);
        result = mix( colors[7], colors[8], pct);
        
    } else if( pct < 0.7497){
        
        pct = map( pct, 0.6664, 0.7497, 0.0, 1.0);
        result = mix( colors[8], colors[9], pct);
        
    } else if( pct < 0.833){
        
        pct = map( pct, 0.7497, 0.833, 0.0, 1.0);
        result = mix( colors[9], colors[10], pct);
        
    } else if( pct < 0.9163){

        pct = map( pct, 0.833, 0.9163, 0.0, 1.0);
        result = mix( colors[10], colors[11], pct);
        
    } else {

        pct = map( pct, 0.9163, 1.0, 0.0, 1.0);
        result = mix( colors[11], colors[0], pct);
    }

    return result;
}

void main (void) {

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 st0 = st;

    // R-O-Y-G-B-V
    // colors selected manually in photoshop
    vec3 colors[12];
    colors[0] = rgb_normalize(209, 58, 47); // red
    colors[1] = rgb_normalize(180, 38, 123); // red-purple
    colors[2] = rgb_normalize(102, 60, 135); // violet
    colors[3] = rgb_normalize(70, 78, 148); // violet-blue
    colors[4] = rgb_normalize(63, 111, 171); // blue
    colors[5] = rgb_normalize(67, 148, 183); // blue-green
    colors[6] = rgb_normalize(62, 140, 95); // green
    colors[7] = rgb_normalize(150, 186,	68); // green-yellow
    colors[8] = rgb_normalize(241, 229, 76); // yellow
    colors[9] = rgb_normalize(244, 200,	70); // yellow-orange
    colors[10] = rgb_normalize(227,	147, 60); // orange
    colors[11] = rgb_normalize(218,	106, 53); // orange-red
    
    vec3 color = vec3(0);

    // divide the canvas into 6 sections
    // invert the order for legibility
    float column = st.x;
    column = floor( column * 6.);

    if( column == 0.0){

      // first column: blend between purple & yellow (steps)
    	vec3 yellow = calculateHueLerp(colors, 0.6664); 
    	vec3 purple = calculateHueLerp(colors, 0.1666); 
        
    	float lerp = floor(st.y*6.)/4.;
        
    	color = mix( purple, yellow, lerp);
        
    } else if( column == 1.0 ){
        
    	// second column: blend between violet-blue & yellow-orange (steps)
    	vec3 yellowOrange = calculateHueLerp(colors, 0.7497); 
    	vec3 violetBlue = calculateHueLerp(colors, 0.2499); 
        
    	float lerp = floor(st.y*6.)/4.;
        
    	color = mix( violetBlue, yellowOrange, lerp);
        

    } else if( column == 2. ){

    // third column: blend between orange & blue (steps)
    	vec3 orange = calculateHueLerp(colors, 0.833); 
    	vec3 blue = calculateHueLerp(colors, 0.3332); 
        
    	float lerp = floor(st.y*6.)/4.;
        
    	color = mix( blue, orange, lerp);
        
    } else if (column ==3.){
        
    // fourth column: blend between red-orange & blue-green (steps)
    	vec3 redOrange = calculateHueLerp(colors, 0.9163); 
    	vec3 blueGreen = calculateHueLerp(colors, 0.4165); 
        
    	float lerp = floor(st.y*6.)/4.;
        
    	color = mix( blueGreen, redOrange, lerp);
        
    } else if (column ==4.){
        
    // first column: blend between red & green (steps)
    	vec3 red = calculateHueLerp(colors, 0.); 
    	vec3 green = calculateHueLerp(colors, 0.4998); 
        
    	float lerp = floor(st.y*6.)/4.;
        
    	color = mix( green, red, lerp);
        
    } else if (column ==5.){
        
    // first column: blend between red-violet & yellow-green (steps)
    	vec3 redViolet = calculateHueLerp(colors, 0.083); 
    	vec3 yellowGreen = calculateHueLerp(colors, 0.5831); 
        
    	float lerp = floor(st.y*6.)/4.;
        
    	color = mix( yellowGreen, redViolet, lerp);
        
    } 

    gl_FragColor = vec4(color,1.0);
}



