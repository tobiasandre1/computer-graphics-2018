function setupWebGL(canvas) {
    return WebGLUtils.setupWebGL(canvas);
}
var vertices;
var pointsArray= [];
var colorsArray = []; 
var vertexColors = [vec4(0,0,0,1)];
var texCoordsArray = [];
		
		var texCoord = [
			vec2(-1.5, 0.0),
			vec2(2.5, 0.0),
			vec2(2.5, 10.0),
			vec2(-1.5, 10.0)
		];
			
		

var vertices =  [
			vec3(-4, -1, -1),
			vec3(4, -1, -1),
			vec3(4, -1, -21),
			vec3(-4, -1, -21)
		
		];


window.onload = function init(){
	
		canvas = document.getElementById("webgl");
	
		gl = WebGLUtils.setupWebGL(canvas);
	
		if(!gl){
			alert("No Webbu Gee Ellu")
		}
	
		gl.viewport(0,0,canvas.width,canvas.height);
		gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);	
		
		program = initShaders(gl, "vertex-shader", "fragment-shader");
		gl.useProgram(program);

		
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
		
		
		
		var caBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, caBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
		
		
		
		
		
		var vColor = gl.getAttribLocation(program, "vColor");
		gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vColor);
		
		var cBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(vColor), gl.STATIC_DRAW);
					
		
		
		
	
		
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		
		
		
		
		var texSize = 64;
		var numRows = 8;
		var numCols = 8;
		var myTexels = new Uint8Array(4*texSize*texSize);
			for (var i = 0; i < texSize; ++i) {
				for (var j = 0; j < texSize; ++j) {
					var patchx = Math.floor(i/(texSize/numRows));
					var patchy = Math.floor(j/(texSize/numCols));
					var c = (patchx%2 !== patchy%2 ? 255 : 0);
					
					myTexels[4*i*texSize+4*j] = c;
					myTexels[4*i*texSize+4*j+1] = c;
					myTexels[4*i*texSize+4*j+2] = c;
					myTexels[4*i*texSize+4*j+3] = 255;
				}
			}
		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA,gl.UNSIGNED_BYTE, myTexels);
		
		
		
		
		var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
		gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vTexCoord);
		
		var tBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW)
		
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW)
		
		
					
		var texture = gl.createTexture();
		gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);
		
		
		
		
		
		
		
	render(); 
}
		

		
		
function quad(a, b, c, d)
		{
			
			
			pointsArray.push(vertices[a]);
			colorsArray.push(vertexColors[a]);
			texCoordsArray.push(texCoord[0]);
			
			pointsArray.push(vertices[b]);
			colorsArray.push(vertexColors[a]);
			texCoordsArray.push(texCoord[1]);
			
			pointsArray.push(vertices[c]);
			colorsArray.push(vertexColors[a]);
			texCoordsArray.push(texCoord[2]);
			
			pointsArray.push(vertices[a]);
			colorsArray.push(vertexColors[a]);
			texCoordsArray.push(texCoord[0]);
			
			pointsArray.push(vertices[c]);
			colorsArray.push(vertexColors[a]);
			texCoordsArray.push(texCoord[2]);
			
			pointsArray.push(vertices[d]);
			colorsArray.push(vertexColors[a]);
			texCoordsArray.push(texCoord[3]);
			
			
		}

quad(0,1,2,3);		
		
function render(){
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.generateMipmap(gl.TEXTURE_2D);
var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW)
gl.drawElements(gl.TRIANGLES, pointsArray.length,gl.UNSIGNED_SHORT,0);

requestAnimFrame(render);
}



	
	