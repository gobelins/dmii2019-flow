/**
 * @constructor
 */



class Shape {

    /*
     * Shape constructor
     * */
    constructor( params, scene, sound, args) {
        this.id = params.id;
        this.args = args;
        this.controls = scene.controls != undefined ? scene.controls : false;
        this.camera = scene.camera;
        this.scene = scene.scene;
        this.mapMaterials = scene.mapMaterials;
        this.textMaterialName = scene.materialTextName;

        if(params.geometry) {
            this.typeGeometry = params.geometry[0];
            this.paramGeometry = [params.geometry[1],params.geometry[2],params.geometry[3]];
            this.materialName = params.material;
        }else{
            this.typeGeometry = false;
            this.paramGeometry = false;
        }

        this.color = params.color ? params.color : null;
        this.startPosition = params.startPosition;
        this.displayPosition = params.displayPosition;
        this.text = params.text;
        this.animationName = params.animationName;
        this.displayPosition = params.displayPosition;
        this.sound = sound;
        this.quantity= params.quantity;
        this.symetry = params.symetry;

        if(params.faces != undefined) {
            this.faces = params.faces;
        }else {
            this.faces = false;
        }

        this.geometry = null;
        this.material = null;
        this.shape = null;
        this.doubleGeometry = new THREE.Group();
        this.textShape = null;
        this.geometrySecond = null;
        this.rotation = params.rotation;
        this.clones = new THREE.Group();

        var those = this;
        var links = params.link;

        if(links =! undefined) {
            those.link = params.link;
        }else{
            those.link = false;
        }

        if(this.text && this.paramGeometry){
            this.rotationT = params.text ? params.doubleGeometry.rotation : 0;
            this.doubleGeometryParams = params.doubleGeometry;
        }
        
        this.draw();
    }


    /*
     * draw shape
     * return void
     * */
    draw() {
        var those = this;

       var createGeometry = require('three-bmfont-text');
        //creation de la geometry

        var isText = this.text;
        var textAndGeometry = isText && this.paramGeometry ? true : false;

        if(isText){
            those.geometry = createGeometry({
                align: those.text.align,
                font: those.args.json0.content,
                color: those.text.color,
                lineHeight: those.text.lineHeight
            })


            if(those.text.color[0] == 0) {
                those.geometrySecond = createGeometry({
                    align: those.text.align,
                    font: those.args.json0.content,
                    color: [255,255,255],
                    lineHeight: those.text.lineHeight
                })
            }else{
                those.geometrySecond = createGeometry({
                    align: those.text.align,
                    font: those.args.json0.content,
                    color: [0,0,0],
                    lineHeight: those.text.lineHeight
                })
            }

            those.geometry.update(those.text.word)
            those.geometrySecond.update(those.text.word)
            those.material = those.mapMaterials.get( those.textMaterialName );

            if(textAndGeometry){
                those.textShape = new THREE.Mesh( those.geometry, those.material );
                var paramsGeo = those.doubleGeometryParams;
                those.textShape.scale.set(paramsGeo.scaleText[0], paramsGeo.scaleText[1], paramsGeo.scaleText[2]);
                those.textShape.position.set(paramsGeo.positionText[0], paramsGeo.positionText[1], paramsGeo.positionText[2]);
                those.textShape.rotation.y = those.rotationT != undefined ? those.rotationT : 0
                those.doubleGeometry.add(those.textShape);

            }else{
                those.shape = new THREE.Mesh( those.geometry, those.material );
                those.shape.scale.set(0.08,-0.08,1)
            }
        }

        if(this.paramGeometry) {
            if(this.typeGeometry == "BoxGeometry") {
                those.geometry = new THREE.BoxGeometry( those.paramGeometry[0], those.paramGeometry[1], those.paramGeometry[2] );
            }
            if(this.typeGeometry == "CircleGeometry") {
                those.geometry = new THREE.CircleGeometry( those.paramGeometry[0], those.paramGeometry[1]);
            }

            those.material = those.mapMaterials.get( those.materialName );

            if(textAndGeometry){
                those.shape = new THREE.Mesh( those.geometry, those.material );
                those.shape.rotation.y = those.rotation != undefined ? those.rotation :  0;
                those.doubleGeometry.add(those.shape)
                those.doubleGeometry.name = those.id;
            }else{
                those.shape = new THREE.Mesh( those.geometry, those.material );
            }

            if(those.faces) {

                let c = 0xffffff
                let i = 0
                if(those.materialName == 'orelsanCubeColorsB' ){
                    c = 0x000000;
                }
                while( i < those.shape.geometry.faces.length ){
                    those.shape.geometry.faces[ i ].color.setHex( c );
                    those.shape.geometry.faces[ i ].vertexColors = new THREE.Color().setHex( c );
                    i++
                }

                those.shape.geometry.faces[ those.faces.face ].color.setHex( those.faces.color );
                those.shape.geometry.faces[ those.faces.face+1 ].color.setHex( those.faces.color );


                those.shape.geometry.faces[ those.faces.face ].vertexColors.setHex( those.faces.color );
                those.shape.geometry.faces[ those.faces.face+1 ].vertexColors.setHex( those.faces.color );
            }

            those.shape.geometry.colorsNeedUpdate = true;
        }

        if(textAndGeometry) {
            if(those.link) {
                those.shape.userData = those.link;
            }

            those.doubleGeometry.position.set(those.startPosition[0],those.startPosition[1],those.startPosition[2]);
            those.clones.add(those.doubleGeometry);
        }else{
            if(those.link) {
                those.shape.userData = those.link;
            }
            those.shape.material.transparent = true;
            those.shape.name = those.id;
            those.clones.add( those.shape );
            those.clones.position.set(those.startPosition[0],those.startPosition[1],those.startPosition[2]);
        }

        those.scene.add( those.clones );

       this.anime()
    }

