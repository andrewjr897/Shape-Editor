

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvasLeft = canvas.getBoundingClientRect().left,
canvasTop = canvas.getBoundingClientRect().top;
let start = new Map([['x',null],['y',null]]);
let drag = false;

//variables
var number = 0;
var layer = 0;
var clickCount = 0;
var position;
var currentFunction = "selecting";
var startPosition;
var lastCurrentPosition;
var ctrlDown = false;
var copiedPoints = [];
var currentlySelectedType;
var objectSelected = false;
var data;
var startPoints;
var center;
var currentPosition;
var lastPnt;
var first = true;
var selectedNumber;
var polyPoints = [];
var curvePoints = [];
var polygonPoints = [];
var count = 1;
var rotationPoint;
var curveTemp;
var newFileStatus;
var currentColor = document.getElementById("drawingColor").value;
var ellipseStartAngle;
var a;
var b;

objects = [];
//objects = [{"type" : "line", "selected" : true, "number" : 0, "color" : "black", "layer" : 0, "points" : [vec2(300, 100), vec2(400,200)]}];
objectMemory = [];


//function that draws all objects
function draw(){

	for(let i = 0; i<objects.length; i++){
		
		if(objects[i].type == "line"){ //draw lines
			context.beginPath();
	        context.strokeStyle = objects[i].color;
	        context.lineWidth = 1;
	        context.moveTo(objects[i].points[0][0], objects[i].points[0][1]);
	        context.lineTo(objects[i].points[1][0], objects[i].points[1][1]);
	        context.stroke();

	        if(objects[i].selected){
	        	drawOutline(objects[i]);
	        }

		} else if(objects[i].type == "rectangle"){ //draw rectangles
			context.fillStyle = objects[i].color;
	        context.beginPath();
	        context.moveTo(objects[i].points[0][0], objects[i].points[0][1]);
	        context.lineTo(objects[i].points[1][0], objects[i].points[1][1]);
	        context.lineTo(objects[i].points[2][0], objects[i].points[2][1]);
	        context.lineTo(objects[i].points[3][0], objects[i].points[3][1]);
	        context.lineTo(objects[i].points[0][0], objects[i].points[0][1]);
	        context.fill();

	        if(objects[i].selected){
	        	drawOutline(objects[i]);
	        }

		} else if(objects[i].type == "triangle"){ //draw triangle
			context.fillStyle = objects[i].color;
	        context.beginPath();
	        context.moveTo(objects[i].points[0][0], objects[i].points[0][1]);
	        context.lineTo(objects[i].points[1][0], objects[i].points[1][1]);
	        context.lineTo(objects[i].points[2][0], objects[i].points[2][1]);
	        context.lineTo(objects[i].points[0][0], objects[i].points[0][1]);
	        context.fill();

	        if(objects[i].selected){
	        	drawOutline(objects[i]);
	        }

		} else if(objects[i].type == "circle"){ //draw circle

			let rad = Math.sqrt(Math.pow((objects[i].points[1][0]-objects[i].points[0][0]),2)+Math.pow((objects[i].points[1][1]-objects[i].points[0][1]),2));

			context.fillStyle = objects[i].color;
	        context.beginPath();
	        context.arc(objects[i].points[0][0], objects[i].points[0][1], rad, 0, 2*Math.PI, false);
	        context.fill();

	        if(objects[i].selected){
	        	drawOutline(objects[i]);
	        }

		} else if(objects[i].type == "polyline"){ //draw polyline

			if(objects[i].selected){
				context.strokeStyle = 'rgb(0, 127, 255)';
			}else context.strokeStyle = objects[i].color;
			context.beginPath();
			context.lineWidth = 1;
			context.moveTo(objects[i].points[0][0], objects[i].points[0][1]);

			for(let j = 1; j<objects[i].points.length; j++){
				context.lineTo(objects[i].points[j][0], objects[i].points[j][1]);
			}
			context.stroke();
		} else if(objects[i].type == "curve"){
			context.beginPath();
	        context.strokeStyle = objects[i].color;
	        context.lineWidth = 1;
	        context.moveTo(objects[i].points[0][0], objects[i].points[0][1]);
	        context.quadraticCurveTo(objects[i].points[1][0], objects[i].points[1][1], objects[i].points[2][0], objects[i].points[2][1]);
	        context.stroke();

	        if(objects[i].selected){
	        	drawOutline(objects[i]);
	        }
		} else if(objects[i].type == "polygon"){
			context.fillStyle = objects[i].color;
	        context.beginPath();
	        context.moveTo(objects[i].points[0][0], objects[i].points[0][1]);
	        context.lineTo(objects[i].points[1][0], objects[i].points[1][1]);
	        context.lineTo(objects[i].points[2][0], objects[i].points[2][1]);
	        context.lineTo(objects[i].points[3][0], objects[i].points[3][1]);
	        context.lineTo(objects[i].points[4][0], objects[i].points[4][1]);
	        context.lineTo(objects[i].points[5][0], objects[i].points[5][1]);
	        context.lineTo(objects[i].points[0][0], objects[i].points[0][1]);
	        context.fill();

	        if(objects[i].selected){
	        	drawOutline(objects[i]);
	        }
		} else if(objects[i].type == "ellipse"){

			let a = Math.sqrt(Math.pow((objects[i].points[2][0]-objects[i].points[0][0]),2)+Math.pow((objects[i].points[2][1]-objects[i].points[0][1]),2));
			let b = Math.sqrt(Math.pow((objects[i].points[1][0]-objects[i].points[0][0]),2)+Math.pow((objects[i].points[1][1]-objects[i].points[0][1]),2));
			context.fillStyle = objects[i].color;
			context.beginPath();
			context.ellipse(objects[i].points[0][0], objects[i].points[0][1], a, b, objects[i].rotation, 0, 2 * Math.PI);
			context.fill();

			if(objects[i].selected){
	        	drawOutline(objects[i]);
	        }
		}
	}
}

