document.addEventListener('DOMContentLoaded', () => {
    const appDiv = document.getElementById('app');
    let currentPage = 1;
  
    const renderPage1 = () => {
      appDiv.innerHTML = `
        <div class="page1">
          <button id="startButton" class="btn btn-primary btn-lg">Iniciar</button>
        </div>
      `;
  
      document.getElementById('startButton').addEventListener('click', () => {
        currentPage = 2;
        renderPage2();
      });
    };
  
    const renderPage2 = () => {
      appDiv.innerHTML = `
        <div class="page2 position-relative">
        <button id="snapButton" class="btn btn-danger position-absolute top-50 start-50 translate-middle">Next</button>
        <button id="takePic" class="btn btn-danger position-absolute top-30 start-30 translate-middle">Tomar foto</button>

          <div>
            <label for="videoInputSelect">Elige una cámara:</label>
            <select id="videoInputSelect"></select>
            <button id="startButton">Seleccionar</button>
          </div>
    
          <div class="contentarea">
            <h1>Foto</h1>
            <p>
              text of the app
            </p>
            <div class="camera">
              <video id="video">Video stream not available.</video>
              <button id="startbutton">Take photo</button>
            </div>
        
          <canvas id="canvas"> </canvas>
          <div class="output">
            <img id="photo" alt="The screen capture will appear in this box." />
      
          </div>
    
          <div style="position: relative; left: 0; top: 0;">
            <img id="imgNoBg-cont" class='imgNoBg'/>
            <img id="Fondo-cont" src="../images/F.jpg" class="Fondo"/>
          </div>
        </div>
      </div>
      <script src="js/script_camera.js" charset="utf-8"></script>
      `;
      const snapButton = document.getElementById("snapButton");
      
      snapButton.addEventListener('click', () => {
        currentPage = 3;
        renderPage3();
      });
    };
      
  
    const renderPage3 = () => {
      appDiv.innerHTML = `
        <div class="page3">
          <canvas id="editCanvas" width="640" height="480"></canvas>
          <button id="doneButton" class="btn btn-success mt-3">LISTO</button>
        </div>
      `;
  
      
      document.getElementById('doneButton').addEventListener('click', () => {
        currentPage = 4;
        renderPage4(editCanvas.toDataURL());
      });
    };
  
    const renderPage4 = (imgData) => {
      appDiv.innerHTML = `
        <div class="page4">
          <img src="${imgData}" class="img-fluid" alt="Edited Image">
          <div class="mt-3">
            <button id="downloadButton" class="btn btn-primary">Descargar</button>
            <button id="emailButton" class="btn btn-secondary">Compartir por Correo</button>
            <button id="qrButton" class="btn btn-info">Compartir por QR</button>
          </div>
        </div>
      `;
  
      document.getElementById('downloadButton').addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = imgData;
        a.download = 'photo.png';
        a.click();
      });
  
      document.getElementById('emailButton').addEventListener('click', () => {
        window.location.href = `mailto:?subject=Tu%20Foto&body=Aquí%20está%20tu%20foto%20${encodeURIComponent(imgData)}`;
      });
  
      document.getElementById('qrButton').addEventListener('click', () => {
        currentPage = 5;
        renderPage5();
      });
    };
  
    const renderPage5 = () => {
      appDiv.innerHTML = `<div class="page5"></div>`;
    };
  
    renderPage1();
  });
  

/* 
  const video = document.getElementById('video');
      const canvas = document.getElementById('canvas');
      const snapButton = document.getElementById('snapButton');
      const takePic = document.getElementById('takePic');
      const context = canvas.getContext('2d');

      // Acceder a la cámara web
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });
  
      // Tomar foto
      takePic.addEventListener('click', () => {
        context.drawImage(video, 0, 0, 1920, 1080);
        canvas.style.display = 'block';
        video.style.display = 'none';
      });
      //Next
      snapButton.addEventListener('click', () => {
        currentPage = 3;
        renderPage3();
      });
    }; */