    /*
     * anime shape
     * return void
     * */
    anime() {

        var those = this;
        var animationFrame;
        var i = 0;
        var o = 0;
        var p = 0;
        var t = 0;

        if(those.animationName == "orelsanS1") {
            var clone;
            var geometry;
            if(those.quantity) {

                those.quantity = parseInt(those.quantity)-1;

                for(var k=0; k < those.quantity; k++) {
                    t+=1;
                    if(p==0){
                        p=1;
                        geometry= those.geometrySecond;
                    } else {
                        p=0;
                        geometry= those.geometry;
                    }

                    clone = new THREE.Mesh( geometry, those.material );

                    if(those.symetry == "right"){
                      clone.position.x += t+.4;
                    }else{
                      clone.position.x -= t+.4;
                    }

                    clone.scale.set(0.08,-0.08,1)
                    clone.position.z += t*7.15;

                    this.clones.add(clone);
            }

                var animate = function () {
                    i+=.002 ;
                    animationFrame = requestAnimationFrame( animate );
                    those.clones.position.z -= i;

                    for(var t =0; t < those.clones.children.length; t++ ){
                        if(those.clones.position.z < -600) {
                            o += .02;
                            those.clones.children[t].material.opacity = 1 - o;

                            if (those.clones.children[t].material.opacity < 0){
                                those.destroy(those.scene);
                                cancelAnimationFrame( animationFrame );
                                i=0;
                                o=0;
                                animate = function () {
                                    return false;
                                }
                                return false;
                            }
                        }
                    }
                };

                animate();
            }else{
                console.error('Quantity empty on JSON file for object ', those.id)
            }
        }

        if(those.animationName == "orelsanS2") {
            this.camera.position.y = 3.21;
            this.camera.rotation.x = -0.19;
            var test2 = false;

            var test = function () {
                animationFrame = requestAnimationFrame( animate );
                if(those.doubleGeometry.name == "osnl28Toi") {

                    var tanimate = function () {
                        animationFrame = requestAnimationFrame(tanimate);

                        ///bouger le texte
                        those.doubleGeometry.traverse(function (node) {

                            if(node.geometry != undefined && node.geometry.visibleGlyphs != undefined && test2) {
                               node.scale.x = those.controls.xScaleElement;
                               node.scale.y = those.controls.yScaleElement;
                               node.scalez = those.controls.zScaleElement;

                               node.position.x = those.controls.xElement;
                               node.position.y = those.controls.yElement;
                               node.position.z = those.controls.zElement;

                               node.rotation.y =  those.controls.rotation;
                            }
                        })

                      //bouger lelement
                        // those.doubleGeometry.position.set(those.controls.xElement, those.controls.yElement, those.controls.zElement);
                    };

                    tanimate();
                }
            };

            var animate = function () {
                i+=.005;
                animationFrame = requestAnimationFrame( animate );

                if(those.doubleGeometry.position.y >= those.displayPosition[1]) {
                    those.doubleGeometry.position.y -= i;
                }else{
                    those.doubleGeometry.position.y = those.displayPosition[1];
                    cancelAnimationFrame( animationFrame );
                    i=0;
                    o=0;

                    if(those.controls) {
                         test()
                    }

                    animate = function () {
                        return false;
                    }

                    return false;
                }
            };

            animate();

        }

        if(those.animationName == "orelsanS3") {
            var clone;

            if(those.quantity) {

                for(var kt=0; kt < those.quantity; kt++) {
                    clone = new THREE.Mesh( those.geometry, those.material );
                    clone.scale.set(0.05,-0.05,0.05)
                    clone.position.set(those.startPosition[0],those.startPosition[1],those.startPosition[2]);
                    clone.position.z -= kt;
                    this.clones.add(clone);
                }

                var animate = function () {
                    i+=.001;
                    animationFrame = requestAnimationFrame( animate );

                    for(var t =0; t < those.clones.children.length; t++ ){
                        those.clones.children[t].material.opacity = those.sound.boost*0.01;
                    }

                };

                animate();
            }else{
                console.error('Quantity empty on JSON file for object ', those.id)
            }

        }
    }


    /*
     * destroy shape
     * return void
     * */
    destroy(scene) {
       scene.remove(this.clones)

       this.clones.traverse( function( node ) {
            if (node.geometry) {
               node.geometry.dispose()
            }
        });
    }


}

export default Shape;