//if object is selected this draws the outline
function drawOutline(object){

	if(object.type == "line"){
		context.beginPath();
        context.strokeStyle = 'rgb(0, 127, 255)';
        context.lineWidth = 1;
        context.moveTo(object.points[0][0], object.points[0][1]);
        context.lineTo(object.points[1][0], object.points[1][1]);
        context.stroke();
	}else if(object.type == "rectangle"){
		context.strokeStyle = 'rgb(0, 127, 255)';
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(object.points[0][0], object.points[0][1]);
        context.lineTo(object.points[1][0], object.points[1][1]);
        context.lineTo(object.points[2][0], object.points[2][1]);
        context.lineTo(object.points[3][0], object.points[3][1]);
        context.lineTo(object.points[0][0], object.points[0][1]);
        context.stroke();
	}else if(object.type == "triangle"){
		context.strokeStyle = 'rgb(0, 127, 255)';
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(object.points[0][0], object.points[0][1]);
        context.lineTo(object.points[1][0], object.points[1][1]);
        context.lineTo(object.points[2][0], object.points[2][1]);
        context.lineTo(object.points[0][0], object.points[0][1]);
        context.stroke();
	}else if(object.type == "circle"){

		let rad = Math.sqrt(Math.pow((object.points[1][0]-object.points[0][0]),2)+Math.pow((object.points[1][1]-object.points[0][1]),2));

		context.strokeStyle = 'rgb(0, 127, 255)';
        context.beginPath();
        context.lineWidth = 2;
        context.arc(object.points[0][0], object.points[0][1], rad, 0, 2*Math.PI, false);
        context.stroke();
	}else if(object.type == "curve"){
		context.beginPath();
        context.strokeStyle = 'rgb(0, 127, 255)';
        context.lineWidth = 1;
        context.moveTo(object.points[0][0], object.points[0][1]);
        context.quadraticCurveTo(object.points[1][0], object.points[1][1], object.points[2][0], object.points[2][1]);
        context.stroke();
	}else if(object.type == "polygon"){
		context.strokeStyle = 'rgb(0, 127, 255)';
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(object.points[0][0], object.points[0][1]);
        context.lineTo(object.points[1][0], object.points[1][1]);
        context.lineTo(object.points[2][0], object.points[2][1]);
        context.lineTo(object.points[3][0], object.points[3][1]);
        context.lineTo(object.points[4][0], object.points[4][1]);
        context.lineTo(object.points[5][0], object.points[5][1]);
        context.lineTo(object.points[0][0], object.points[0][1]);
        context.stroke();
	}else if(object.type == "ellipse"){

		let a = Math.sqrt(Math.pow((object.points[2][0]-object.points[0][0]),2)+Math.pow((object.points[2][1]-object.points[0][1]),2));
		let b = Math.sqrt(Math.pow((object.points[1][0]-object.points[0][0]),2)+Math.pow((object.points[1][1]-object.points[0][1]),2));
		context.strokeStyle = 'rgb(0, 127, 255)';
        context.beginPath();
        context.lineWidth = 2;
        context.ellipse(object.points[0][0], object.points[0][1], a, b, object.rotation, 0, 2 * Math.PI);
		context.stroke();
	}
}

//back button press
function backButton(){
	//put deleted object in memory and then delete it
	if(objects.length >= 1){
		objectMemory.push(objects[number-1]);
		objects.splice((number-1), 1);
		number -= 1;
		layer -= 1;

		//redraw all current objects
		clearAndDraw();
	}
}


//redo button press
function redoButton(){
	if(objectMemory.length >= 1){
		objects.push(objectMemory[objectMemory.length-1]);
		objectMemory.splice((objectMemory.length-1), 1);
		objects[objects.length-1].number = number;
		objects[objects.length-1].layer = layer;
		objects[objects.length-1].selected = false;
		number += 1;
		layer += 1;
		clearAndDraw();
	}
}


//add object after drawn
function addObject(points, objectType){

	if(objectType == "line"){
		objects.push({"type" : "line", "selected" : false, "number" : number, "color" : currentColor, "layer" : layer, "points" : [points[0], points[1]]});
	} else if(objectType == "rectangle"){
		objects.push({"type" : "rectangle", "selected" : false, "number" : number, "color" : currentColor, "layer" : layer, "points" : [points[0], points[1], points[2], points[3]]});
	} else if(objectType == "triangle"){
		objects.push({"type" : "triangle", "selected" : false, "number" : number, "color" : currentColor, "layer" : layer, "points" : [points[0], points[1], points[2]]});
	} else if(objectType == "circle"){
		objects.push({"type" : "circle", "selected" : false, "number" : number, "color" : currentColor, "layer" : layer, "points" : [points[0], points[1]]});
	} else if(objectType == "polyline"){
		objects.push({"type" : "polyline", "selected" : false, "number" : number, "color" : currentColor, "layer" : layer, "points" : []});

		for(let i = 0; i<points.length; i++){
			objects[objects.length-1].points.push(points[i]);
		}
	} else if(objectType == "curve"){
		objects.push({"type" : "curve", "selected" : false, "number" : number, "color" : currentColor, "layer" : layer, "points" : points});
	} else if(objectType == "polygon"){
		objects.push({"type" : "polygon", "selected" : false, "number" : number, "color" : currentColor, "layer" : layer, "points" : points});
	} else if(objectType == "ellipse"){
		objects.push({"type" : "ellipse", "selected" : false, "number" : number, "color" : currentColor, "layer" : layer, "rotation" : 0, "points" : points})
	}

	number += 1;
	layer += 1;

}

//function gets position on canvas
function positionInCanvas (e, canvasLeft, canvasTop) {
    return {
        x:e.clientX - canvasLeft,
        y:e.clientY - canvasTop
    }
}

//function for when ouse is clicked
canvas.onmousedown = function(e) {

	let pos = positionInCanvas(e, canvasLeft, canvasTop);
	start.set('x', pos.x);
	start.set('y', pos.y);

	position = vec2(pos.x, pos.y);

	if(currentFunction != "selecting"){
		if(clickCount == 0){
			rotationPoint = position;
			first = true;
			drag = true;
			if(isThereSelected()){
				startPoints = getSelected().points;
				center = findCenter(getSelected().points, getSelected().type);
			}
		}

		clickCount += 1;

		if(clickCount == 2 & currentFunction != "polyline" & currentFunction != "curve"){
			drag = false;
			if(checkForDrawing()){
				finishDrawing();
			}else{
				clickCount = 0;
				clearAndDraw();
			}
		}
	} else selecting(position);
}

