(function(window, THREE){
    var camera, controls, scene, renderer;

    function diamondSquareHeight( side ) {

        var size = side * side, data = new Float32Array( size );

        for ( var j = 0; j < 4; j ++ ) {
            for ( var i = 0; i < size; i ++ ) {
                data[ i ] = 0;
            }
        }
        return data;
    }

    var ThreeModel = function(){
    };

    ThreeModel.prototype = {
    };

    ThreeModel.prototype.init = function(canvasProperties){
        var mesh;

        var worldWidth = 129, worldDepth = 129;
        camera = new THREE.PerspectiveCamera( 60, canvasProperties.width / canvasProperties.height, 1, 20000 );

        scene = new THREE.Scene();

        controls = new THREE.OrbitControls( camera );

        data = diamondSquareHeight( worldWidth );

        camera.position.y = 510;

        var geometry = new THREE.PlaneBufferGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
        geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

        var vertices = geometry.attributes.position.array;

        for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

            vertices[ j + 1 ] = data[i];

        }

        mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {wireframe:true } ) );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer({canvas: canvasProperties.element});
        renderer.setPixelRatio( canvasProperties.width / canvasProperties.height );
        renderer.setSize( canvasProperties.width, canvasProperties.height );

        var animate = function () {
            window.requestAnimationFrame( animate );
            render();
        };

        var render = function () {
            renderer.render( scene, camera );
        };

        animate();
    };

    window.ThreeModel = ThreeModel;

})(window, THREE);