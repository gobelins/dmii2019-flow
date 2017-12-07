/**
 *
 * @constructor
 */

import Sound from '../class/sound.js';
import Shape from '../class/shape.js';

import fetchLoader from 'fetch-loader';
import FontMaterial from '../app/js/fontmaterial';

import { TweenLite } from 'gsap'
class Scene {

    /*
     * Scene constructor
     *
     * @tabStructureUrl Array
     * @sound Sound
     * @timer int
     * return String
     * */
    constructor(artistName, color, timeStart, gui) {
        this.timeStart = timeStart;
        this.artistName = artistName;

        this.fetchLoaderManager = new fetchLoader()
        this.files = []
        this.mapShapes = null;
        this.shapes = null;
        this.sound = null;
        this.renderer = null;
        this.chrono = 0;
        this.shapesCreate = [];
        this.materials = [];
        this.mapMaterials;
        this.materialTextName;
        this.interval;
        this.video = null
        this.listShapePath = "app/data/"+artistName+"/shapes.json";
        this.soundPath =  "app/sound/"+artistName+".mp3";
        this.color = color;
        this.animationFrame;

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild( this.renderer.domElement );

        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 );
        this.camera.position.y = 7;

        this.controls;

        if(gui) {
            //DAT GUI ici
            this.FizzyText = function() {
                this.Fcamera = 0;
                this.Xcamera = 0;
                this.Ycamera = 3;
                this.rotateCamera = 0;
                this.xElement = -0.93;
                this.yElement = -0.07;
                this.zElement = -0.05;
                this.xScaleElement = 0.0022;
                this.yScaleElement = -0.0022;
                this.zScaleElement = 0.3;
                this.rotation = -0.4;
            };

            this.gui = gui;
            this.initGUI()
        }

