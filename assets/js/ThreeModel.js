(function(window, THREE){
    var camera, controls, scene, renderer;

    function diamondSquareHeight( side ) {
        // Average function
        this.avg = function () {
            var res = 0;
            for(var i=0;i<arguments.length;i++)
                res += arguments[i];
            return res / arguments.length;
        };

        // Average function considering past value
        this.avgH = function (current, center, past) {
            var res = (current * past) + center;
            return res / (past + 1);
        };

        // Mapping function
        this.toCoord = function (x,y) {
            return( y * side ) + x;
        };

        /**
        * Diamond square function
        * @param startCoords - {x:int, y:int}
        * @param step - {int}
        * @param arr - {array}
        */
        this.diamondSquare = function (startCoords, step, arr, variationScale) {
            var xMin = startCoords.x,
              yMin = startCoords.y,
              xMax = xMin + step,
              yMax = yMin + step,
              xCenter = xMin + ( step / 2 ),
              yCenter = yMin + ( step / 2 );

            var topleft     = arr [ this.toCoord(xMin,yMin) ],
                topright    = arr [ this.toCoord(xMax,yMin) ],
                bottomleft  = arr [ this.toCoord(xMin,yMax) ],
                bottomright = arr [ this.toCoord(xMax,yMax) ];

            // Set center coord, diamond step
            // todo: this is not considering superposition
            var variation = ( ( Math.random() * (1000) ) % variationScale ) - ( variationScale / 2 );
            var center = this.avg( topleft, topright, bottomleft, bottomright ) + variation;
            arr[ this.toCoord(xCenter,yCenter) ] = center;

            // Set perimeter coords, square step
            // Top, right , bottom and left
            arr[ this.toCoord(xCenter,yMin) ] = (arr[ this.toCoord(xCenter,yMin) ] === 0)? this.avg(topleft,topright,center): this.avgH(arr[ this.toCoord(xCenter,yMin) ],center,3);
            arr[ this.toCoord(xMax,yCenter) ] = (arr[ this.toCoord(xMax,yCenter) ] === 0)? this.avg(topright,bottomright,center): this.avgH(arr[ this.toCoord(xMax,yCenter) ],center,3);
            arr[ this.toCoord(xCenter,yMax) ] = (arr[ this.toCoord(xCenter,yMax) ] === 0)? this.avg(bottomleft,bottomright,center): this.avgH(arr[ this.toCoord(xCenter,yMax) ],center,3);
            arr[ this.toCoord(xMin,yCenter) ] = (arr[ this.toCoord(xMin,yCenter) ] === 0)? this.avg(bottomleft,topleft,center): this.avgH(arr[ this.toCoord(xMin,yCenter) ],center,3);
        };

        // First we have to create the array
        var size = side * side, data = new Float32Array( size );

        // Set all to zero
        for ( var j = 0; j < 4; j ++ ) {
            for ( var i = 0; i < size; i ++ ) {
                data[ i ] = 0;
            }
        }

        // Set start points
        var varScale = 100;
        var maxOffset = side-1;
        data[ this.toCoord(0,0) ]                 = ( ( Math.random() * 1000 ) % varScale ) - ( varScale / 2 );
        data[ this.toCoord(maxOffset,0) ]         = ( ( Math.random() * 1000 ) % varScale ) - ( varScale / 2 );
        data[ this.toCoord(0,maxOffset) ]         = ( ( Math.random() * 1000 ) % varScale ) - ( varScale / 2 );
        data[ this.toCoord(maxOffset,maxOffset) ] = ( ( Math.random() * 1000 ) % varScale ) - ( varScale / 2 );

        var step = maxOffset;
        var variation = 50;

        // At the end should be equal to 1
        while (step > 1) {
            for ( var j = 0; j < maxOffset; j += step ) {
                for ( var i = 0; i < maxOffset; i += step ) {
                    this.diamondSquare({x: i, y:j}, step, data, variation);
                }
            }

            step /= 2;
            variation *= Math.random();
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

        var worldWidth = 257, worldDepth = worldWidth;
        camera = new THREE.PerspectiveCamera( 60, canvasProperties.width / canvasProperties.height, 1, 20000 );

        scene = new THREE.Scene();

        camera.position.x = 0;
        camera.position.y = 50;
        camera.position.z = 50;

        controls = new THREE.OrbitControls( camera );

        this.axis = worldWidth;
        this.data = diamondSquareHeight( worldWidth );

        var geometry = new THREE.PlaneBufferGeometry( 100, 100, worldWidth - 1, worldDepth - 1 );
        geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

        var vertices = geometry.attributes.position.array;

        for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

            vertices[ j + 1 ] = this.data[i];

        }

        mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( {color: 0x423f81, specular: 0x423f81, shininess: 30, shading: THREE.FlatShading, side: THREE.DoubleSide, wireframe: false} ) );
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
            // todo: not getting point height
            var posY = this.data[ (posZ * this.axis) + posZ];
            var pin = new Pin;
            pin.name = id;
            pin.position.set(posX,posY,posZ);
            this.markersObject.add( pin );
        }
    };

    window.ThreeModel = ThreeModel;

})(window, THREE);