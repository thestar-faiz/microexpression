var divRoot = $("#affdex_elements")[0];
var width = window.innerWidth;   
var height = window.innerHeight;
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

detector.detectEmotions.anger = true;
detector.detectEmotions.disgust = true;
detector.detectEmotions.fear = true;
detector.detectEmotions.joy = true;
detector.detectEmotions.sadness = true;
detector.detectEmotions.surprise = true;

detector.detectAppearance.glasses = true;

detector.addEventListener("onInitializeSuccess", function () {    
    $("#face_video_canvas").css("width", width);
    $("#face_video_canvas").css("height", height);
    $("#face_video_canvas").css("display", "block");
    $("#face_video").css("display", "none");
});

detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {
    // console.log('results...');
    if (faces.length > 0) {        
        if ($('#face_video_canvas')[0] != null) {
            drawFeaturePoints(image, faces[0].featurePoints, faces[0].emotions, faces[0].emojis.dominantEmoji, faces[0].appearance);
        }            
    }
});

//Draw the detected facial feature points on the image
function drawFeaturePoints(img, featurePoints, emotions, emoji, appearance) { 
    var contxt = $('#face_video_canvas')[0].getContext('2d');
    var pointX = [];
    var pointY = [];

    contxt.strokeStyle = "#FFFFFF";
    for (var id in featurePoints) {
        contxt.beginPath();
        contxt.arc(featurePoints[id].x,
            featurePoints[id].y, 2, 0, 2 * Math.PI);
        contxt.stroke();

        pointX.push(Math.round(featurePoints[id].x));
        pointY.push(Math.round(featurePoints[id].y));
    }

    var box = {
        0: { x: Math.min(...pointX), y: Math.min(...pointY) },
        1: { x: Math.max(...pointX), y: Math.min(...pointY) },
        2: { x: Math.max(...pointX), y: Math.max(...pointY) },
        3: { x: Math.min(...pointX), y: Math.max(...pointY) }
    };    

    var emotionsObj = JSON.parse(JSON.stringify(emotions, function (key, val) { return val.toFixed ? Number(val.toFixed(0)) : val; }));
    // console.log(emotionsObj);

    drawBox(box);
    
    contxt.font = '20px Arial';
    
    contxt.fillStyle = 'orange';
    contxt.fillText(`ANGER`, box[0].x, box[0].y - 200);
    if (emotionsObj['anger'] > 50) {
        contxt.fillStyle = 'green';
        contxt.fillRect(box[0].x, box[0].y - 200, 80, 20);
    }    
    contxt.fillStyle = 'black';
    contxt.fillText(`${emotionsObj['anger']}%`, box[0].x + 20, box[0].y - 180);
    
    contxt.fillStyle = 'orange';
    contxt.fillText(`DISGUST`, box[0].x, box[0].y - 140);
    if (emotionsObj['disgust'] > 50) {
        contxt.fillStyle = 'green';
        contxt.fillRect(box[0].x, box[0].y - 140, 80, 20);
    }    
    contxt.fillStyle = 'black';
    contxt.fillText(`${emotionsObj['disgust']}%`, box[0].x + 20, box[0].y - 120); 

    contxt.fillStyle = 'orange';
    contxt.fillText(`FEAR`, box[0].x, box[0].y - 80);
    if (emotionsObj['fear'] > 50) {
        contxt.fillStyle = 'green';
        contxt.fillRect(box[0].x, box[0].y - 80, 80, 20);
    }
    contxt.fillStyle = 'black';
    contxt.fillText(`${emotionsObj['fear']}%`, box[0].x + 20, box[0].y - 60);
    
    contxt.fillStyle = 'orange';
    contxt.fillText(`JOY`, box[0].x + 100, box[0].y - 200);
    if (emotionsObj['joy'] > 50) {
        contxt.fillStyle = 'green';
        contxt.fillRect(box[0].x + 100, box[0].y - 200, 80, 20);
    }    
    contxt.fillStyle = 'black';
    contxt.fillText(`${emotionsObj['joy']}%`, box[0].x + 100 + 20, box[0].y - 180);

    contxt.fillStyle = 'orange';
    contxt.fillText(`SADNESS`, box[0].x + 100, box[0].y - 140);
    if (emotionsObj['sadness'] > 50) {
        contxt.fillStyle = 'green';
        contxt.fillRect(box[0].x + 100, box[0].y - 140, 80, 20);
    }
    contxt.fillStyle = 'black';
    contxt.fillText(`${emotionsObj['sadness']}%`, box[0].x + 100 + 20, box[0].y - 120);
    
    contxt.fillStyle = 'orange';
    contxt.fillText(`SURPRISE`, box[0].x + 100, box[0].y - 80);
    if (emotionsObj['surprise'] > 50) {
        contxt.fillStyle = 'green';
        contxt.fillRect(box[0].x + 100, box[0].y - 80, 80, 20);
    }    
    contxt.fillStyle = 'black';
    contxt.fillText(`${emotionsObj['surprise']}%`, box[0].x + 100 + 20, box[0].y - 60);
    
    // draw emojis
    contxt.font = '40px Arial';
    contxt.fillText(`${emoji}`, box[1].x + 20, box[1].y + 20);
    if (appearance.glasses === "Yes") {
        contxt.fillText(`😎`, box[2].x + 20, box[2].y);
    }    
    
    function drawBox(box) {
        contxt.strokeStyle = "white";
        if (emotionsObj['anger'] > 50
         || emotionsObj['disgust'] > 50
         || emotionsObj['fear'] > 50
         || emotionsObj['joy'] > 50
         || emotionsObj['sadness'] > 50
         || emotionsObj['surprise'] > 50         
        ) {
            contxt.strokeStyle = "green";
        }

        contxt.moveTo(box[0].x, box[0].y);
        contxt.lineTo(box[1].x, box[1].y);
        contxt.lineTo(box[2].x, box[2].y);
        contxt.lineTo(box[3].x, box[3].y);
        contxt.lineTo(box[0].x, box[0].y);
        contxt.stroke();        
    }    
}

if (detector && !detector.isRunning) {
    detector.start();
}