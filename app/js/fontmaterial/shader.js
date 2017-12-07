export var VERTEX_SHADER = `
precision highp float;
precision highp int;
attribute vec2 uv;
attribute vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float animate; 


#ifdef USE_FOG
  varying float fogDepth;
#endif


varying vec2 vUv;
attribute vec3 color;
varying vec3 vColor;

void main() {

	vUv = uv;

	vColor = color;

    #ifdef USE_FOG
        vec4 mvPosition = modelViewMatrix * position;
        fogDepth = -mvPosition.z;
    #endif

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.zw);

}`


export var FRAGMENT_SHADER = `

#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
precision highp int;

#ifdef USE_FOG

	uniform vec3 fogColor;
	varying float fogDepth;

	#ifdef FOG_EXP2

		uniform float fogDensity;

	#else

		uniform float fogNear;
		uniform float fogFar;

	#endif

#endif


uniform float opacity;
uniform sampler2D map;
uniform float alphaTest;
varying vec2 vUv;
varying vec3 vColor;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {

  vec3 sample = 1.0 - texture2D(map, vUv).rgb;

  float sigDist = median(sample.r, sample.g, sample.b) - 0.5;

  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);

  if (alpha < alphaTest) discard;

  gl_FragColor = vec4(vColor, alpha * opacity);
  
  #ifdef USE_FOG

	#ifdef FOG_EXP2

		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * fogDepth * fogDepth * LOG2 ) );

	#else

		float fogFactor = smoothstep( fogNear, fogFar, fogDepth );

	#endif

	gl_FragColor.a = fogFactor;

#endif

}`;