//function for when mouse is moved
canvas.onmousemove = function(e) {

	let pos = positionInCanvas(e, canvasLeft, canvasTop);
	currentPosition = vec2(pos.x, pos.y);

	document.getElementById("x&y").innerHTML = "X="+Math.round(pos.x)+", Y="+Math.round(pos.y);

	if(drag == true){
		//let pos = positionInCanvas(e, canvasLeft, canvasTop);
		//currentPosition = vec2(pos.x, pos.y);

		//document.getElementById("x&y").innerHTML = "X="+pos.x+" Y="+pos.y;

		if(currentFunction == "line"){
			drawingLine(currentPosition);
		} else if(currentFunction == "rectangle"){
			drawingRectangle(currentPosition);
		} else if(currentFunction == "circle"){
			drawingCircle(currentPosition);
		} else if(currentFunction == "triangle"){
			drawingTriangle(currentPosition);
		} else if(currentFunction == "polyline"){
			drawingPolyline(currentPosition);
		} else if(currentFunction == "curve"){
			drawingCurve(currentPosition);
		} else if(currentFunction == "ellipse"){
			drawingEllipse(currentPosition);
		}else if(currentFunction == "polygon"){
			drawingPolygon(currentPosition);
		}else if(currentFunction == "scaling" & isThereSelected()){
			updateSelected(objectScaling(position, currentPosition, findCoordinates(startPoints, center)), center);
		} else if(currentFunction == "rotation" & isThereSelected()){
			if(getSelected().type != "ellipse"){
				updateSelected(objectRotation(findCoordinates(startPoints, rotationPoint), getRotationAngle(currentPosition, rotationPoint)), rotationPoint);
			}else{
				getSelected().rotation = -radians(getRotationAngle(currentPosition, rotationPoint));
				updateSelected(objectRotation(findCoordinates(startPoints, rotationPoint), getRotationAngle(currentPosition, rotationPoint)), rotationPoint);
			}
		} else if(currentFunction == "translation" & isThereSelected()){
			if(first == true){
				updateSelected(objectTranslation(position, currentPosition, findCoordinates(getSelected().points, center)), center);
			} else updateSelected(objectTranslation(lastPnt, currentPosition, findCoordinates(getSelected().points, center)), center);
		}
	}
}


canvas.onmouseup = function(e) {
}






draw();

//check to see if an object is selected
function isThereSelected(){

	let yes;

	for(let i = 0; i<objects.length; i++){
		if(objects[i].selected){
			yes = true;
			break;
		} else yes = false;
	}
	return yes;
}

//check to see if something is being drawn
function checkForDrawing(){
	if(currentFunction == "scaling"){
		return false;
	} else if(currentFunction == "rotation"){
		return false;
	} else if(currentFunction == "translation"){
		return false;
	} else return true;
}

//function to add object and stop the drawing
function finishDrawing(){
	if(currentFunction == "line"){
		let points = [startPosition, lastCurrentPosition];
		addObject(points, "line");
		clickCount = 0;
		clearAndDraw();
	} else if(currentFunction == "rectangle"){
		let p1, p2, p3, p4;

		p1 = startPosition;
		p2 = vec2(lastCurrentPosition[0], startPosition[1]);
		p3 = lastCurrentPosition;
		p4 = vec2(startPosition[0], lastCurrentPosition[1]);

		let points = [p1, p2, p3, p4];

		addObject(points, "rectangle");
		clickCount = 0;
		clearAndDraw();

		console.log(points);
	} else if(currentFunction == "triangle"){
		r = Math.sqrt(Math.pow((lastCurrentPosition[0]-startPosition[0]),2)+Math.pow((lastCurrentPosition[1]-startPosition[1]),2));
		a = (r*6)/Math.sqrt(3);
		R = a*(Math.sqrt(3)/3);
		let p1 = vec2(startPosition[0], startPosition[1]-R);
		let p2 = vec2(startPosition[0]+(a/2), startPosition[1]+r);
		let p3 = vec2(startPosition[0]-(a/2), startPosition[1]+r);
		let points = [p1, p2, p3];
		console.log(points);
		addObject(points, "triangle");
		clickCount = 0;
		clearAndDraw();
	} else if(currentFunction == "circle"){
		let points = [startPosition, lastCurrentPosition];
		addObject(points, "circle");
		clickCount = 0;
		clearAndDraw();
	} else if(currentFunction == "polyline"){
		drag = false;
		polyPoints.splice(count, 1);
		addObject(polyPoints, "polyline");
		clickCount = 0;
		count = 1;
		clearAndDraw();
	} else if(currentFunction == "curve"){
		drag = false;
		addObject(curvePoints, "curve");
		clickCount = 0;
		clearAndDraw();
	} else if(currentFunction == "polygon"){
		drag = false;
		addObject(polygonPoints, "polygon");
		clickCount = 0;
		clearAndDraw();
	} else if(currentFunction == "ellipse"){

		let p1, p2, p3;

		p1 = startPosition;
		p2 = vec2(startPosition[0], lastCurrentPosition[1]);
		p3 = vec2(lastCurrentPosition[0], startPosition[1]);
		let points = [p1, p2, p3];
		drag = false;
		addObject(points, "ellipse");
		clickCount = 0;
		clearAndDraw();
	}
}

/***********

the following are function that displays the shape as it is being drawn

*************/

//drawing rectangle
function drawingRectangle(currentPosition){

	if(clickCount == 1){
		startPosition = position;
	}

	lastCurrentPosition = currentPosition;

	if(clickCount == 1){
		clearAndDraw();
		context.beginPath();
		context.fillStyle = currentColor;
		context.moveTo(startPosition[0], startPosition[1]);
		context.lineTo(currentPosition[0], startPosition[1]);
		context.lineTo(currentPosition[0], currentPosition[1]);
		context.lineTo(startPosition[0], currentPosition[1]);
		context.lineTo(startPosition[0], startPosition[1]);
		context.fill();
	}	
}

//drawing line
function drawingLine(currentPosition){

	if(clickCount == 1){
		startPosition = position;
	}

	lastCurrentPosition = currentPosition;

	if(clickCount == 1){
		clearAndDraw();
		context.beginPath();
		context.strokeStyle = currentColor;
		context.lineWidth = 1;
		context.moveTo(startPosition[0], startPosition[1]);
		context.lineTo(currentPosition[0], currentPosition[1]);
		context.stroke();
	}	
}

