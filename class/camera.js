/**
 * @constructor
 */

class Camera {

    /*
     * Shape constructor
     *
     * */
    constructor( paramsPath, timeStart ) {
        this.paramsPath = paramsPath;
        this.fov = paramsPath.fov;
        this.aspect = paramsPath.aspect;
        this.near = paramsPath.near;
        this.far= paramsPath.far;
        this.mapCamera;
        this.get(timeStart);
    }

    /*
   * récupérer la camera
   * return camera param : objet ;
   * */
    get() {
        var those = this;

        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.open("get", those.paramsPath, true);
        oReq.send();

        function reqListener(e) {
            those.params = JSON.parse(this.responseText);
            those.mapCamera = new Map(those.params.data);
        }
    }

    /*
     * get camera
     * return void
     * */
    read() {
        //TODO
    }

    /*
     * destroy shape
     * return void
     * */
    destroy() {
        //TODO
    }
}

export default Camera;