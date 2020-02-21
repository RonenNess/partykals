import{Color as t,Vector3 as e,ShaderMaterial as i,VertexColors as r,BufferGeometry as n,BufferAttribute as s,Points as o,NoBlending as a,AdditiveBlending as l,MultiplyBlending as h,NormalBlending as c}from"three";function p(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function u(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function d(t,e,i){return e&&u(t.prototype,e),i&&u(t,i),t}function f(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&m(t,e)}function y(t){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function m(t,e){return(m=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function v(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}var g=function(t,e){return Math.random()*(e-t)+t},z=function(t,e){return e?g(t,t+e):t},S=function(e,i){return i?new t(g(e.r,i.r),g(e.g,i.g),g(e.b,i.b)):e?e.clone():new t},C=function(t,i){return i?new e(g(t.x,i.x),g(t.y,i.y),g(t.z,i.z)):t?t.clone():new e},w=function(t,e,i){return t.clone().lerp(e,i)},_=function(t,e,i){return t*(1-i)+e*i},A=function(t){return(t.generate?t.generate():t)||0},P=Object.freeze({__proto__:null,getRandomBetween:g,getRandomWithSpread:z,getRandomColorBetween:S,getRandomVectorBetween:C,lerpColors:w,lerp:_,randomizerOrValue:A}),b=function(){function t(e){p(this,t),this.system=e,this.reset()}return d(t,[{key:"reset",value:function(){var t=this.system.options.particles;this.age=0,this.finished=!1,this.gravity=t.gravity,this.velocity=x(t.velocity),t.velocityBonus&&this.velocity.add(t.velocityBonus),this.acceleration=x(t.acceleration,!0),this.position=x(t.offset),this.ttl=z(t.ttl||1,t.ttlExtra)||1,this.alpha=this.startAlpha=this.endAlpha=null,this.startAlphaChangeAt=(t.startAlphaChangeAt||0)/this.ttl,t.fade&&(void 0!==t.alpha?this.alpha=A(t.alpha):(this.startAlpha=A(t.startAlpha),this.endAlpha=A(t.endAlpha))),this.colorize=Boolean(t.colorize),this.color=this.startColor=this.endColor=null,this.startColorChangeAt=(t.startColorChangeAt||0)/this.ttl,this.colorize&&(t.color?this.color=T(t.color):(this.startColor=T(t.startColor),this.endColor=T(t.endColor))),this.size=this.startSize=this.endSize=null,this.startSizeChangeAt=(t.startSizeChangeAt||0)/this.ttl,t.scaling&&(void 0!==t.size?this.size=A(t.size):(this.startSize=A(t.startSize),this.endSize=A(t.endSize))),this.rotation=this.rotationSpeed=null,t.rotating&&(this.rotation=A(t.rotation||0),this.rotationSpeed=A(t.rotationSpeed||0)),this.startWorldPosition=null,this.onUpdate=t.onUpdate,t.onSpawn&&t.onSpawn(this)}},{key:"update",value:function(t,e){if(!this.finished){0===this.age?(this.system.options.particles.worldPosition&&(this.startWorldPosition=this.system.getWorldPosition()),null===this.alpha&&null===this.startAlpha||this.system.setAlpha(t,this.alpha||this.startAlpha),null===this.color&&null===this.startColor||this.system.setColor(t,this.color||this.startColor),null===this.size&&null===this.startSize||this.system.setSize(t,this.size||this.startSize),null!==this.rotation&&this.system.setRotation(t,this.rotation)):(this.startColor&&this.age>=this.startColorChangeAt&&this.system.setColor(t,w(this.startColor,this.endColor,this.startColorChangeAt?(this.age-this.startColorChangeAt)/(1-this.startColorChangeAt):this.age)),null!=this.startAlpha&&this.age>=this.startAlphaChangeAt&&this.system.setAlpha(t,_(this.startAlpha,this.endAlpha,this.startAlphaChangeAt?(this.age-this.startAlphaChangeAt)/(1-this.startAlphaChangeAt):this.age)),null!=this.startSize&&this.age>=this.startSizeChangeAt&&this.system.setSize(t,_(this.startSize,this.endSize,this.startSizeChangeAt?(this.age-this.startSizeChangeAt)/(1-this.startSizeChangeAt):this.age))),this.gravity&&this.velocity&&(this.velocity.y+=this.gravity*e),this.rotationSpeed&&(this.rotation+=this.rotationSpeed*e,this.system.setRotation(t,this.rotation)),this.velocity&&(this.position.x+=this.velocity.x*e,this.position.y+=this.velocity.y*e,this.position.z+=this.velocity.z*e);var i=this.position;if(this.startWorldPosition){var r=this.system.getWorldPosition();r.sub(this.startWorldPosition),i=i.clone().sub(r)}this.system.setPosition(t,i),this.acceleration&&this.velocity&&(this.velocity.x+=this.acceleration.x*e,this.velocity.y+=this.acceleration.y*e,this.velocity.z+=this.acceleration.z*e),this.age+=e/this.ttl,this.onUpdate&&this.onUpdate(this),this.age>1&&(this.age=1,this.finished=!0)}}},{key:"worldPosition",get:function(){return this.system.getWorldPosition().add(this.position)}}]),t}();function x(t,i){return t?t.generate?t.generate():t.clone():i?null:new e}function T(e,i){return e?e.generate?e.generate():e.clone():i?null:new t(1,1,1)}var R=function(){function e(n){p(this,e),this.options=n;var s={globalColor:{value:new t(n.color||16777215)},rendererScale:{value:1}},o="";n.perspective&&(o+="#define PERSPECTIVE\n"),n.map&&(o+="#define TEXTURE\n",s.texture={value:n.map}),n.perParticleColor&&(o+="#define COLORING\n"),n.perParticleRotation&&(o+="#define ROTATION\n"),n.constSize&&(o+="#define CONST_SIZE\n",s.constSize={value:n.constSize}),n.alphaTest&&(o+="#define ALPHA_TEST\n"),o+="\n",this.material=new i({uniforms:s,vertexShader:o+"\n// attributes we get from geometry\nattribute float alpha;\n\n// per-particle size\n#ifdef CONST_SIZE\n    uniform float constSize;\n#else\n    attribute float size;\n#endif\n\n// per-particle rotation\n#ifdef ROTATION\n    attribute float rotation;\n#endif\n\n// system scale when using perspective mode\n#ifdef PERSPECTIVE\n    uniform float rendererScale;\n#endif\n\n// output params for fragment shader\nvarying float vAlpha;\n\n// set per-particle color\n#ifdef COLORING\n    varying vec3 vColor;\n#endif\n\n// get per-particle rotation\n#ifdef ROTATION\n    varying float vRotation;\n#endif\n\n// vertex shader main\nvoid main() \n{\n    // alpha and color\n    vAlpha = alpha;\n\n    // set color\n    #ifdef COLORING\n        vColor = color;\n    #endif\n\n    // set const size\n    #ifdef CONST_SIZE\n        float size = constSize;\n    #endif\n\n    // set position\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    gl_Position = projectionMatrix * mvPosition;\n\n    // apply rotation\n    #ifdef ROTATION\n        vRotation = rotation;\n    #endif\n    \n    // set size - either perspective or constant\n    #ifdef PERSPECTIVE\n        gl_PointSize = size * (rendererScale / length(mvPosition.xyz));\n    #else\n        gl_PointSize = size;\n    #endif\n}\n",fragmentShader:o+"\n// material uniforms\nuniform vec3 globalColor;\n\n// params we get from vertex shader\nvarying float vAlpha;\n\n// per-particle color from vertex shader\n#ifdef COLORING\n    varying vec3 vColor;\n#endif\n\n// per-particle rotation from vertex shader\n#ifdef ROTATION\n    varying float vRotation;\n#endif\n\n// diffuse texture\n#ifdef TEXTURE\n    uniform sampler2D texture;\n#endif\n\n// fragment shader main\nvoid main() \n{\n    // set default color if don't have per-particle colors\n    #ifndef COLORING\n        vec3 vColor = vec3(1,1,1);\n    #endif\n\n    // texture\n    #ifdef TEXTURE\n\n        // use rotation (rotate texture)\n        #ifdef ROTATION\n            float mid = 0.5;\n            vec2 rotated = vec2(cos(vRotation) * (gl_PointCoord.x - mid) + sin(vRotation) * (gl_PointCoord.y - mid) + mid,\n                          cos(vRotation) * (gl_PointCoord.y - mid) - sin(vRotation) * (gl_PointCoord.x - mid) + mid);\n            vec4 texture = texture2D(texture,  rotated);\n        // no rotation\n        #else\n            vec2 coords = vec2((gl_PointCoord.x - 0.5) + 0.5, (gl_PointCoord.y - 0.5) + 0.5);\n            vec4 texture = texture2D(texture, coords);\n        #endif\n\n        // get color with texture\n        gl_FragColor = vec4( globalColor * vColor, vAlpha ) * texture;\n        \n    // no texture (colors only)\n    #else\n        gl_FragColor = vec4( globalColor * vColor, vAlpha );\n    #endif\n\n    // check if need to discard pixel\n    #ifdef ALPHA_TEST\n        if (gl_FragColor.a < 0.00001) { discard; }\n    #endif\n}\n",transparent:Boolean(n.transparent),blending:n.blending,vertexColors:r,depthWrite:Boolean(n.depthWrite),depthTest:Boolean(n.depthTest)})}return d(e,[{key:"dispose",value:function(){this.material.dispose()}},{key:"setBaseScale",value:function(t){this.options.perspective&&(this.material.uniforms.rendererScale.value=t)}}]),e}(),O=function(){function i(e){p(this,i),e.particles=e.particles||{worldPosition:!0},e.system=e.system||{},this.options=e;var r=function(t){return null!=t},u=e.particles;if("number"==typeof e.particles.size&&(console.warn("Note: replaced 'size' with 'globalSize' property since its more efficient and provided size value was constant anyway."),e.particles.globalSize=e.particles.size,delete e.particles.size),e.particles.color instanceof t&&(console.warn("Note: replaced 'color' with 'globalColor' property since its more efficient and you provided color value was constant anyway."),e.particles.globalColor=e.particles.color,delete e.particles.color),e.particles.fade=r(u.startAlpha)||r(u.alpha),e.particles.rotating=r(u.rotationSpeed)||r(u.rotation),e.particles.colorize=r(u.color)||r(u.startColor),e.particles.scaling=r(u.size)||r(u.startSize),r(u.startAlpha)&&!r(u.endAlpha))throw new Error("When providing 'startAlpha' you must also provide 'endAlpha'!");if(r(u.startAlpha)&&r(u.alpha))throw new Error("When providing 'alpha' you can't also provide 'startAlpha'!");if(r(u.startColor)&&!r(u.endColor))throw new Error("When providing 'startColor' you must also provide 'endColor'!");if(r(u.startColor)&&r(u.color))throw new Error("When providing 'color' you can't also provide 'startColor'!");if(r(u.startSize)&&!r(u.endSize))throw new Error("When providing 'startSize' you must also provide 'endSize'!");if(r(u.startSize)&&r(u.size))throw new Error("When providing 'size' you can't also provide 'startSize'!");var d=e.system.particlesCount||10,f=e.particles.blending||"opaque",y={opaque:a,additive:l,multiply:h,blend:c}[f];if(this._emitters=[],e.system.emitters)if(e.system.emitters instanceof Array)for(var m=0;m<e.system.emitters.length;++m)this.addEmitter(e.system.emitters[m]);else this.addEmitter(e.system.emitters);var v="opaque"!==f;this.particlesGeometry=new n;var g=void 0===e.system.perspective||Boolean(e.system.perspective),z=new R({size:e.particles.size||10,color:e.particles.globalColor||16777215,blending:y,perspective:g,transparent:v,map:e.particles.texture,perParticleColor:Boolean(e.particles.colorize),alphaTest:"blend"===f&&r(e.particles.texture),constSize:r(e.particles.globalSize)?e.particles.globalSize:null,depthWrite:!r(e.system.depthWrite)||e.system.depthWrite,depthTest:!r(e.system.depthTest)||e.system.depthTest,perParticleRotation:e.particles.rotating});this.material=z,this.speed=e.system.speed||1,this.reset(),this._aliveParticles=[],this._deadParticles=[];for(var S=new Float32Array(3*d),C=e.particles.colorize?new Float32Array(3*d):null,w=e.particles.fade?new Float32Array(1*d):null,_=e.particles.scaling?new Float32Array(1*d):null,A=e.particles.rotating?new Float32Array(1*d):null,P=0;P<d;P++){var x=3*P;S[x]=S[x+1]=S[x+2]=0,C&&(C[x]=C[x+1]=C[x+2]=1),w&&(w[P]=1),_&&(_[P]=1),A&&(A[P]=0),this._deadParticles.push(new b(this))}this.particlesGeometry.setAttribute("position",new s(S,3)),w&&this.particlesGeometry.setAttribute("alpha",new s(w,1)),C&&this.particlesGeometry.setAttribute("color",new s(C,3)),_&&this.particlesGeometry.setAttribute("size",new s(_,1)),A&&this.particlesGeometry.setAttribute("rotation",new s(A,1)),this.particlesGeometry.setDrawRange(0,0),this.material.setBaseScale(e.system.scale||400);var T=new o(this.particlesGeometry,this.material.material);T.sortParticles=v,this.particleSystem=T,this._positionDirty=!0,this._colorsDirty=Boolean(C),this._alphaDirty=Boolean(w),this._rotateDirty=Boolean(A),e.container&&this.addTo(e.container)}return d(i,[{key:"addEmitter",value:function(t){this._emitters.push(t)}},{key:"dispose",value:function(){this.particlesGeometry.dispose(),this.material.dispose()}},{key:"reset",value:function(){this.ttl=this.options.system.ttl,this.age=0,this._timeToUpdateBS=0}},{key:"getWorldPosition",value:function(){var t=new e;return this.particleSystem.getWorldPosition(t),t}},{key:"addTo",value:function(t){t.add(this.particleSystem)}},{key:"setColor",value:function(t,e){t*=3;var i=this.particlesGeometry.attributes.color.array;i[t]=e.r,i[t+1]=e.g,i[t+2]=e.b,this._colorsDirty=!0}},{key:"setPosition",value:function(t,e){t*=3;var i=this.particlesGeometry.attributes.position.array;i[t]=e.x,i[t+1]=e.y,i[t+2]=e.z,this._positionDirty=!0}},{key:"setAlpha",value:function(t,e){this.particlesGeometry.attributes.alpha.array[t]=e,this._alphaDirty=!0}},{key:"setRotation",value:function(t,e){this.particlesGeometry.attributes.rotation.array[t]=e,this._rotateDirty=!0}},{key:"setSize",value:function(t,e){this.particlesGeometry.attributes.size.array[t]=e,this._sizeDirty=!0}},{key:"removeAndDisposeIfFinished",value:function(){return!!this.finished&&(this.removeSelf(),this.dispose(),!0)}},{key:"update",value:function(t){if(void 0===t){var e=(new Date).getTime()/1e3;t=e-this._lastTime||0,this._lastTime=e}if(0!==t){void 0!==this.ttl&&this.ttl>0&&(this.ttl-=t),t*=this.speed,this.dt=t,this.age+=t;var i=this._aliveParticles.length;if(!this.ttlExpired)for(var r=0;r<this._emitters.length;++r){var n=this._emitters[r].update(t,this);n&&this.spawnParticles(n)}for(r=this._aliveParticles.length-1;r>=0;--r){var s=this._aliveParticles[r];s.update(r,t),s.finished&&(this._aliveParticles.splice(r,1),this._deadParticles.push(s))}i!==this._aliveParticles.length&&this.particlesGeometry.setDrawRange(0,this._aliveParticles.length),this.particlesGeometry.attributes.position.needsUpdate=this._positionDirty,this._needBoundingSphereUpdate=this._needBoundingSphereUpdate||this._positionDirty,this._positionDirty=!1,this._colorsDirty&&(this.particlesGeometry.attributes.color.needsUpdate=!0,this._colorsDirty=!1),this._alphaDirty&&(this.particlesGeometry.attributes.alpha.needsUpdate=!0,this._alphaDirty=!1),this._sizeDirty&&(this.particlesGeometry.attributes.size.needsUpdate=!0,this._sizeDirty=!1),this._rotateDirty&&(this.particlesGeometry.attributes.rotation.needsUpdate=!0,this._rotateDirty=!1),this._needBoundingSphereUpdate&&(this._timeToUpdateBS-=t,this._timeToUpdateBS<=0&&(this._timeToUpdateBS=.2,this.particlesGeometry.computeBoundingSphere())),this.finished||this.options.system.onUpdate&&this.options.system.onUpdate(this)}}},{key:"spawnParticles",value:function(t){for(var e=0;e<t;++e){if(0===this._deadParticles.length)return;var i=this._deadParticles.pop();i.reset(),this._aliveParticles.push(i)}}},{key:"removeSelf",value:function(){this.particleSystem.parent&&this.particleSystem.parent.remove(this.particleSystem)}},{key:"finished",get:function(){return this.ttlExpired&&0===this.particlesCount}},{key:"ttlExpired",get:function(){return void 0!==this.ttl&&this.ttl<=0}},{key:"particlesCount",get:function(){return this._aliveParticles.length}},{key:"maxParticlesCount",get:function(){return this._aliveParticles.length+this._deadParticles.length}}]),i}(),E=function(){function t(e){p(this,t),this.options=e,e.interval=e.interval||1,this.age=0,this.timeToSpawn=Math.random()*A(e.interval)}return d(t,[{key:"update",value:function(t,e){var i=0;if(0===this.age&&this.options.onSpawnBurst&&(i+=A(this.options.onSpawnBurst)),this.age+=t,!this.options.onInterval)return i;(this.timeToSpawn-=t,this.timeToSpawn<=0&&(this.timeToSpawn=A(this.options.interval),i+=A(this.options.onInterval)),this.options.detoretingMinTtl&&e.ttl<this.options.detoretingMinTtl)&&(i*=e.ttl/this.options.detoretingMinTtl);return i}}]),t}(),k=function(){function t(){p(this,t)}return d(t,[{key:"generate",value:function(){throw new Error("Not implemented.")}}]),t}(),B=function(t){function i(t,r){var n;return p(this,i),(n=v(this,y(i).call(this))).min=t||new e(-1,-1,-1),n.max=r||new e(1,1,1),n}return f(i,k),d(i,[{key:"generate",value:function(){return C(this.min,this.max)}}]),i}();function D(){return 2*Math.random()-1}var G=function(t){function i(t,e,r,n,s){var o;return p(this,i),(o=v(this,y(i).call(this))).maxRadius=t||1,o.minRadius=e||0,o.scaler=r,o.minVector=n,o.maxVector=s,o}return f(i,k),d(i,[{key:"generate",value:function(){var t=new e(D(),D(),D());return(this.minVector||this.maxVector)&&t.clamp(this.minVector||new e(-1,-1,-1),this.maxVector||new e(1,1,1)),t.normalize().multiplyScalar(g(this.minRadius,this.maxRadius)),this.scaler&&t.multiply(this.scaler),t}}]),i}(),U=function(e){function i(e,r){var n;return p(this,i),(n=v(this,y(i).call(this))).min=e||new t(0,0,0),n.max=r||new t(1,1,1),n}return f(i,k),d(i,[{key:"generate",value:function(){return S(this.min,this.max)}}]),i}(),W=function(t){function e(t,i){var r;return p(this,e),(r=v(this,y(e).call(this))).min=t,r.max=i,r}return f(e,k),d(e,[{key:"generate",value:function(){return g(this.min,this.max)}}]),e}(),I=Object.freeze({__proto__:null,Randomizer:k,BoxRandomizer:B,SphereRandomizer:G,ColorsRandomizer:U,MinMaxRandomizer:W});export{E as Emitter,b as Particle,O as ParticlesSystem,I as Randomizers,P as Utils};