//drawing circle
function drawingCircle(currentPosition){

	if(clickCount == 1){
		startPosition = position;
	}

	lastCurrentPosition = currentPosition;

	if(clickCount == 1){
		clearAndDraw();
		let rad = Math.sqrt(Math.pow((currentPosition[0]-startPosition[0]),2)+Math.pow((currentPosition[1]-startPosition[1]),2));
	    context.beginPath();
	    context.lineWidth = 1;
	    context.fillStyle = currentColor;
	    context.arc(startPosition[0], startPosition[1], rad, 0, 2*Math.PI, false);
	    context.fill()
	}	
}

//function to draw triangle
function drawingTriangle(currentPosition){

	if(clickCount == 1){
		startPosition = position;
	}

	lastCurrentPosition = currentPosition;

	let r;
	let a;
	let R;

	if(clickCount == 1){
		clearAndDraw();
		
		r = Math.sqrt(Math.pow((currentPosition[0]-startPosition[0]),2)+Math.pow((currentPosition[1]-startPosition[1]),2));
		a = (r*6)/Math.sqrt(3);
		R = a*(Math.sqrt(3)/3);

	    context.beginPath();
	    context.fillStyle = currentColor;
	    context.moveTo(startPosition[0], startPosition[1]-R);
	    context.lineTo(startPosition[0]+(a/2), startPosition[1]+r);
	    context.lineTo(startPosition[0]-(a/2), startPosition[1]+r);
	    context.lineTo(startPosition[0], startPosition[1]-R);
	    context.fill();
	}	
}

//function to draw polyline
function drawingPolyline(currentPosition){

	if(clickCount > count){
		polyPoints.splice(count, 1);
		polyPoints.push(position);
		polyPoints.push(currentPosition);
		count += 1;
	} else if(clickCount == 1) {
		polyPoints = [position, currentPosition];
	} else{
		polyPoints.splice(polyPoints.length-1, 1);
		polyPoints.push(currentPosition);
	}

	lastCurrentPosition = currentPosition;

	clearAndDraw();
	context.lineWidth = 1;
	context.strokeStyle = currentColor;
	context.beginPath();
	context.moveTo(polyPoints[0][0], polyPoints[0][1]);

	for(let i = 1; i < polyPoints.length; i++){
		context.lineTo(polyPoints[i][0], polyPoints[i][1]);
	}
	context.stroke();
}

//function that draws a curve
function drawingCurve(currentPosition){

	if(clickCount == 1){
		startPosition = position;
	} else if(clickCount == 2){
		curveTemp = position;
	} else if(clickCount == 3){
		curvePoints = [startPosition, position, curveTemp];
		finishDrawing();
		return;
	}

	clearAndDraw();
	context.lineWidth = 1;
	context.strokeStyle = currentColor;
	context.beginPath();
	context.moveTo(startPosition[0], startPosition[1]);
	if(clickCount == 1){
		context.quadraticCurveTo(startPosition[0], startPosition[1], currentPosition[0], currentPosition[1]);
		context.stroke();
	} else if(clickCount == 2){
		context.quadraticCurveTo(currentPosition[0], currentPosition[1], curveTemp[0], curveTemp[1]);
	}
	context.stroke();
}

//function that draws a curve
function drawingPolygon(currentPosition){

	if(clickCount == 1){
		startPosition = position;
	}

	lastCurrentPosition = currentPosition;

	if(clickCount == 1){

		let p1, p2, p3, p4, p5, p6;

		let a = Math.sqrt(Math.pow((currentPosition[0]-startPosition[0]),2)+Math.pow((currentPosition[1]-startPosition[1]),2))/2;
		let height = (3/2)*a-a;
		let length = a*Math.sqrt(3);

		if(startPosition[0] < currentPosition[0]){
			let distX = (currentPosition[0]+startPosition[0])/2;
			p1 = startPosition;
			p3 = vec2(startPosition[0]+length, startPosition[1]);
			if(startPosition[1] < currentPosition[1]){
				p2 = vec2(startPosition[0]+length/2, startPosition[1]-height);
				p4 = vec2(startPosition[0]+length, startPosition[1]+a);
				p5 = vec2(startPosition[0]+length/2, startPosition[1]+height+a);
				p6 = vec2(startPosition[0], startPosition[1]+a);
			} else{
				p2 = vec2(startPosition[0]+length/2, startPosition[1]+height);
				p4 = vec2(startPosition[0]+length, startPosition[1]-a);
				p5 = vec2(startPosition[0]+length/2, startPosition[1]-height-a);
				p6 = vec2(startPosition[0], startPosition[1]-a);
			}
		} else{
			let distX = (startPosition[0]+currentPosition[0])/2;
			p1 = startPosition;
			p3 = vec2(startPosition[0]-length, startPosition[1]);
			if(startPosition[1] > currentPosition[1]){
				p2 = vec2(startPosition[0]-length/2, startPosition[1]+height);
				p4 = vec2(startPosition[0]-length, startPosition[1]-a);
				p5 = vec2(startPosition[0]-length/2, startPosition[1]-height-a);
				p6 = vec2(startPosition[0], startPosition[1]-a);
			} else{
				p2 = vec2(startPosition[0]-length/2, startPosition[1]-height);
				p4 = vec2(startPosition[0]-length, startPosition[1]+a);
				p5 = vec2(startPosition[0]-length/2, startPosition[1]+height+a);
				p6 = vec2(startPosition[0], startPosition[1]+a);
			}
		}
		clearAndDraw();
		context.beginPath();
		context.fillStyle = currentColor;
		context.moveTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.lineTo(p3[0], p3[1]);
		context.lineTo(p4[0], p4[1]);
		context.lineTo(p5[0], p5[1]);
		context.lineTo(p6[0], p6[1]);
		context.fill();
		polygonPoints = [p1, p2, p3, p4, p5, p6];
	}
}

//function to draw ellipse
function drawingEllipse(currentPosition){

	if(clickCount == 1){
		startPosition = position;
	}

	lastCurrentPosition = currentPosition;

	if(clickCount == 1){
		let radX = Math.abs(currentPosition[0]-startPosition[0]);
		let radY = Math.abs(currentPosition[1]-startPosition[1]);

		clearAndDraw();
		context.beginPath();
		context.fillStyle = currentColor;
		context.ellipse(startPosition[0], startPosition[1], radX, radY, 0, 0, 2 * Math.PI);
		context.fill();
	}

}

