  'use strict';

  // Global variables that are set and used
  // across the application
  let gl;
  var myCube = null;
  var myCylinder = null;
  var myCone = null;
  var mySphere = null;

  // GLSL programs
  let drawProgram;
  
  // VAOs for the objects

  // textures
  let modelTexture;
  let woodTexture;
  let steelTexture;


  // rotation

  var anglesReset = [30.0, 30.0, 0.0];
  var cube_angles = [30.0, 30.0, 0.0];
  var sphere_angles = [180.0, 180.0, 0.0];
  var angles = sphere_angles;
  var angleInc = 5.0;
 
//
// create shapes and VAOs for objects.
// Note that you will need to bindVAO separately for each object / program based
// upon the vertex attributes found in each program
//
function createShapes() {
  myCube = new Cube(5);
  myCube.VAO = bindVAO(myCube, drawProgram);
  myCylinder = new Cylinder (50, 50);
  myCylinder.VAO = bindVAO(myCylinder, drawProgram);
  myCone = new Cone (50, 50);
  myCone.VAO = bindVAO(myCone, drawProgram);
  mySphere = new Sphere (50, 50);
  mySphere.VAO = bindVAO(mySphere, drawProgram);

}


//
// Here you set up your camera position, orientation, and projection
// Remember that your projection and view matrices are sent to the vertex shader
// as uniforms, using whatever name you supply in the shaders
//
function setUpCamera(program) {
    
    gl.useProgram (program);

   //   set up your projection
  //   defualt is orthographic projection
  let projMatrix = glMatrix.mat4.create(); 
  //glMatrix.mat4.ortho(projMatrix,-5,5,-5,5,1.0,300.0)
  glMatrix.mat4.perspective(projMatrix,radians(70),1,0,null);     
  gl.uniformMatrix4fv (program.uProjT, false, projMatrix);  
  // set up your view
  // defaut is at (0,0,-5) looking at the origin
  let viewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.lookAt(viewMatrix, [0,0, -8], [0,0, 0], [0, 1, 0]);
  gl.uniformMatrix4fv (program.uViewT, false, viewMatrix);
    
    // set up your projection
    
    // set up your view

}


//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//


function setUpTextures(){
    
  // get some texture space from the gpu
  modelTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, modelTexture);
  
  // load the actual image
  const worldImage = document.getElementById("world-texture");
  worldImage.src = 'ball.jpg';

  worldImage.onload = () => {
      doLoad (modelTexture, worldImage);
  };

  woodTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, woodTexture);

  const woodImage = document.getElementById("wood-texture");
  woodImage.src = 'wood.jpg';

  woodImage.onload = () => {
      doLoad (woodTexture, woodImage);
  };

  steelTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, steelTexture);

  const steelImage = document.getElementById("steel-texture");
  steelImage.src = 'steel.jpg';

  steelImage.onload = () => {
      doLoad (steelTexture, steelImage);
  };

  // marbTexture = gl.createTexture();
  // const marbImage = document.getElementById("marb-texture");
  // marbImage.src = 'marble.jpg';
  // marbImage.onload = () => {
  //     doLoad (marbTexture,marbImage);
  // };
  
}

function doLoad(theTexture, theImage) {
  gl.bindTexture(gl.TEXTURE_2D, theTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, theImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_2D, null);

  draw();
}


