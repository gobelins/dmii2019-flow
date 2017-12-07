/**
 * @constructor
 */

class History {

    /*
     * History constructor
     *
     * */
    constructor( ) {
        this.history = [];
    }

    /*
     * add artiste
     * return void
     * */
    add(artistName) {
        this.history.push(artistName);
    }

    /*
     * anime shape
     * return void
     * */
    toString() {
        //TODO retourne les éléments
    }
}

export default History;