//clears and draws the canvas
function clearAndDraw(){
	context.clearRect(0,0,canvas.width, canvas.height);
	draw();
}

//stuff for copy and paste
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);

//function for when a key is pressed
function keyDown(e) {
    let keyCode = e.keyCode;

    if(keyCode == 17 || keyCode == 91){
        ctrlDown = true;
    }
    if(ctrlDown && (keyCode == 67)){
        console.log("i copied");
        copySelected();
    }

    if(ctrlDown && (keyCode == 86)){
        pasteSelected();
        console.log("i pasted");
    }

    if(keyCode == 27){
    	if(currentFunction != "polyline"){
    		clickCount = 0;
    		deselect();
    		clearAndDraw();
    		drag = false;
    	} else finishDrawing();
    }

    if(ctrlDown && (keyCode == 90)){
    	backButton();
    }
  
}

//key up
function keyUp(e){

    let keyCode = e.keyCode;
    if(keyCode == 17 || keyCode == 91) ctrlDown = false;

}

//copy currently selected object
function copySelected(){

	if(isThereSelected()){
		objectSelected = true;
		currentlySelectedType = getSelected().type;
		selectedNumber = getSelected().number;
		for(let i = 0; i < getSelected().points.length; i++){
			copiedPoints.push(vec2(getSelected().points[i][0]+10, getSelected().points[i][1]+10));
		}
	}
}

//adds copied selection and re draws
function pasteSelected(){
	if(objectSelected){
		addObject(copiedPoints, currentlySelectedType);
		objects[number-1].selected = true;
		objects[number-1].color = objects[selectedNumber].color;
		objects[selectedNumber].selected = false;
    	clearAndDraw();
    	copiedPoints = [];
    	objectSelected = false;
	}
}

//function to find object coordinates
function findCoordinates(points, center){

    var newPoints = [];

    for(var i = 0; i<points.length; i++){
            newPoints.push(vec2(points[i][0]-center[0], center[1]-points[i][1]));
        }
    return newPoints;
}

//change from object coordinates to world coordinates
function resetCoordinates(points, center){

	var resetPoints = [];

	for(var i = 0; i<points.length; i++){
		resetPoints.push(vec2(points[i][0]+center[0], ((-center[1]+points[i][1])*-1)));
	}
	return resetPoints;
}

//function to translate objects *** not fixed yet
function objectTranslation(startPoint, positionPoint, points){

    let translatedPoints = [];

    if(first == true){
    	lastPnt = startPoint;
    	first = false;
    } else lastPnt = positionPoint;

    let changeX = (positionPoint[0]-startPoint[0]);
    let changeY = -(positionPoint[1]-startPoint[1]);

	for(let i = 0; i<points.length; i++){
	    let translationMatrix = mat4(1, 0, 0, changeX, 0, 1, 0, changeY, 0, 0, 1, 0, 0, 0, 0, 1);
	    let point = mat4(points[i][0],0,0,0,points[i][1],0,0,0,0,0,0,0,1,0,0,0);

	    let translatedMatrix = mult(translationMatrix, point);
	    let translatedPoint = vec2(translatedMatrix[0][0], translatedMatrix[1][0]);
	    translatedPoints.push(translatedPoint);
	}
    return translatedPoints;
}