//
//  This function draws all of the shapes required for your scene
//
function drawShapes(program) {

  gl.useProgram(program);

  // base
  let cylinderMatrix = glMatrix.mat4.create();
  glMatrix.mat4.translate(cylinderMatrix, cylinderMatrix, [-0.45, 0.45, 0]);
  glMatrix.mat4.scale(cylinderMatrix, cylinderMatrix, [0.65, 0.05, 1]);
 
  //gl.uniformMatrix4fv(program.aVertexPosition, false, cylinderMatrix);
  gl.uniform1i(program.uTextureValue,1);
  
  gl.uniform3fv (program.uTheta, new Float32Array(angles));
  gl.activeTexture (gl.TEXTURE0);
  gl.bindTexture (gl.TEXTURE_2D, steelTexture);
  // gl.uniform1i (program.uAbstractTexture, 1);
  gl.uniformMatrix4fv(program.uModelT, false, cylinderMatrix);

  gl.bindVertexArray(myCylinder.VAO);
  gl.drawElements(gl.TRIANGLES, myCylinder.indices.length, gl.UNSIGNED_SHORT, 0);
  console.log("cylinder: ", myCylinder);

  // second base
  cylinderMatrix = glMatrix.mat4.create();
  glMatrix.mat4.translate(cylinderMatrix, cylinderMatrix, [-0.45, 0.40, 0]);
  glMatrix.mat4.scale(cylinderMatrix, cylinderMatrix, [0.15, 0.15, 1]);
 
  //gl.uniformMatrix4fv(program.aVertexPosition, false, cylinderMatrix);
  gl.uniform1i(program.uTextureValue,1);
  
  gl.uniform3fv (program.uTheta, new Float32Array(angles));
  gl.activeTexture (gl.TEXTURE0);
  gl.bindTexture (gl.TEXTURE_2D, steelTexture);
  gl.uniformMatrix4fv(program.uModelT, false, cylinderMatrix);

  gl.bindVertexArray(myCylinder.VAO);
  gl.drawElements(gl.TRIANGLES, myCylinder.indices.length, gl.UNSIGNED_SHORT, 0);
  console.log("cylinder: ", myCylinder);

  // base rod
  cylinderMatrix = glMatrix.mat4.create();
  glMatrix.mat4.translate(cylinderMatrix, cylinderMatrix, [-0.45, 0, 0]);
  glMatrix.mat4.scale(cylinderMatrix, cylinderMatrix, [0.03, 0.649, 0.25]);
 
 
  //gl.uniformMatrix4fv(program.aVertexPosition, false, cylinderMatrix);
  gl.uniform1i(program.uTextureValue,1);
  
  gl.uniform3fv (program.uTheta, new Float32Array(angles));
  gl.activeTexture (gl.TEXTURE0);
  gl.bindTexture (gl.TEXTURE_2D, steelTexture);
  gl.uniformMatrix4fv(program.uModelT, false, cylinderMatrix);

  gl.bindVertexArray(myCylinder.VAO);
  gl.drawElements(gl.TRIANGLES, myCylinder.indices.length, gl.UNSIGNED_SHORT, 0);
  console.log("cylinder: ", myCylinder);


    // base 2nd rod
    cylinderMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(cylinderMatrix, cylinderMatrix, [-0.231, -0.54, 0]);
    glMatrix.mat4.rotateZ(cylinderMatrix,cylinderMatrix,radians(45));
    glMatrix.mat4.scale(cylinderMatrix, cylinderMatrix, [0.03, 0.649, 0.25]);
   
   
   
    //gl.uniformMatrix4fv(program.aVertexPosition, false, cylinderMatrix);
    gl.uniform1i(program.uTextureValue,1);
    
    gl.uniform3fv (program.uTheta, new Float32Array(angles));
    gl.activeTexture (gl.TEXTURE0);
    gl.bindTexture (gl.TEXTURE_2D, steelTexture);
    gl.uniformMatrix4fv(program.uModelT, false, cylinderMatrix);
  
    gl.bindVertexArray(myCylinder.VAO);
    gl.drawElements(gl.TRIANGLES, myCylinder.indices.length, gl.UNSIGNED_SHORT, 0);
    console.log("cylinder: ", myCylinder);

  // bulb holder
  let coneMatrix = glMatrix.mat4.create();
  glMatrix.mat4.translate(coneMatrix, coneMatrix, [0, -0.7, 0]);
  glMatrix.mat4.rotateZ(coneMatrix,coneMatrix,radians(145));
  glMatrix.mat4.scale(coneMatrix, coneMatrix, [0.23, 0.34, 0.25]);
 
 
  //gl.uniformMatrix4fv(program.aVertexPosition, false, cylinderMatrix);
  gl.uniform1i(program.uTextureValue,1);
  
  gl.uniform3fv (program.uTheta, new Float32Array(angles));
  gl.activeTexture (gl.TEXTURE0);
  gl.bindTexture (gl.TEXTURE_2D, steelTexture);
  gl.uniformMatrix4fv(program.uModelT, false, coneMatrix);

  gl.bindVertexArray(myCone.VAO);
  gl.drawElements(gl.TRIANGLES, myCone.indices.length, gl.UNSIGNED_SHORT, 0);
  console.log("cone: ", myCone);

  // table
  let cubeMatrix = glMatrix.mat4.create();
  glMatrix.mat4.scale(cubeMatrix, cubeMatrix, [1.80, 0.15, 1]);
  glMatrix.mat4.translate(cubeMatrix, cubeMatrix, [0, 3.65, 0]);
  
 
  //gl.uniformMatrix4fv(program.aVertexPosition, false, cylinderMatrix);
  gl.uniform1i(program.uTextureValue,1);
  
  gl.uniform3fv (program.uTheta, new Float32Array(angles));
  gl.activeTexture (gl.TEXTURE0);
  gl.bindTexture (gl.TEXTURE_2D, woodTexture);
  gl.uniformMatrix4fv(program.uModelT, false, cubeMatrix);

  gl.bindVertexArray(myCube.VAO);
  gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);

  // Sphere

  let sphereMatrix = glMatrix.mat4.create();
  glMatrix.mat4.scale(sphereMatrix, sphereMatrix, [0.25, 0.25, 0.25]);
  glMatrix.mat4.translate(sphereMatrix, sphereMatrix, [1.75, 1.39, 0]);
  
 
  //gl.uniformMatrix4fv(program.aVertexPosition, false, cylinderMatrix);
  gl.uniform1i(program.uTextureValue,1);
  
  gl.uniform3fv (program.uTheta, new Float32Array(angles));
  gl.activeTexture (gl.TEXTURE0);
  gl.bindTexture (gl.TEXTURE_2D, modelTexture);
  gl.uniformMatrix4fv(program.uModelT, false, sphereMatrix);

  gl.bindVertexArray(mySphere.VAO);
  gl.drawElements(gl.TRIANGLES, mySphere.indices.length, gl.UNSIGNED_SHORT, 0);


}

  //
  // Use this function to create all the programs that you need
  // You can make use of the auxillary function initProgram
  // which takes the name of a vertex shader and fragment shader
  //
  // Note that after successfully obtaining a program using the initProgram
  // function, you will beed to assign locations of attribute and unifirm variable
  // based on the in variables to the shaders.   This will vary from program
  // to program.
  //
  function initPrograms () {
    // set up the per-vertex program
    const VertexShaderTxt = getShader('sphereMap-V');
    const FragmentShaderTxt = getShader('sphereMap-F');

    // Create a program
    let program = gl.createProgram();
    
    gl.attachShader(program, VertexShaderTxt);
    gl.attachShader(program, FragmentShaderTxt);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
    }

    // Use this program instance
    gl.useProgram(program);
    // We attach the location of these shader values to the program instance
    // for easy access later in the code

  program.uModelT = gl.getUniformLocation (program, 'modelt');
  
      


  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  program.aUV = gl.getAttribLocation(program, 'aUV');
    
  // uniforms - you will need to add references for any additional
  // uniforms that you add to your shaders
  program.uTheTexture = gl.getUniformLocation (program, 'theTexture');
  // program.uMarbTexture = gl.getUniformLocation(program, 'marbTexture');
  program.uTheta = gl.getUniformLocation (program, 'theta');
  program.background = gl.getUniformLocation(program, 'background');
  
  return program;
  }

  //shader VAO
