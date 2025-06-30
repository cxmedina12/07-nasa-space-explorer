// NASA APOD API configuration
const NASA_API_KEY = 'N3aNLZIRl4qxvzvvFexhwb68Jjg7i5VgTUYVW0fE';
const NASA_APOD_BASE_URL = 'https://api.nasa.gov/planetary/apod';

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Get the button and gallery elements
const getImagesButton = document.getElementById('getImages');
const gallery = document.getElementById('gallery');

// Array of fun space facts
const spaceFacts = [
  "One day on Venus is longer than its year! Venus takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun.",
  "Jupiter's Great Red Spot is a storm that has been raging for over 300 years and is bigger than Earth!",
  "A single teaspoon of neutron star material would weigh about 6 billion tons on Earth.",
  "There are more stars in the universe than grains of sand on all the beaches on Earth.",
  "Saturn's moon Titan has lakes and rivers made of liquid methane instead of water.",
  "The footprints left by Apollo astronauts on the Moon will last for millions of years because there's no wind to blow them away.",
  "The International Space Station travels at 17,500 mph and orbits Earth every 90 minutes.",
  "Mars has the largest volcano in the solar system - Olympus Mons is nearly 3 times taller than Mount Everest!",
  "The Milky Way galaxy is on a collision course with the Andromeda galaxy, but don't worry - it won't happen for 4.5 billion years!",
  "Space is completely silent because sound needs air to travel, and there's no air in the vacuum of space."
];

// Function to display a random space fact
function displayRandomFact() {
  // Get a random index from the spaceFacts array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  
  // Get the fact element and display the random fact
  const factElement = document.getElementById('randomFact');
  factElement.textContent = spaceFacts[randomIndex];
}

// Display a random fact when the page loads
displayRandomFact();

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Add event listener to the "Get Images" button
getImagesButton.addEventListener('click', function() {
  // Get the selected start and end dates from the input fields
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  // Make sure both dates are selected before fetching images
  if (startDate && endDate) {
    // Call function to fetch NASA images for the selected date range
    fetchImages(startDate, endDate);
  } else {
    // Show a message if dates are not selected
    alert('Please select both start and end dates!');
  }
});

// Function to fetch NASA images for a given date range
function fetchImages(startDate, endDate) {
  // Show loading message while fetching data
  gallery.innerHTML = `
    <div class="loading">
      <div class="loading-icon">�</div>
      <p>Loading space photos...</p>
    </div>
  `;
  
  // Build the API URL with date range and API key
  const apiUrl = `${NASA_APOD_BASE_URL}?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;
  
  // Make the fetch request to NASA API
  fetch(apiUrl)
    .then(response => {
      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Failed to fetch NASA images');
      }
      // Convert response to JSON
      return response.json();
    })
    .then(data => {
      // Pass the fetched data to display function
      displayGallery(data);
    })
    .catch(error => {
      // Handle any errors that occur during fetch
      console.error('Error fetching NASA images:', error);
      gallery.innerHTML = `
        <div class="error">
          <div class="error-icon">❌</div>
          <p>Sorry, we couldn't load the space images. Please try again!</p>
        </div>
      `;
    });
}

// Function to display NASA images in the gallery
function displayGallery(data) {
  // Clear the loading message by emptying the gallery
  gallery.innerHTML = '';
  
  // Loop through each NASA image in the data array
  data.forEach(function(nasaImage) {
    // Create a new div element for each image card
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';
    
    // Build the HTML content for each image card
    imageCard.innerHTML = `
      <div class="image-container">
        ${nasaImage.media_type === 'image' ? 
          `<img src="${nasaImage.url}" alt="${nasaImage.title}" class="space-image" />` :
          `<div class="video-placeholder">🎥 Video content available</div>`
        }
      </div>
      <div class="image-info">
        <h3 class="image-title">${nasaImage.title}</h3>
        <p class="image-date">${nasaImage.date}</p>
        <p class="image-description">${nasaImage.explanation}</p>
      </div>
    `;
    
    // Add click event to open modal when image is clicked (only for images, not videos)
    if (nasaImage.media_type === 'image') {
      imageCard.addEventListener('click', function() {
        openModal(nasaImage);
      });
      // Add cursor pointer to show it's clickable
      imageCard.style.cursor = 'pointer';
    }
    
    // Add the completed image card to the gallery container
    gallery.appendChild(imageCard);
  });
  
  // Show message if no images were found
  if (data.length === 0) {
    gallery.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🌌</div>
        <p>No space images found for the selected date range.</p>
      </div>
    `;
  }
}

// Get modal elements for later use
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalDescription = document.getElementById('modalDescription');
const closeButton = document.querySelector('.close-button');

// Function to open modal with image details
function openModal(nasaImage) {
  // Fill in the modal content with the clicked image data
  modalImage.src = nasaImage.url;
  modalImage.alt = nasaImage.title;
  modalTitle.textContent = nasaImage.title;
  modalDate.textContent = nasaImage.date;
  modalDescription.textContent = nasaImage.explanation;
  
  // Show the modal by adding visible class
  modal.style.display = 'block';
  // Prevent background scrolling when modal is open
  document.body.style.overflow = 'hidden';
}

// Function to close the modal
function closeModal() {
  // Hide the modal
  modal.style.display = 'none';
  // Restore background scrolling
  document.body.style.overflow = 'auto';
}

// Add event listeners for closing the modal
closeButton.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', function(event) {
  // Check if the click was on the modal background (not the content)
  if (event.target === modal) {
    closeModal();
  }
});

// Close modal when pressing the Escape key
document.addEventListener('keydown', function(event) {
  // Check if Escape key was pressed and modal is open
  if (event.key === 'Escape' && modal.style.display === 'block') {
    closeModal();
  }
});