//function to rotate the object *** not fixed yet *** need to get the angle
function objectRotation(points, angle){

    let rotatedPoints = [];

    for(var i = 0; i<points.length; i++){
        var rotationMatrix = mat4(Math.cos( radians(angle) ), -Math.sin( radians(angle) ), 0, 0, Math.sin( radians(angle) ), Math.cos( radians(angle) ), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        let point = mat4(points[i][0],0,0,0,points[i][1],0,0,0,0,0,0,0,0,0,0,0);


        let rotatedMatrix = mult(rotationMatrix, point);
        let rotatedPoint = vec2(rotatedMatrix[0][0], rotatedMatrix[1][0]);
        rotatedPoints.push(rotatedPoint);
    }
    return rotatedPoints;
}


//function to scale the objects
function objectScaling(startPoint, positionPoint, points){

	
	let scaledPoints = [];

	let changeX = (positionPoint[0]-startPoint[0]);
	let changeY = (positionPoint[1]-startPoint[1]);

	let scaleFacter = Math.sqrt(Math.pow(changeX, 2)+Math.pow(changeY, 2))/10;

	if(scaleFacter <= 0){
		scaleFacter = 0.1;
	}

	for(let i = 0; i<points.length; i++){
    	let scalingMatrix = mat4(scaleFacter, 0, 0, 0, 0, scaleFacter, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1);
    	let point = mat4(points[i][0],0,0,0,points[i][1],0,0,0,0,0,0,0,0,0,0,0);


    	let scaledMatrix = mult(scalingMatrix, point);
    	let scaledPoint = vec2(scaledMatrix[0][0], scaledMatrix[1][0]);
    	scaledPoints.push(scaledPoint);
	}
	return scaledPoints;
	
}

//function to find center of object
function findCenter(points, object){

	let center;

    if(object == "line"){
    	center = vec2((points[0][0]-points[1][0])/2+points[1][0], (points[0][1]-points[1][1])/2+points[1][1]);
	} else if( object == "rectangle"){
		center = vec2((points[0][0]-points[1][0])/2+points[1][0], (points[0][1]-points[1][1])/2+points[1][1]);
	} else if( object == "triangle"){
		let height = (Math.sqrt(Math.pow((points[1][0]-points[0][0]), 2)+Math.pow((points[1][1]-points[0][1]), 2)))*0.8660254;
		let midP = vec2((points[0][0]-points[2][0])/2+points[2][0], (points[0][1]-points[2][1])/2+points[2][1]);
		let length = (height*2)/Math.sqrt(3);
		let disO = (length*Math.sqrt(3))/6;
		let x = midP[0]-(disO*(midP[0]-points[1][0]))/length;
		let y = midP[1]-(disO*(midP[1]-points[1][1]))/length;

		center = vec2(x,y);

	} else if( object == "polygon"){
		center = vec2((points[0][0]-points[3][0])/2+points[3][0], (points[0][1]-points[3][1])/2+points[3][1]);
	} else if( object == "circle"){
		center = points[0];
	} else if( object == "polyline"){
		center = vec2((points[0][0]-points[points.length-1][0])/2+points[points.length-1][0], (points[0][1]-points[points.length-1][1])/2+points[points.length-1][1]);
	} else if( object == "curve"){
		center = vec2((points[0][0]-points[2][0])/2+points[2][0], (points[0][1]-points[2][1])/2+points[2][1]);
	} else if( object == "ellipse" ){
		center = points[0];
	}

    return center;

}

//function to get rotation angle
function getRotationAngle(point, center){

	var pointchanged = vec2(point[0]-center[0], center[1]-point[1]);

	var angle;
	var hypotenuse = Math.sqrt(Math.pow(pointchanged[0], 2)+Math.pow(pointchanged[1], 2));

	if(pointchanged[0] > 0 && pointchanged[1] > 0){
		angle = (180*(Math.acos(pointchanged[0]/hypotenuse)))/Math.PI;
	}else if(pointchanged[0] > 0 && pointchanged[1] < 0){
		angle = 180*(Math.acos(Math.abs(pointchanged[1]/hypotenuse)))/Math.PI+270;
	}else if(pointchanged[0] < 0 && pointchanged[1] < 0){
		angle = 180*(Math.acos(Math.abs(pointchanged[0]/hypotenuse)))/Math.PI+180;
	}else angle = 180*(Math.acos(pointchanged[1]/hypotenuse))/Math.PI+90;

	return angle;
}


function getSelected(){
	for(let i = 0; i<objects.length; i++){
		if(objects[i].selected){
			return objects[i];
		}
	}
}


//updates the points of the currently selected object
function updateSelected(newPoints, center){
	getSelected().points = resetCoordinates(newPoints, center);
	clearAndDraw();
}


//function that finds the object upon a click
function selecting(clickPos){

	let selected = [];
	deselect();

	for(let i = 0; i<objects.length; i++){

		if(objects[i].type == "line"){

			context.lineWidth = 5;
			context.beginPath();
			context.moveTo(objects[i].points[0][0], objects[i].points[0][1]);
			context.lineTo(objects[i].points[1][0], objects[i].points[1][1]);
			if(context.isPointInStroke(clickPos[0], clickPos[1])){
				//objects[i].selected = true;
				selected.push(i);
			}
		
		} else if(objects[i].type == "rectangle"){

			let recPoints;

			if(objects[i].points[0][0] < objects[i].points[1][0] & objects[i].points[0][1] < objects[i].points[2][1]){
				recPoints = objects[i].points;
			} else if(objects[i].points[0][0] > objects[i].points[1][0] & objects[i].points[0][1] > objects[i].points[2][1]){
				recPoints = objects[i].points;
			} else if(objects[i].points[0][0] < objects[i].points[1][0] & objects[i].points[0][1] > objects[i].points[2][1]){
				recPoints = [objects[i].points[3], objects[i].points[2], objects[i].points[1], objects[i].points[0]];
			} else{
				recPoints = [objects[i].points[1], objects[i].points[0], objects[i].points[3], objects[i].points[2]];
			}

			function sign(p0, p1, p2){
				return (p0[0]-p2[0])*(p1[1]-p2[1])-(p1[0]-p2[0])*(p0[1]-p2[1]);
			}

			let d1, d2, d3;
			let has_neg, has_pos;

			for(let j = 0; j<2; j++){

				if(j == 0){
					d1 = sign(clickPos, recPoints[3], recPoints[0]);
					d2 = sign(clickPos, recPoints[0], recPoints[1]);
					d3 = sign(clickPos, recPoints[1], recPoints[3]);
				}else{
					d1 = sign(clickPos, recPoints[1], recPoints[2]);
					d2 = sign(clickPos, recPoints[2], recPoints[3]);
					d3 = sign(clickPos, recPoints[3], recPoints[1]);
				}

				if(d1 > 0 & d2 > 0 & d3 > 0){
					//objects[i].selected = true;
					selected.push(i);
					break;
				}
			}
		} else if(objects[i].type == "triangle"){

			function sign(p0, p1, p2){
				return (p0[0]-p2[0])*(p1[1]-p2[1])-(p1[0]-p2[0])*(p0[1]-p2[1]);
			}

			let d1, d2, d3;
			let has_neg, has_pos;

			d1 = sign(clickPos, objects[i].points[0], objects[i].points[1]);
			d2 = sign(clickPos, objects[i].points[1], objects[i].points[2]);
			d3 = sign(clickPos, objects[i].points[2], objects[i].points[0]);

			if(d1 > 0 & d2 > 0 & d3 > 0){
				//objects[i].selected = true;
				selected.push(i);
			}
		} else if(objects[i].type == "circle"){
			let rad = Math.sqrt(Math.pow((objects[i].points[1][0]-objects[i].points[0][0]),2)+Math.pow((objects[i].points[1][1]-objects[i].points[0][1]),2));
			let dist = Math.sqrt(Math.pow((clickPos[0]-objects[i].points[0][0]),2)+Math.pow((clickPos[1]-objects[i].points[0][1]),2));
			if(dist <= rad){
				//objects[i].selected = true;
				selected.push(i);
			}
		} else if(objects[i].type == "polyline"){

			for(let j = 1; j<objects[i].points.length; j++){
				context.lineWidth = 5;
				context.beginPath();
				context.moveTo(objects[i].points[j-1][0], objects[i].points[j-1][1]);
				context.lineTo(objects[i].points[j][0], objects[i].points[j][1]);
				if(context.isPointInStroke(clickPos[0], clickPos[1])){
					//objects[i].selected = true;
					selected.push(i);
				}
			}
		} else if(objects[i].type == "curve"){

			let n = 300;

			let x, y, z;
			let delta = 1/n;
			let t;

			x = objects[i].points[0][0];
			y = objects[i].points[0][1];
			t = 0.0;

			for(let j = 0; j<n; j++){
		        t += delta;
		        let t2 = t*t;
		        let t3 = t2*t;
		           
		        let q1=(1-t);
		        let q2=q1*q1;
		        let q3=q2*q1;
		        x = q3*objects[i].points[0][0] + (3*t*q2)*(objects[i].points[1][0]) + (3*t2*q1)*objects[i].points[2][0] + t3*objects[i].points[2][0];
		        y = q3*objects[i].points[0][1] + (3*t*q2)*(objects[i].points[1][1]) + (3*t2*q1)*objects[i].points[2][1] + t3*objects[i].points[2][1];
		        
		        if(clickPos[0] < x+10 & clickPos[0] > x-10){
		        	if(clickPos[1] < y+10 & clickPos[1] > y-10){
		        		//objects[i].selected = true;
		        		selected.push(i);
		        		break;
		        	}
		        }
		    }
		}else if(objects[i].type == "polygon"){

			let recPoints;
			let trianglePoints;
			let case1;

			if(objects[i].points[0][0] < objects[i].points[2][0] & objects[i].points[0][1] < objects[i].points[3][1]){
				recPoints = [objects[i].points[0], objects[i].points[2], objects[i].points[3], objects[i].points[5]];
				case1 = true;
			} else if(objects[i].points[0][0] > objects[i].points[2][0] & objects[i].points[0][1] > objects[i].points[3][1]){
				recPoints = [objects[i].points[0], objects[i].points[2], objects[i].points[3], objects[i].points[5]];
				case1 = true;
			} else if(objects[i].points[0][0] < objects[i].points[2][0] & objects[i].points[0][1] > objects[i].points[3][1]){
				recPoints = [objects[i].points[5], objects[i].points[3], objects[i].points[2], objects[i].points[0]];
			} else{
				recPoints = [objects[i].points[2], objects[i].points[0], objects[i].points[5], objects[i].points[3]];
			}

			function sign(p0, p1, p2){
				return (p0[0]-p2[0])*(p1[1]-p2[1])-(p1[0]-p2[0])*(p0[1]-p2[1]);
			}

			let d1, d2, d3;
			let has_neg, has_pos;

			for(let j = 0; j<4; j++){

				if(j == 0){
					d1 = sign(clickPos, recPoints[3], recPoints[0]);
					d2 = sign(clickPos, recPoints[0], recPoints[1]);
					d3 = sign(clickPos, recPoints[1], recPoints[3]);
				}else if(j == 1){
					d1 = sign(clickPos, recPoints[1], recPoints[2]);
					d2 = sign(clickPos, recPoints[2], recPoints[3]);
					d3 = sign(clickPos, recPoints[3], recPoints[1]);
				}else if(j == 2){
					if(case1){
						d1 = sign(clickPos, objects[i].points[1], objects[i].points[2]);
						d2 = sign(clickPos, objects[i].points[2], objects[i].points[0]);
						d3 = sign(clickPos, objects[i].points[0], objects[i].points[1]);
					}else{
						d1 = sign(clickPos, objects[i].points[1], objects[i].points[0]);
						d2 = sign(clickPos, objects[i].points[0], objects[i].points[2]);
						d3 = sign(clickPos, objects[i].points[2], objects[i].points[1]);
					}
				}else{
					if(case1){
						d1 = sign(clickPos, objects[i].points[4], objects[i].points[5]);
						d2 = sign(clickPos, objects[i].points[5], objects[i].points[3]);
						d3 = sign(clickPos, objects[i].points[3], objects[i].points[4]);
					}else{
						d1 = sign(clickPos, objects[i].points[4], objects[i].points[3]);
						d2 = sign(clickPos, objects[i].points[3], objects[i].points[5]);
						d3 = sign(clickPos, objects[i].points[5], objects[i].points[4]);
					}
				}

				if(d1 > 0 & d2 > 0 & d3 > 0){
					//objects[i].selected = true;
					selected.push(i);
					break;
				}
			}
		}else if(objects[i].type == "ellipse"){

			let a = Math.sqrt(Math.pow((objects[i].points[2][0]-objects[i].points[0][0]),2)+Math.pow((objects[i].points[2][1]-objects[i].points[0][1]),2));
			let b = Math.sqrt(Math.pow((objects[i].points[1][0]-objects[i].points[0][0]),2)+Math.pow((objects[i].points[1][1]-objects[i].points[0][1]),2));
			
			let number = Math.pow((Math.cos(objects[i].rotation)*(clickPos[0]-objects[i].points[0][0])+Math.sin(objects[i].rotation)*(clickPos[1]-objects[i].points[0][1])), 2)/Math.pow(a, 2)+
				Math.pow((Math.sin(objects[i].rotation)*(clickPos[0]-objects[i].points[0][0])-Math.cos(objects[i].rotation)*(clickPos[1]-objects[i].points[0][1])), 2)/Math.pow(b, 2);

			if(number <= 1){
				//objects[i].selected = true;
				selected.push(i);
			}
		}
	}
	
	if(selected.length >= 1){

		let highest = selected[0];

		for(let i = 1; i<selected.length; i++){
			if(selected[i]>highest){
				highest = selected[i];
			}
		}
		objects[highest].selected = true;
		highest = null;
	}
    
    clearAndDraw();
}


//function that deslects all objects
function deselect(){

    for(let i = 0; i<objects.length; i++){
        if(objects[i].selected == true){
            objects[i].selected = false;
        }
    }     
}


function deleteSelected(){
	if(isThereSelected()){
		if(getSelected().number == (objects.length-1)){
			objectMemory.push(getSelected());
			objects.splice(getSelected().number, 1);
			number -= 1;
			layer -= 1;
			deselect();
			clearAndDraw();
		}else{
			objectMemory.push(getSelected());
			let numberDeleted = getSelected().number;
			objects.splice(getSelected().number, 1);
			for(let i = (numberDeleted); i<objects.length; i++){
			objects[i].number -= 1;
			objects[i].layer -= 1;
			number -= 1;
			layer -= 1;
			deselect();
			clearAndDraw();
			}
		}
	}
}


//function that saves the current file
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}


