// 1. declare frequency max
let freqMax = 5000;

// 2. Declare player to play a sample sound (like mp3 file)
const player = new Tone.Player("audio/Kalimba.mp3");

// 3. declare ping pong delay
const delay = new Tone.FeedbackDelay(0.3, 0.3);

// 4. declare low pass filterLowPass
const filterLowPass = new Tone.Filter(150, "lowpass");

// 5. declare high pass filter
const filterHighPass = new Tone.Filter(150, "highpass");

// 6. chain effects
player.chain(filterLowPass, filterHighPass, delay, Tone.Destination);

// 7. stop event listener
document.getElementById('audio-stop-button').addEventListener('click', function() {
    player.stop();
    console.log("Stop audio");
});

// 8. on click, play event listener
document.getElementById('audio-play-button').addEventListener('click', async () => {
    
    // 9. create audio context
    await Tone.start()
    console.log('Tone is ready');

    // 10. Wait for files to be loaded
    // Tone.loaded() returns a promise which resolves when all audio files are loaded.
    // It’s a helpful shorthand instead of waiting on each individual audio buffer’s onload event to resolve.
    Tone.loaded().then(() => {
        // 11. Play audio
        player.start();
        console.log('Player start');
    });

});

//  on mouse move, vary effects parameters functions of X / Y mouse position
document.body.addEventListener('mousemove', function(event) {
    // 12. vary ping pong delay on X axis
    delay.set({
        feedback: event.pageX / document.body.clientWidth,
    });

    // 13. calculate frequency functions of mouse position
    let freq = event.pageY / document.body.clientHeight * freqMax;
    
    // 14. vary low pass filterLowPass on Y axis  
    filterLowPass.set({
        frequency: freq,
    });
    
    // 15. vary high pass filterHighPass on Y axis    
    filterHighPass.set({
        frequency: freq,
    });
});
