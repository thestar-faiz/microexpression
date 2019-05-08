// Based on https://github.com/Affectiva/js-sdk-sample-apps
// https://jsfiddle.net/affectiva/opyh5e8d/show/

/*
    SDK Needs to create video and canvas nodes in the DOM in order to function
    Here we are adding those nodes a predefined div.
*/
var divRoot = $("#affdex_elements")[0];
// var width = 640; // The captured frame's width in pixels        
// var height = 480; // The captured frame's height in pixels
// var width = 1000; // The captured frame's width in pixels        
// var height = 600; // The captured frame's height in pixels
var width = window.innerWidth; // The captured frame's width in pixels        
var height = window.innerHeight; // The captured frame's height in pixels

/*
   Face detector configuration - If not specified, defaults to
   affdex.FaceDetectorMode.LARGE_FACES
   affdex.FaceDetectorMode.LARGE_FACES=Faces occupying large portions of the frame
   affdex.FaceDetectorMode.SMALL_FACES=Faces occupying small portions of the frame
*/
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;

//Construct a CameraDetector and specify the image width / height and face detector mode.
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

detector.detectExpressions.smile = true; // Track smiles
detector.detectEmotions.joy = true; // Track joy emotion
detector.detectEmotions.surprise = true; // Track surprise emotion
// detector.detectEmotions.sadness = true; // Track sadness emotion
// detector.detectEmotions.anger = true; // Track anger emotion
// detector.detectAllEmotions();
detector.detectAppearance.gender = true; // Detect person's gender

//Add a callback to notify when the detector is initialized and ready for runing.
detector.addEventListener("onInitializeSuccess", function () {
    log('#logs', "The detector reports initialized");
    //Display canvas instead of video feed because we want to draw the feature points on it
    // $("#face_video_canvas").css("display", "block");
    // $("#face_video_canvas").css("width", "1000");
    // $("#face_video_canvas").css("height", "600");
    $("#face_video_canvas").css("width", width);
    $("#face_video_canvas").css("height", height);
    $("#face_video_canvas").css("display", "block");
    $("#face_video").css("display", "none");
});

function log(node_name, msg) {
    $(node_name).append("<span>" + msg + "</span><br />")
    // console.log(node_name, msg);
}

//function executes when Start button is pushed.
function onStart() {
    if (detector && !detector.isRunning) {
        $("#logs").html("");
        detector.start();
    }
    log('#logs', "Clicked the start button");
}

//function executes when the Stop button is pushed.
function onStop() {
    log('#logs', "Clicked the stop button");
    if (detector && detector.isRunning) {
        detector.removeEventListener();
        detector.stop();
    }
};

//function executes when the Reset button is pushed.
function onReset() {
    log('#logs', "Clicked the reset button");
    if (detector && detector.isRunning) {
        detector.reset();

        $('#results').html("");
    }
};

detector.addEventListener("onWebcamConnectSuccess", function () {
    console.log("I was able to connect to the camera successfully.");
});

detector.addEventListener("onWebcamConnectFailure", function () {
    console.log("I've failed to connect to the camera :(");
});

//Add a callback to notify when detector is stopped
detector.addEventListener("onStopSuccess", function () {
    log('#logs', "The detector reports stopped");
    $("#results").html("");
});

//Add a callback to receive the results from processing an image.
//The faces object contains the list of the faces detected in an image.
//Faces object contains probabilities for all the different expressions, emotions and appearance metrics
detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {
    $('#results').html("");
    log('#results', "Timestamp: " + timestamp.toFixed(2));
    log('#results', "Number of faces found: " + faces.length);
    if (faces.length > 0) {
        log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
        log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function (key, val) {
            return val.toFixed ? Number(val.toFixed(0)) : val;
        }));
        log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function (key, val) {
            return val.toFixed ? Number(val.toFixed(0)) : val;
        }));
        log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
        if ($('#face_video_canvas')[0] != null) {
            drawFeaturePoints(image, faces[0].featurePoints, faces[0].emotions);
        }            
    }
});

//Draw the detected facial feature points on the image
function drawFeaturePoints(img, featurePoints, emotions) { //console.log(img, featurePoints);
    var contxt = $('#face_video_canvas')[0].getContext('2d');

    // var hRatio = contxt.canvas.width / img.width;
    // var vRatio = contxt.canvas.height / img.height;
    // var ratio = Math.min(hRatio, vRatio);

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

    drawBox(box);

    var emoji_pt = { x: contxt.canvas.width * 0.05, y: contxt.canvas.height * 0.95 };    
    contxt.font = '60px Arial';
    contxt.fillStyle = 'white';    
    var emotionsObj = JSON.parse(JSON.stringify(emotions, function (key, val) { return val.toFixed ? Number(val.toFixed(0)) : val; }));    

    // https://getemoji.com/   
    contxt.fillText(`😀: ${emotionsObj['joy']} 😲: ${emotionsObj['surprise']}`, emoji_pt.x, emoji_pt.y);
    
    function drawBox(box) {
        contxt.strokeStyle = "red";
        contxt.moveTo(box[0].x, box[0].y);
        contxt.lineTo(box[1].x, box[1].y);
        contxt.lineTo(box[2].x, box[2].y);
        contxt.lineTo(box[3].x, box[3].y);
        contxt.lineTo(box[0].x, box[0].y);
        contxt.stroke();

        contxt.strokeStyle = "yellow";
        for (var pt in box) {
            contxt.beginPath();
            contxt.arc(box[pt].x,
                box[pt].y, 2, 0, 2 * Math.PI);
            contxt.stroke();
        }
    }    
}

// $('#start').click();
onStart();