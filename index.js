// Project insights
// 1. Using a webcam has security restrictions, it must be tied to secure origin( https ), local host is also a secure origin
// 2. index.html must be fed to local server
// 3. browser-sync allows us start a local server, and also gives a fresh reload feature
// 4. Filter works by, we get image out of canvas, change the RGB values and put them back in.
// 6. 

// MAIN TASK
// 1. Start a local server 
// 2. Get video from webcam into video element
// 3. From video element dump data into canvas every 16ms. 
// 4. Take data out of canvas as images
// 5. Work on filters 

// SUB TASK
// 1. make dimensions of canvas the same as video
// 2. every 16ms take image from video element and put it into canvas
// 3. to take data out of canvas( i.e photos ), create link and photo
// 4. 


const video = document.querySelector('.player');                //grabbing video
const canvas = document.querySelector('.photo');                //grabbing canvas
const ctx = canvas.getContext('2d');                            
const strip = document.querySelector('.strip');                 //grab div
const snap = document.querySelector('.snap');                   //grab audio



function getVideo()
{

    navigator.mediaDevices.getUserMedia({video: true, audio: false})        //returns a promise
    .then( function (localMediaStream){                                     //then deals with promise
        console.log(localMediaStream);
        //localMediaStream is an object, video needs to be converted or use 
        video.srcObject = localMediaStream;
        video.play();
        
    })
    //if something does not allow to use a webcam
    .catch(function(err)
    {

        console.error(`OH NO!!!`,err);

    })


    


}


function paintToCanvas()
{
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    return setInterval(function(){
        ctx.drawImage(video, 0,0, width, height);

        //since we need to reassign pixels of array
        //take the pixels out
        let pixels = ctx.getImageData(0,0,width,height);

        //apply filter
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        pixels =  greenScreen(pixels);
        // ctx.globalAlpha = 0.1;

        //put them back
        ctx.putImageData(pixels,0,0);
    },16)

}




function takePhoto()
{
    //played the sound
    snap.currentTime = 0;
    snap.play();

    //take the data out of canvas   
    //1. create an image and 2. create a link

    //create image
    const data = canvas.toDataURL("images/jpeg");
    
    //create link
    const link = document.createElement("a");
    link.href= data;
    link.setAttribute("Download","handsome");
    link.innerHTML = `<img src="${data}" alt="handsome-man" >`;
    strip.insertBefore(link, strip.firstChild);

  
    

}

//filter functions

function redEffect(pixels)
{
    for(let i=0; i<pixels.data.length; i+=4)
    {
        pixels.data[i+0] = pixels.data[i+0] + 100; //red channel
        pixels.data[i + 1] = pixels.data[i+1] - 50; //green
        pixels.data[i+2] = pixels.data[i+2] * 0.5; //blue
    }

    return pixels;


}


function rgbSplit(pixels)
{

    for(let i=0; i<pixels.data.length; i+=4)
    {
        pixels.data[i -150] = pixels.data[i+0] + 100; //red channel
        pixels.data[i + 500] = pixels.data[i+1] - 50; //green
        pixels.data[i - 500] = pixels.data[i+2] * 0.5; //blue
    }

    return pixels;


}


function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }
  


getVideo();

// if video plays, call painttoCanvas method
video.addEventListener("canplay",paintToCanvas);
