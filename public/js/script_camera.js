
// The width and height of the captured photo. We will set the
// width to the value defined here, but the height will be
// calculated based on the aspect ratio of the input stream.

const width = 1280; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

let streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.

let video = null;
let canvas = null;
let photo = null;
let startbutton = null;
let backgroud_id = null;
let imgNoBg_id = null;

function showViewLiveResultButton() {
    if (window.self !== window.top) {
        // Ensure that if our document is in a frame, we get the user
        // to first open it in its own tab or window. Otherwise, it
        // won't be able to request permission for camera access.
        document.querySelector(".contentarea").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener("click", () => window.open(location.href));
        return true;
    }
    return false;
}

function startup() {
    // Llenar el select al cargar la página
    if (showViewLiveResultButton()) {
        return;
    }
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("photo");
    imgNoBg_id = document.getElementById('imgNoBg-cont');
    backgroud_id = document.getElementById("background_id");
    startbutton = document.getElementById("startbutton");
    
    // call selectDevice
    getVideoDevices();
    let selectedDeviceId = setSelectedDevice(); 
    console.log(selectedDeviceId);
    
    navigator.mediaDevices
    .getUserMedia({ video: { deviceId: { exact: selectedDeviceId } }, width: { ideal: 1280 }, 
    height: { ideal: 720 }, audio: false })
    .then((stream) => {
        video.srcObject = stream;
        video.play();
    })
    .catch((err) => {
        console.error(`An error occurred: ${err}`);
    });

    video.addEventListener(
    "canplay",
    (ev) => {
        if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
        if (isNaN(height)) {
            height = width / (4 / 3);
        }
        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
        }
    },
    false,
    );

    video.onloadedmetadata = () => {
        const width = video.videoWidth;
        const height = video.videoHeight;
        console.log(`Resolución de video: ${width}x${height}`);
    }
    startbutton.addEventListener(
    "click",
    (ev) => {
        takepicture();
        ev.preventDefault();
    },
    false,);
    clearphoto();
}

// Fill the photo with an indication that none has been captured.
function clearphoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/png");
    //photo.setAttribute("src", data);
}
// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

async function takepicture() {
    const context = canvas.getContext("2d");
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video,0, 0, width, height);
        let data = canvas.toDataURL("image/png");
        removeBackground(data);

    } else {
        clearphoto();
    }
}

async function removeBackground(imageData) {
    // Logique: z35eCyZGqmz7LPopmdtt7WXm
    // Boa: pnkCA53sgQTCca1htxkX7MJB
    const apiKey = "z35eCyZGqmz7LPopmdtt7WXm"; // Reemplaza con tu propia API key
    fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_file_b64: imageData.split(",")[1],
      }),
    })
      .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setResult(url);
        })
      .catch((err) => {
        console.error("Error al quitar el fondo: ", err);
        return(null)
      });
  }

function setResult(imgNoBg){
    imgNoBg_id.src = imgNoBg;
    imgNoBg_id.style.display = 'block';
}
async function getVideoDevices() {
    try {
      // Solicitar permisos para acceder a los dispositivos de medios
      await navigator.mediaDevices.getUserMedia({ video: true });

      // Obtener la lista de dispositivos de medios
      const devices = await navigator.mediaDevices.enumerateDevices();

      // Filtrar solo los dispositivos de entrada de video (cámaras)
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      return videoDevices;
    } catch (error) {
      console.error('Error al obtener dispositivos de video:', error);
      return [];
    }
}

async function populateVideoDeviceSelect() {
    document.getElementById('startButton').addEventListener('click', setSelectedDevice);
    const videoDevices = await getVideoDevices();
    const selectElement = document.getElementById('videoInputSelect');

    // Vaciar el contenido del select
    selectElement.innerHTML = '';

    // Agregar una opción para cada dispositivo de video
    videoDevices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Cámara ${index + 1}`;
        selectElement.appendChild(option);
    });
    startup();
}

function setSelectedDevice() {
    const selectElement = document.getElementById('videoInputSelect');
    const selectedDeviceId = selectElement.value;
    console.log('Dispositivo de video seleccionado:', selectedDeviceId);

    // Puedes almacenar el dispositivo seleccionado en una variable global o usarlo como necesites
    return selectedDeviceId;
    //window.selectedVideoDevice = selectedDeviceId;
}

// Set up our event listener to run the startup process
// once loading is complete.
window.addEventListener("load", populateVideoDeviceSelect, false);