//function that saves the current canvas
function save(){
	let modal = document.getElementById("myModal");
	let span = document.getElementsByClassName("close")[0];

	modal.style.display = "block";
	
	span.onclick = function() {
		modal.style.display = "none";
	}

	let fileName = document.getElementById("fileName");
	let saveButton = document.getElementById("saveFileBox");
	let cancelButton = document.getElementById("cancelSaveBox");

	data = JSON.stringify(objects);

	saveButton.onclick = function() {
		download(fileName.value+".JSON", data);
		modal.style.display = "none";

		if(newFileStatus){
			objects = [];
			clearAndDraw();
			newFileStatus = false;
			number = 0;
			layer = 0;
			clickCount = 0;
		}
	}

	cancelButton.onclick = function() {
		modal.style.display = "none";
		if(newFileStatus){
			objects = [];
			clearAndDraw();
			number = 0;
			layer = 0;
			clickCount = 0;
		}
	}
}

//function that resets the canvas and saves the file if desired
function newFile(){
	if(objects.length >= 1){
		newFileStatus = true;
		save();
	}else{
		objects = [];
		clearAndDraw();
		number = 0;
		layer = 0;
		clickCount = 0;
	}
}

function uploadFile(){

	let modal = document.getElementById("myModalUpload");
	let span = document.getElementsByClassName("closeTwo")[0];

	modal.style.display = "block";
	
	span.onclick = function() {
		modal.style.display = "none";
	}

	let importButton = document.getElementById("importButton");
	let cancelButton = document.getElementById("cancelUploadBox");


	importButton.onclick = function() {
		var files = document.getElementById('fileUpload').files;
		console.log(files);
		if (files.length <= 0) {
			return false;
		}

		var fr = new FileReader();

		fr.onload = function(e) { 
			console.log(e);
			var result = JSON.parse(e.target.result);
		    var formatted = JSON.stringify(result, null, 2);
		    console.log(formatted);
		    objects = JSON.parse(formatted);
		    clearAndDraw();
		}
		fr.readAsText(files.item(0));
		modal.style.display = "none";
	}

	cancelButton.onclick = function() {
		modal.style.display = "none";
	}
}



