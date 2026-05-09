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
  
  // After fade out, show the inner container again
  setTimeout(() => {
    innerContainer.style.display = 'flex';
    innerContainer.classList.remove('fade-out');
    // Show the envelope again after closing letter
    imageContent.style.display = 'none';
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
