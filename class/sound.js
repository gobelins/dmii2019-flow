/**
 * Dependecies :
 * --
 */


/**
 *
 * @constructor
 */
class Sound {

    /*
     * Constructor
     * @path String - path sound
     * */
    constructor(path) {
        this.path = path;
        this.boost = 0; //frequency
        this.source;
        this.context;
        this.sourceJs;
        this.analyser;
        this.timeStart;
        this.gainNode;
    }

    /*
     * start sound
     * @timeSart float
     * need initBoost() first
     * return void
     * */
    startSound(timeStart) {
        this.timeStart = timeStart;
        this.source.start(0,timeStart);

    }

    /*
     * pause sound
     * need initBoost() first
     * return void
     * */
    stopSound() {
        console.log(this.source)

        var those = this;


        function fade(){
            console.log('gain', those.gainNode.gain.value)
            if( those.gainNode.gain.value > 0){
                those.gainNode.gain.value -= 0.09;
                setTimeout(fade, 20);
            }else{
                those.source.stop();
               those.source.currentTime = 0;
            }
        }

        fade()


    }

    /*
     * get duration sound
     * return float
     * */
    getDuration() {
        //on renvoie ici la durée de la musique - peut être utile pour la création du timer ?
    }

    /*
     * pause sound
     * need initBoost() first
     * return void
     * */
    getCurrentPosition() {
        return this.context.currentTime + this.timeStart ;
    }


    /*
     * init boost sound (frequency) and start sound
     * return void
     * */
    initBoost(timeStart) {

        var array = new Array();
        var request;
        var those = this;

        request = new XMLHttpRequest();
        request.open("GET", this.path, true);
        request.responseType = "arraybuffer";


        request.onload = function () {

            try {
                if (typeof webkitAudioContext === 'function' || 'webkitAudioContext' in window) {
                    those.context = new webkitAudioContext();
                } else {
                    those.context = new AudioContext();
                }
            }
            catch (e) {
                console.log('Web Audio API is not supported in this browser');
            }

            those.context.decodeAudioData(
                request.response,
                function (buffer) {
                    if (!buffer) {
                        console.log('Error decoding file data');
                        return;
                    }

                    those.sourceJs = those.context.createScriptProcessor(2048, 1, 1);
                    those.sourceJs.buffer = buffer;
                    those.sourceJs.connect(those.context.destination);
                    those.analyser = those.context.createAnalyser();
                    those.analyser.smoothingTimeConstant = 0.6;
                    those.analyser.fftSize = 512;

                    those.source = those.context.createBufferSource();
                    those.source.buffer = buffer;
                    those.source.loop = true;

                    those.gainNode =  those.context.createGain();
                    those.gainNode.gain.value = 1;

                    those.source.connect(those.gainNode);
                    those.gainNode.connect(those.context.destination);
                    those.source.connect(those.analyser);
                    those.analyser.connect(those.sourceJs);
                    those.source.connect(those.context.destination);


                    those.sourceJs.onaudioprocess = function (e) {
                        array = new Uint8Array(those.analyser.frequencyBinCount);
                        those.analyser.getByteFrequencyData(array);
                        those.boost = 0;
                        for (var i = 0; i < array.length; i++) {
                            those.boost += array[i];
                        }
                        those.boost = those.boost / array.length;
                    };

                    those.startSound(timeStart)

                },
                function (error) {
                    console.log('Decoding error:' + error);
                }
            );
        };

        request.onerror = function () {
            console.log('buffer: XHR error');
        };

        request.send();
    }
}

export default Sound;