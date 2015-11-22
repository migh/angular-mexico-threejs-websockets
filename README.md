# AngularJS Mexico - Three.js WebSockets

A demo on AngularJS, Three.js, WebSockets and device orientation API. It gets device orientation from a capable device
and displays a pin marker on a 3D space which rotates around its horizontal axis accordingly, updating the position
every 2 seconds.

Un demo de AngularJS, Three.js, WebSockets y device orientation API. Obtiene la orientación de un dispositivo y la
despliega en un espacio 3D mediante un pin que cambia sus ejes de acuerdo a los valores, actualizados cada dos
segundos.

It work with [Sails](http://sailsjs.org) as server. The following steps are needed to run it.
Funciona con [Sails](http://sailsjs.org) como servidor. Sigue las instrucciones para usarlo.

1. You have to clone the repository
   Necesitas clonar el repo
   
`git clone https://github.com/migh/angular-mexico-threejs-websockets.git
   
2. First you have to install node_modules and bower_components:
   Primero es necesario instalar node_modules y bower_components

```
    cd angular-mexico-threejs-websockets
    npm install
    cd assets
    bower install
```

3. On home directory run
   En el directorio base corre

```
    sails lift --verbose
```

4. Open localhost on port 1337 for main window
   Abre localhost en el puerto 1337 desde el navegador principal

```
    http://localhost:1337/
```
   
5. On device open /device path, with the same host and port
   En el dispositivo móvil abre /device, con el mismo puerto y navegador
   
```
    http://localhost:1337/device/
```
