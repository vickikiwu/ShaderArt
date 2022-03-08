// Author: Jeremy Rotsztain
// Edit: Weiqi Wu
// Title: Week3 Shader#1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// calculate a circle:
// 1.0 is inside of circle (true); 0.0 is outside of circle (false)

float drawCircle(vec2 st, vec2 pos, float _radius){
    float dist = distance(st, pos);
    // step shows values > argument 1, and we want the opposite
    // so we invert the results by subtraction 1.0 - the value
    // using the smoothstep function to create the bluring effect
    return 1.-smoothstep(_radius-(_radius*0.858),
                         _radius+(_radius*-0.142),
                         dot(dist,dist)*3.984); 
}

void main() {
    
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    // calculate layers as circles and set up the sizes and poisitions of the circle
    float layer1 = drawCircle( st, vec2(0.100,0.830), 1.372);
    float layer2 = drawCircle( st, vec2(0.470,0.390), 0.628);
    float layer3 = drawCircle( st, vec2(0.310,0.030), 0.524);
    float layer4 = drawCircle( st, vec2(1.000,0.390), 0.996);
    float layer5 = drawCircle( st, vec2(0.040,0.280), 0.668);
    float layer6 = drawCircle( st, vec2(0.750,0.880), 0.908);
    float layer7 = drawCircle( st, vec2(0.740,0.020), 0.548);
 
    
    // is is our fragment color
    vec3 color = vec3(1.);
  
	// draw 7 circles with gradient colours
    color = mix( color, vec3(1.088-st.x, st.y, st.y), layer1);
    color = mix( color, vec3(1.312-st.x, 0.968-st.y, st.y), layer2);
    color = mix( color, vec3(1.344-st.x, st.y, 1.072-st.y), layer3);
    color = mix( color, vec3(1.760-st.x, 0.768-st.y, st.y), layer4);
    color = mix( color, vec3(0.744-st.x, st.y, 2.272-st.y), layer5);
    color = mix( color, vec3(1.536-st.x, st.y, 1.528-st.y), layer6);
    color = mix( color, vec3(st.x, 0.848-st.y, 0.920-st.y), layer7);

    gl_FragColor = vec4(color,1.0);
}