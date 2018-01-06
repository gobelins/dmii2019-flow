experience_kerryjames.htmlimport Scene from '../../class/scene.js';
import * as THREE from 'three';
import { TweenLite } from 'gsap';
import $ from 'jquery';
window.THREE = THREE

if($('body').hasClass('isExpe')) {
    var artistName = "kerryjames"; //ici récupérer les données d'un autre fichier
    var orelsanTimer = 0;
    var color = "rgb(44, 0, 255)";
    var scene;
    scene = new Scene(artistName, color, orelsanTimer, false);
}


var lineBottom = document.querySelectorAll('.words-gobottom')
var lineTop    = document.querySelectorAll('.words-gotop')
var carousel = document.querySelectorAll('.dorica-words-list > li')
var currentLineTranslate = 0
var tweenBottom, tweenTop;

var tweenCarousel = TweenLite.to(carousel, 240, {
        x: '-20000',
        ease: Linear.ease
    })

function myFunction(e){

	e.preventDefault()

	var currentScroll = e.deltaY

	currentLineTranslate += currentScroll

	if(tweenBottom){
		tweenBottom.kill()
		tweenTop.kill()
	}

	tweenBottom = TweenLite.to(lineBottom, 1, {
		x: -currentLineTranslate * 0.4,
		y: currentLineTranslate * 0.18,
		ease: Linear.ease
	})

	tweenTop = TweenLite.to(lineTop, 1, {
		x: currentLineTranslate * 0.4,
		y: -currentLineTranslate * 0.18,
		ease: Linear.ease
	})
}

//smooth scroll anchors
$(document).ready(function() {
    $('.js-scrollTo').on('click', function() { // clic on element
        var page = $(this).attr('href'); // target
        var speed = 750; // anim duration in ms
        $('html, body').animate( { scrollTop: $(page).offset().top }, speed ); // Go
        return false;
    });
    $(".orelsan").hover(function() {
    	$("#home").css("background-color", "#2C00FF");
	},function(){
    	$("#home").css("background-color", "#000");
	});
    $(".francois").hover(function() {
    	$("#home").css("background-color", "#041440");
	},function(){
    	$("#home").css("background-color", "#000");
	});
	$(".fishbach").hover(function() {
    	$("#home").css("background-color", "#EF1C31");
	},function(){
    	$("#home").css("background-color", "#000");
	});
	$(".riles").hover(function() {
    	$("#home").css("background-color", "#F3A900");
	},function(){
    	$("#home").css("background-color", "#000");
	});
	$(".jeanne").hover(function() {
    	$("#home").css("background-color", "#FFCACA");
	},function(){
    	$("#home").css("background-color", "#000");
	});
	$(".mademoisellek").hover(function() {
    	$("#home").css("background-color", "#EED3C1");
	},function(){
    	$("#home").css("background-color", "#000");
	});
	$(".kery").hover(function() {
    	$("#home").css("background-color", "#4925ca");
	},function(){
    	$("#home").css("background-color", "#000");
	});
	$(".sanseverino").hover(function() {
    	$("#home").css("background-color", "#E17258");
	},function(){
    	$("#home").css("background-color", "#000");
	});
	$(".petitbiscuit").hover(function() {
    	$("#home").css("background-color", "#05C3DC");
	},function(){
    	$("#home").css("background-color", "#000");
	});
});
$(".instruction-menu").click(function(){
    $("#instruction").css("opacity", "1");
    $("#instruction").css("z-index", "10");
});

$(".words-line p").click(function(){
    $("#instruction").css("opacity", "1");
    $("#instruction").css("z-index", "10");
});

//resize function
window.addEventListener("resize", function(){
    var w = window.innerWidth
    var h = window.innerHeight
    scene.renderer.setSize(w, h)
    scene.camera.aspect = w / h
    scene.camera.updateProjectionMatrix()

    scene.setSize()
})

document.getElementById("home").addEventListener("wheel", myFunction);

// scene = new Scene(artistName, color, orelsanTimer);
