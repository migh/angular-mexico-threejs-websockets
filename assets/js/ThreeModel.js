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

    var Pin = function(){
        var radius = 2;
        var height = 9;
        var pinColor = 0x3f8142;

        var group = new THREE.Object3D();
        var cylinderGeometry = new THREE.CylinderGeometry( radius, 0, height, 32 ).translate(0, (height/2), 0);
        var cylinderMaterial = new THREE.MeshPhongMaterial( { color: pinColor, specular: pinColor, shininess: 30, shading: THREE.FlatShading } );
        var cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
        group.add( cylinder );
        var sphereGeometry = new THREE.SphereGeometry( radius, 32, 32 ).translate(0, height, 0);
        var sphereMaterial = new THREE.MeshPhongMaterial( { color: pinColor, specular: pinColor, shininess: 30, shading: THREE.FlatShading } );
        var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
        group.add( sphere );

        return group;
    };

    var ThreeModel = function(){
        this.markers = {};
        this.markersObject = new THREE.Object3D();
    };

    ThreeModel.prototype = {
        markers: null,
        markersObject: null
    };

    ThreeModel.prototype.init = function(canvasProperties){
        var mesh;

        var worldWidth = 129, worldDepth = 129;
        camera = new THREE.PerspectiveCamera( 60, canvasProperties.width / canvasProperties.height, 1, 20000 );

        scene = new THREE.Scene();

        camera.position.x = 0;
        camera.position.y = 50;
        camera.position.z = 50;

        controls = new THREE.OrbitControls( camera );

        data = diamondSquareHeight( worldWidth );

        var geometry = new THREE.PlaneBufferGeometry( 100, 100, worldWidth - 1, worldDepth - 1 );
        geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

        var vertices = geometry.attributes.position.array;

        for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

            vertices[ j + 1 ] = data[i];

        }

        mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( {color: 0x423f81, specular: 0x423f81, shininess: 30, shading: THREE.FlatShading, side: THREE.DoubleSide} ) );
        scene.add( mesh );

        var light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set(1,1,1);
        scene.add( light );

        scene.add( this.markersObject );

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

    ThreeModel.prototype.setMarkerPosition = function(id,orientation){
        var i, exist, children = this.markersObject.children;

        // rot units are degrees and Euler are gradient
        var getEulerX = function(rotX){
            return (Math.PI/180)* rotX;
        };

        // rot units are degrees and Euler are gradient
        var getEulerZ = function(rotZ){
            return - (Math.PI/180)* rotZ;
        };

        for(i=0;i<children.length;i++){
            if (children[i].name === id){
                exist = children[i];
                break;
            }
        }

        if (exist) {
            exist.rotation.set(getEulerX(orientation.beta),0,getEulerZ(orientation.gamma),'XYZ')
        } else {
            var posX = (Math.random()*1000)%80 - 40, posZ = (Math.random()*1000)%80 - 40;
            var pin = new Pin;
            pin.name = id;
            pin.position.set(posX,0,posZ);
            this.markersObject.add( pin );
        }
    };

    window.ThreeModel = ThreeModel;

})(window, THREE);