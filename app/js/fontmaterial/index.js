
import {
	RawShaderMaterial
} from 'three'

import {
    VERTEX_SHADER,
    FRAGMENT_SHADER
} from './shader.js'

import {
    FOG_VERTEX_SHADER,
    FOG_FRAGMENT_SHADER
} from './fogshader.js'


export default class FontMaterial extends RawShaderMaterial {

    constructor(opt = {}) {

    	var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
    	var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.001;
    	var precision = opt.precision || 'highp';
    	var color = opt.color || 0xffffff ;
    	var fog = opt.fog || false;

    	var map = opt.map;

        super({
		    uniforms: {
		      opacity: { type: 'f', value: opacity},
		      map: { type: 't', value: map },
		      color: { type: 'c', value: new THREE.Color(color) },
		      alphaTest: {type:'f', value: 0.001},
			  fogNear: {type:'f', value: 200},
			  fogFar: {type:'f', value: 50}
		    },
		    vertexShader: fog ? FOG_VERTEX_SHADER : VERTEX_SHADER,
		    fragmentShader: fog ?FOG_FRAGMENT_SHADER : FRAGMENT_SHADER
    	})

    	this.side = 2
    	this.fog  = fog
    	this.transparent = true
    } 


    set yPosAnim(val){

    	this.uniforms.yPosAnim.value = val
    }

    get yPosAnim(){

    	return this.uniforms.yPosAnim.value
    }

    set animScale(val) {

    	this.uniforms.animScale.value = val
    }

    get animScale() {

    	return this.uniforms.animScale.value
    }


    set alpha(val){

    	this.uniforms.opacity.value = val
    }

    get alpha() {

    	return this.uniforms.opacity.value
    }

    set animate(val) {

    	this.uniforms.animate.value = val
    }

    get animate() {

    	return this.uniforms.animate.value
    }

}

