// =============================================
// STEP 1: Set up the image array 
// =============================================
// Array of all images to cycle through
// Customize these paths to your own images
const images = [
  './assets/image-content/image-1.png',
  './assets/image-content/image-2.png',
  './assets/image-content/image-3.png',
  './assets/image-content/image-4.png',
  './assets/image-content/image-5.png',
  './assets/image-content/image-6.png'
];

// =============================================
// STEP 2: Reference HTML elements 
// =============================================
// Connect to the elements we need to change
const imageContent = document.querySelector('.image-content');  // Image container
const mainButton = document.getElementById('main-button');      // Image switch button
const finalMessage = document.querySelector('.final-message');  // Final message

// Letter feature elements
const envelopeContainer = document.querySelector('.envelope-container');  // Envelope container
const envelopeAnimation = document.querySelector('.envelope-animation'); // Envelope animation
const stamp = document.querySelector('.stamp');                          // Stamp (clickable)
const letterModal = document.getElementById('letterModal');              // Letter modal
const letterCloseBtn = document.getElementById('letterCloseBtn');        // Letter close button
const innerContainer = document.querySelector('.inner-container');       // Inner container for fade effect
const restartBtn = document.getElementById('restart-btn');               // Restart button
const replayScreen = document.getElementById('replayScreen');            // Replay screen
const replayBtn = document.getElementById('replayBtn');                  // Replay button

// =============================================
// STEP 3: Track what image we're at 
// =============================================
// Start with the first image (index 0)
let currentIndex = 0;

// Envelope animation frames
const envelopeFrames = [
  './assets/envelope_animation/sprite_0.png',
  './assets/envelope_animation/sprite_1.png',
  './assets/envelope_animation/sprite_2.png',
  './assets/envelope_animation/sprite_3.png',
  './assets/envelope_animation/sprite_4.png',
  './assets/envelope_animation/sprite_5.png',
  './assets/envelope_animation/sprite_6.png',
];

let isEnvelopeOpen = false;

// =============================================
// STEP 4: Update image function 
// =============================================
// Function to change images with fade effect
function updateImage() {
  // Fade out current image
  imageContent.style.opacity = 0;
  
  // Preload next image
  const img = new Image();
  img.src = images[currentIndex];
  
  // When image is loaded
  img.onload = () => {
    // Change to new image
    imageContent.style.backgroundImage = `url('${images[currentIndex]}')`;
    
    // Fade in new image
    imageContent.style.opacity = 1;
  };
}

// =============================================
// STEP 5: Initial image display 
// =============================================
// Show first image when page loads
updateImage();

// =============================================
// STEP 6: Envelope Animation Function
// =============================================
// Play envelope animation after final image
function playEnvelopeAnimation() {
  // Instantly hide the flower/bunny image (no fade)
  imageContent.style.display = 'none';
  envelopeContainer.classList.add('active');
  
  // Preload all envelope frames
  let loadedFrames = 0;
  envelopeFrames.forEach((frameSrc) => {
    const img = new Image();
    img.onload = () => {
      loadedFrames++;
    };
    img.src = frameSrc;
  });
  
  let frameIndex = 0;
  
  // Function to display each frame
  function showFrame() {
    envelopeAnimation.style.backgroundImage = `url('${envelopeFrames[frameIndex]}')`;
    frameIndex++;
    
    // Continue animation until we reach the last frame
    if (frameIndex < envelopeFrames.length) {
      setTimeout(showFrame, 500); // Change frame every 0.5 seconds (500ms)
    } else {
      // Freeze on last frame when animation is complete
      // Enable clicking on the envelope now that animation is done
      stamp.style.pointerEvents = 'auto';
      isEnvelopeOpen = false; // Animation complete, stamp is now clickable
    }
  }
  
  showFrame();
}

// =============================================
// STEP 7: Stamp Click Handler (opens letter)
// =============================================
stamp.addEventListener('click', () => {
  // Fade out the entire inner container
  innerContainer.classList.add('fade-out');
  
  // After fade out, show the letter modal
  setTimeout(() => {
    innerContainer.style.display = 'none';
    letterModal.classList.add('active');
  }, 500);
});

// =============================================
// STEP 8: Letter Close Button Handler
// =============================================
letterCloseBtn.addEventListener('click', () => {
  // Fade out letter modal
  letterModal.classList.remove('active');
  
  // After fade out, show the replay screen
  setTimeout(() => {
    replayScreen.classList.add('active');
    // Initialize background position to center when replay screen becomes active
    requestAnimationFrame(() => {
      const dims = getBackgroundDimensions();
      const screenWidth = replayScreen.offsetWidth;
      const screenHeight = replayScreen.offsetHeight;
      backgroundPosX = Math.max(0, (dims.width - screenWidth) / 2);
      backgroundPosY = Math.max(0, (dims.height - screenHeight) / 2);
      updateBackgroundPosition();
    });
  }, 500);
});

// Close letter when clicking outside the modal content
letterModal.addEventListener('click', (event) => {
  if (event.target === letterModal) {
    letterCloseBtn.click();
  }
});

// =============================================
// STEP 9: Button click handler 
// =============================================
// Change image when button is clicked
mainButton.addEventListener('click', () => {
  // Go to next image
  currentIndex++;
  
  // Update if not at the end
  if (currentIndex < images.length) {
    updateImage();
  }
  
  // Once at the last image, show the envelope animation and hide the button 
  if (currentIndex === images.length - 1) {
    mainButton.style.display = 'none';
    finalMessage.style.display = 'none';
    playEnvelopeAnimation();
  }
});