function selectedInfo(){

	let modal = document.getElementById( "selectedModal" );
	let span = document.getElementsByClassName("closeTwo")[0];

	modal.style.display = "block";

	document.getElementById("SelectedType").innerHTML = "Object Type: "+getSelected().type;
	document.getElementById("SelectedLayer").innerHTML = "Object Layer: "+getSelected().layer;
	document.getElementById("currentColor").value = getSelected().color;

	span.onclick = function() {
		modal.style.display = "none";
	}

	let infoButton = document.getElementById('infoButton');
	let cancelButton = document.getElementById("cancelInfoButton");


	cancelButton.onclick = function() {
		modal.style.display = "none";
	}
}

//listerner for changing the color of a selected object
function objectColorListener(){
	document.getElementById("currentColor").addEventListener("change", setColor)
}
function setColor(){
	color = document.getElementById( "currentColor" ).value.toString();
	console.log(color);
	getSelected().color = color;
	clearAndDraw();
}
window.addEventListener("load", objectColorListener, false);


//listener for changing the drawing color
function objectColorChange(){
	document.getElementById("drawingColor").addEventListener("change", changeColor)
}
function changeColor(){
	currentColor = document.getElementById( "drawingColor" ).value.toString();
	console.log(currentColor);
}
window.addEventListener("load", objectColorChange, false);


function changeStatus(){
	document.getElementById( "currently" ).innerHTML = "Status: "+currentFunction;
}


download_img = function(el) {
	var imageURI = canvas.toDataURL("image/jpg");
	el.href = imageURI;
};

function downloadImage(){
	var link = document.createElement('a');

	link.addEventListener('click', function(ev){
		link.href = canvas.toDataURL();
		link.download = "mypainting.jpeg";
	}, false);
	//link.href = canvas.toDataURL();
	//link.download = "mypainting.jpeg";
	link.click();

	//download.body.appendChild(link);
}





/*
*******

functions from the book

*******
*/
function radians( degrees ) {
    return degrees * Math.PI / 180.0;
}


function vec2()
{
    var result = _argumentsToArray( arguments );

    switch ( result.length ) {
    case 0: result.push( 0.0 );
    case 1: result.push( 0.0 );
    }

    return result.splice( 0, 2 );
}

function _argumentsToArray( args )
{
    return [].concat.apply( [], Array.prototype.slice.apply(args) );
}


function vec4()
{
    var result = _argumentsToArray( arguments );

    switch ( result.length ) {
    case 0: result.push( 0.0 );
    case 1: result.push( 0.0 );
    case 2: result.push( 0.0 );
    case 3: result.push( 1.0 );
    }

    return result.splice( 0, 4 );
}

//----------------------------------------------------------------------------
//
//  Matrix Constructors
//
//----------------------------------------------------------------------------

function mat4()
{
    var v = _argumentsToArray( arguments );

    var m = [];
    switch ( v.length ) {
    case 0:
        v[0] = 1;
    case 1:
        m = [
            vec4( v[0], 0.0,  0.0,   0.0 ),
            vec4( 0.0,  v[0], 0.0,   0.0 ),
            vec4( 0.0,  0.0,  v[0],  0.0 ),
            vec4( 0.0,  0.0,  0.0,  v[0] )
        ];
        break;

    default:
        m.push( vec4(v) );  v.splice( 0, 4 );
        m.push( vec4(v) );  v.splice( 0, 4 );
        m.push( vec4(v) );  v.splice( 0, 4 );
        m.push( vec4(v) );
        break;
    }

    m.matrix = true;

    return m;
}

//----------------------------------------------------------------------------
//
//  Generic Mathematical Operations for Vectors and Matrices
//
//----------------------------------------------------------------------------

function mult( u, v )
{
    var result = [];

    if ( u.matrix && v.matrix ) {
        if ( u.length != v.length ) {
            throw "mult(): trying to add matrices of different dimensions";
        }

        for ( var i = 0; i < u.length; ++i ) {
            if ( u[i].length != v[i].length ) {
                throw "mult(): trying to add matrices of different dimensions";
            }
        }

        for ( var i = 0; i < u.length; ++i ) {
            result.push( [] );

            for ( var j = 0; j < v.length; ++j ) {
                var sum = 0.0;
                for ( var k = 0; k < u.length; ++k ) {
                    sum += u[i][k] * v[k][j];
                }
                result[i].push( sum );
            }
        }

        result.matrix = true;

        return result;
    }

      if(u.matrix&& (u.length == v.length)) {
        for(var i = 0; i<v.length; i++) {
          var sum = 0.0;
          for(var j=0; j<v.length; j++) {
            sum += u[i][j]*v[j];
          }
          result.push(sum);
        }
      return result;
      }



    else {
        if ( u.length != v.length ) {
            throw "mult(): vectors are not the same dimension";
        }

        for ( var i = 0; i < u.length; ++i ) {
            result.push( u[i] * v[i] );
        }

        return result;
    }
}