        this.createMaterials();
        this.getShape();
        this.clickShapes();

    }

    initGUI() {
        this.controls = new this.FizzyText();
        this.gui = new dat.GUI();
        this.gui.add(this.controls, 'Fcamera', -10, 100);
        this.gui.add(this.controls, 'Xcamera', -3, 3);
        this.gui.add(this.controls, 'Ycamera', -3, 20);
        this.gui.add(this.controls, 'rotateCamera', -1.0, 1.0);
        this.gui.add(this.controls, 'xElement', -3.00, 3.00);
        this.gui.add(this.controls, 'yElement', -3.00, 5.00);
        this.gui.add(this.controls, 'zElement', -9.00, 3.00);
        this.gui.add(this.controls, 'xScaleElement', -0.005, 0.005);
        this.gui.add(this.controls, 'yScaleElement', -0.005, 0.005);
        this.gui.add(this.controls, 'zScaleElement', -3, 3);
        this.gui.add(this.controls, 'rotation', -1.0, 1.0);

    }

    createMaterials() {

        //ORELSAN TYPO
        var tLoader = new THREE.TextureLoader()
        var tex = tLoader.load('./app/img/sheet0.png');
        var material;
        var mapItem;

        material = new FontMaterial({
            map: tex,
            transparent: true,
            fog: true
        })

        mapItem = ["orelsanTypo", material];
        this.materials.push(mapItem);

        //ORELSAN FORM - cube plusieurs couleurs white
        var color = new THREE.Color( 0xffffff );

        material = new THREE.MeshBasicMaterial( { "vertexColors": THREE.FaceColors } );
        mapItem = ["orelsanCubeColorsW", material];

        this.materials.push(mapItem);
        this.mapMaterials = new Map(this.materials);

        //ORELSAN FORM - cube plusieurs couleurs white
        color = new THREE.Color( 0x000000 );

        //material = new THREE.MeshBasicMaterial( { "color" : color, "vertexColors": THREE.FaceColors } );
        mapItem = ["orelsanCubeColorsB", material];

        this.materials.push(mapItem);
        this.mapMaterials = new Map(this.materials);

        //ORELSAN bck

        color = new THREE.Color( 0x0603a5 );

        material = new THREE.MeshBasicMaterial( { "color" : color } );
        mapItem = ["orelsanBkg", material];

        this.materials.push(mapItem);
        this.mapMaterials = new Map(this.materials);
    }


    /*
     * get data shape
     * return tabStructure Array
     * */
    getShape() {
        var those = this;

        var oReq = new XMLHttpRequest();
        oReq.onload = this.reqListener.bind(this);
        oReq.open("get", those.listShapePath, true);
        oReq.send();
    }

    reqListener(args) {
        this.shapes = JSON.parse(args.currentTarget.responseText);

        var dataFiles = this.shapes.files;

        this.files.push( dataFiles.sheet )
        this.files.push( dataFiles.jsonFont )

        this.materialTextName = dataFiles.textMaterialName;

        this.mapShapes = new Map(this.shapes.data);

        this.fetchLoaderManager.on('complete',  this.draw.bind(this))
        this.fetchLoaderManager.load(this.files)
    }

    /*
     * read tab for add / delete shape
     * return void
     * */
    readShapes(time, args) {

        var those = this;
        var stringTime =''+time;

        var shapes = this.mapShapes.get(stringTime);
        var shapesLink;
        var shapeNoLink;
        var shapeDestroy;

        if(shapes != undefined) {
            shapesLink = shapes[0].shapesLink;
            shapeNoLink = shapes[1].shapesNoLink;
            shapeDestroy = shapes[2].shapesDestroy;

            if(shapesLink != null) {
                for(var i=0; i < shapesLink.length; i++) {
                    those.shapesCreate.push(new Shape(shapesLink[i], those, those.sound, args));
                }
            }

            if(shapeNoLink != null) {
                for(var j=0; j < shapeNoLink.length; j++) {
                    those.shapesCreate.push(new Shape(shapeNoLink[j], those, those.sound, args));
                }
            }

            if(shapeDestroy != null) {
                for(var k=0; k < shapeDestroy.length; k++) {
                    those.destroyShape(shapeDestroy[k])
                }
            }
        }
    }

    /*
     * destroy shapes
     * return void
    **/
    destroyShape(shapeInfo) {

        var those = this;

        this.shapesCreate.forEach(function(element) {
            if(element.id == shapeInfo.id) {
                element.destroy(those.scene)
                var index = those.shapesCreate.indexOf(element);
                those.shapesCreate.splice(index, 1);
            }
        });
    }

    /*
     * click on shapes
     * return void
    **/
    clickShapes() {
        console.log("init click shape")

        var those = this;
        var raycaster;
        var mouse;

        mouse = new THREE.Vector2();
        raycaster = new THREE.Raycaster();

        document.addEventListener( 'mousedown', onDocumentMouseDown, false );

        function onDocumentMouseDown( event ) {
            event.preventDefault();

            mouse.x = ( event.clientX / those.renderer.domElement.clientWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / those.renderer.domElement.clientHeight ) * 2 + 1;
            raycaster.setFromCamera( mouse, those.camera );

            var intersects = raycaster.intersectObjects(  those.scene.children, true );


            if ( intersects.length > 0 ) {
               if( intersects[ 0 ].object.userData.length > 0) {
                   those.changeScene(intersects[ 0 ].object.userData)
                }
            }
        }
    }

    roundHalf(num) {
        return Math.round(num*2)/2;
    }

    /*
     * draw scene and sart sound
     * return void
     * */
    draw(args) {

        var those = this;

        //creation de la scene
        those.scene.background = new THREE.Color( those.color );
        those.renderer.render(those.scene, those.camera);


        //lancement du son
        this.sound = new Sound(this.soundPath);
        this.sound.initBoost(this.timeStart);

        //lancement du chrono qui lance les changements toutes les secondes
        those.interval = setInterval(function(){
            those.chrono = those.roundHalf(those.sound.getCurrentPosition());
            those.readShapes(those.chrono, args);
        }, 500);

        //lancement du background

/**
        if(those.artistName == "orelsan") {

            var geometryBck = new THREE.PlaneGeometry(5,2,8);
            var geometryBck2 = new THREE.PlaneGeometry(2,5,8);

            var material = those.mapMaterials.get('orelsanBkg');
            var mesh;
            var x; var y;
            var test;
            for(var k=0; k<50; k++) {

                test =Math.round(Math.random());

                if(test){
                    mesh = new THREE.Mesh( geometryBck, material );
                }else{
                    mesh = new THREE.Mesh( geometryBck2, material );
                }

                x =  Math.random() * (150 - (-150)) - 150;
                y = Math.random() * (300 - (-300)) - 300;

                mesh.position.set(x,y,-200)
                those.bckElement.add(mesh)
            }

            those.scene.add(those.bckElement);
        }

**/
        var animate = function () {
            those.animationFrame = requestAnimationFrame( animate );

            if(those.gui){
                those.camera.position.z = those.controls.Fcamera;
                those.camera.position.x = those.controls.Xcamera;

                //DATGUICONTROLCAMERA
                //those.camera.position.y = those.controls.Ycamera;
                //those.camera.rotation.x = those.controls.rotateCamera;
            }

/**
            if(those.artistName == "orelsan") {
                those.bckElement.traverse(function (node) {

                    if(node.material) {
                       node.position.z -=  those.sound.boost * 0.06;
                        node.scale.z = 1 - those.sound.boost * 0.1;
                    }
                })
            }
**/

            those.renderer.render(those.scene, those.camera);
        };

        animate();

    }


    /*
  * change scene
  * return void
      * */
    changeScene(datas) {

        var those = this;
        clearInterval(those.interval);
        this.animationFadeOut(datas);
    }

    destroyScene(datas) {

        var those = this;

        /*
        while(those.scene.children.length > 0){
            those.scene.remove(those.scene.children[0]);
        }


        cancelAnimationFrame( those.animationFrame );
        those.renderer.render(those.scene, those.camera);

        those.timeStart = datas[0]; those.artistName = datas[2];

        those.mapShapes = null; those.shapes = null;
        those.sound = null; those.chrono = 0;
        those.shapesCreate = []; those.interval = null;

        those.listShapePath = "app/data/" + datas[2] + "/shapes.json";
        those.listCameraPath = "app/data/" + datas[2] + "/camera.js";
        those.listAnimationPath = "app/data/" + datas[2] + "/animations.js";
        those.soundPath = "app/sound/" + datas[2] + ".mp3";
        those.color = datas[1];
         */

        those.sound.stopSound();


        //those.getShape();
        var next = [
            {
                "src" : "app/video/racailles.mp4",
                "name" : "Kery James",
                "artist" : "Racailles",
                "id" : "m1"
            },
            {
                "src" : "app/video/francois.mp4",
                "name" : "François & the Atlas Mountains",
                "artist" : "Le grand dérèglement",
                "id" : "m2"
            },
            {
                "src" : "app/video/jeanne.mp4",
                "name" : "Jeanne Cherhal",
                "artist" : "Voilà",
                "id" : "m3"
            }
        ]
        this.nbVideo = 0;
        those.loadVideo('app/video/fishbach.mp4',"fishback","mortel", false, next, "m0")
    }


    loadVideo(src, name, artist, lastArtist, next, id) {
        var those = this;

        $('body').prepend(
            '<video class="video" id="'+id+'"> ' +
            '<source src="'+src+'" > ' +
            '</video>')

        var video = $('body').find('#'+id)[0]
        video.addEventListener('canplay', ()=>{
            those.video = video
            those.setSize()
        })


        setTimeout(function(){

            if(lastArtist){
                $('body').find('#'+lastArtist).addClass("invisible");

                setTimeout(function(){
                    $('body').find('#'+lastArtist).remove()
                }, 500);
            }

            if(!lastArtist) {
                $('canvas').addClass('invisible')

                setTimeout(function(){
                    $('canvas').remove();
                }, 500);
            }
            
            $('body').find('#'+id)[0].play()

            //fishback
            $('.info-artist .name').html(name)
            $('.info-artist .artist').html(artist)

            $('.video').remove('click');
            $('.video').on('click', function(){
                those.loadVideo(next[those.nbVideo].src,next[those.nbVideo].name,next[those.nbVideo].artist,id, next,next[those.nbVideo].id)
                those.nbVideo += 1;
            })

        }, 100);
    }

    setSize(){
        if(this.video == null){
            return
        }

        let video = this.video;

        let factor = this.resizeIn(video.videoWidth,video.videoHeight,window.innerWidth ,  window.innerHeight);

        let displayWitdh = factor * video.videoWidth;
        let displayheight = factor * video.videoHeight;

        let gapX = (displayWitdh - window.innerWidth ) / 2;
        let gapY = (displayheight - window.innerHeight ) / 2;

        let width =  Math.ceil(video.videoWidth * factor);
        let height =  Math.ceil(width / (video.videoWidth / video.videoHeight));

        video.style.width = width + 'px';
        video.style.height = height + 'px';

        TweenLite.set(video, {x: -gapX, y: -gapY});
    }

    resizeIn(w, h, wMin, hMin) {

        let scale = undefined;
        if (w < h) {
            scale = wMin / w;
            if ((h * scale) < hMin) { scale = hMin / h; }
            // (h <= w)
        } else {
            scale = hMin / h;
            if ((w * scale) < wMin) { scale = wMin / w; }
        }
        return scale;
    }

    animationFadeOut(datas) {

        var those = this;
        var animationFrame;
        var i = 0;
        var num = those.scene.children.length - 1;
        var p = 0;

       var animate = function () {
            animationFrame = requestAnimationFrame( animate );
            i+=.1;

            if(p==num || !those.scene.children[p] ) {
                p=0;
                i=0;
                num=0;
                those.destroyScene(datas);
                cancelAnimationFrame( animationFrame );
                return false;
            }

           if( those.scene.children[p] ) {
               those.scene.children[p].traverse( function( node ) {
                   if (node.material) {
                       if (parseInt(node.material.opacity) < 0) {
                           p++
                           i = 0;
                       } else {
                           node.material.opacity = 1 - i;
                       }
                   }
               });
           }
        };

        animate();
    }
}

export default Scene;