function bindVAO(shape, program) {
  console.log("Binding Shader VAO", shape, "\n now program", program);

  //create and bind VAO
    let theVAO = gl.createVertexArray();
    gl.bindVertexArray(theVAO);
    let myVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.aVertexPosition);
    gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uv), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.aUV);
    gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);
    let myIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
    return theVAO;
}

  // creates a VAO and returns its ID
  function bindTextureVAO(shape, program) {
    //create and bind VAO
    let theVAO = gl.createVertexArray();
    gl.bindVertexArray(theVAO);

    let myVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(shape.points), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.sphereAVert);
    gl.vertexAttribPointer(program.sphereAVert,3, gl.FLOAT, false, 0, 0);

    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uv), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.aUV);
    gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);
  
    let myIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(shape.indices),gl.STATIC_DRAW);
  
    // Do cleanup
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  
    return theVAO;
  }


/////////////////////////////////////////////////////////////////////////////
//
//  You shouldn't have to edit anything below this line...but you can
//  if you find the need
//
/////////////////////////////////////////////////////////////////////////////

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}


  //
  // compiles, loads, links and returns a program (vertex/fragment shader pair)
  //
  // takes in the id of the vertex and fragment shaders (as given in the HTML file)
  // and returns a program object.
  //
  // will return null if something went wrong
  //
  function initProgram(vertex_id, fragment_id) {
    const vertexShader = getShader(vertex_id);
    const fragmentShader = getShader(fragment_id);

    // Create a program
    let program = gl.createProgram();
      
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
      return null;
    }
      
    return program;
  }


  //
  // We call draw to render to our canvas
  //
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    drawShapes(drawProgram);

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }

    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);

    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);
      
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    // Read, compile, and link your shaders
    drawProgram = initPrograms();

  
    
    // create and bind your current object
    createShapes();
    setUpTextures();
    
    // do a draw
    draw();
  }