// =============================================
// STEP 10: Restart button handler
// =============================================
// Restart the entire animation sequence
function restartSequence() {
  // Reset image index
  currentIndex = 0;
  
  // Reset and show image content
  imageContent.style.display = 'flex';
  imageContent.style.opacity = 1;
  updateImage();
  
  // Hide envelope container and reset flag
  envelopeContainer.classList.remove('active');
  isEnvelopeOpen = false;
  stamp.style.pointerEvents = 'none';
  
  // Show button and hide final message
  mainButton.style.display = 'flex';
  finalMessage.style.display = 'none';
  
  // Hide letter modal if open
  letterModal.classList.remove('active');
  letterModal.style.display = '';
  innerContainer.style.display = 'flex';
  innerContainer.classList.remove('fade-out');
  
  // Hide replay screen and reset background position
  replayScreen.classList.remove('active');
  backgroundPosX = 0;
  backgroundPosY = 0;
}

restartBtn.addEventListener('click', restartSequence);

// =============================================
// STEP 11: Replay button handler (shown after letter)
// =============================================
replayBtn.addEventListener('click', restartSequence);

// =============================================
// STEP 12: Replay Screen Panning and Scrolling
// =============================================
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let backgroundPosX = 0;
let backgroundPosY = 0;
const imageAspectRatio = 1920 / 1080; // Background image aspect ratio

// Function to calculate actual background dimensions with cover sizing
function getBackgroundDimensions() {
  const screenWidth = replayScreen.offsetWidth;
  const screenHeight = replayScreen.offsetHeight;
  const screenAspectRatio = screenWidth / screenHeight;
  
  let bgWidth, bgHeight;
  
  // With background-size: cover, the image must cover the entire viewport
  if (screenAspectRatio > imageAspectRatio) {
    // Screen is wider than image - scale to match width
    bgWidth = screenWidth;
    bgHeight = bgWidth / imageAspectRatio;
  } else {
    // Screen is narrower (taller) than image - scale to match height
    bgHeight = screenHeight;
    bgWidth = bgHeight * imageAspectRatio;
  }
  
  return { width: bgWidth, height: bgHeight };
}

// Function to check if panning should be enabled
function canPan() {
  const dims = getBackgroundDimensions();
  const screenWidth = replayScreen.offsetWidth;
  const screenHeight = replayScreen.offsetHeight;
  return dims.width > screenWidth || dims.height > screenHeight;
}

// Function to update scroll position and apply clamps
function updateBackgroundPosition() {
  const dims = getBackgroundDimensions();
  const screenWidth = replayScreen.offsetWidth;
  const screenHeight = replayScreen.offsetHeight;
  
  // Calculate how much extra space the background takes up
  const maxOffsetX = Math.max(0, dims.width - screenWidth);
  const maxOffsetY = Math.max(0, dims.height - screenHeight);
  
  // Clamp position
  backgroundPosX = Math.max(0, Math.min(backgroundPosX, maxOffsetX));
  backgroundPosY = Math.max(0, Math.min(backgroundPosY, maxOffsetY));
  
  replayScreen.style.backgroundPosition = `${-backgroundPosX}px ${-backgroundPosY}px`;
}

// Mouse down - start panning
document.addEventListener('mousedown', (e) => {
  // Only pan if mousedown happened on replay screen
  if (!replayScreen.classList.contains('active')) {
    return;
  }
  
  // Don't start panning if clicking the replay button itself
  if (e.target === replayBtn || replayBtn.contains(e.target)) {
    return;
  }
  
  // Check if click was actually on the replay screen
  const rect = replayScreen.getBoundingClientRect();
  if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
    return;
  }
  
  isPanning = true;
  panStartX = e.clientX;
  panStartY = e.clientY;
  replayScreen.style.cursor = 'grabbing';
});

// Mouse move - pan the view
document.addEventListener('mousemove', (e) => {
  if (!isPanning) return;
  
  const deltaX = e.clientX - panStartX;
  const deltaY = e.clientY - panStartY;
  
  backgroundPosX -= deltaX;
  backgroundPosY -= deltaY;
  
  updateBackgroundPosition();
  
  panStartX = e.clientX;
  panStartY = e.clientY;
});

// Mouse up - stop panning
document.addEventListener('mouseup', () => {
  isPanning = false;
  replayScreen.style.cursor = '';
});

// Scroll wheel - pan the view
document.addEventListener('wheel', (e) => {
  if (!replayScreen.classList.contains('active')) return;
  
  // Check if scroll was over the replay screen
  const rect = replayScreen.getBoundingClientRect();
  if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
    return;
  }
  
  e.preventDefault();
  const scrollDelta = 30;
  
  // Vertical scroll
  backgroundPosY += e.deltaY > 0 ? scrollDelta : -scrollDelta;
  
  // Horizontal scroll (if shift key is pressed)
  if (e.shiftKey) {
    backgroundPosX += e.deltaX > 0 ? scrollDelta : -scrollDelta;
  } else {
    backgroundPosX += e.deltaX * 0.5;
  }
  
  updateBackgroundPosition();
}, { passive: false });
