// APIController.js 

const APIController = (function() {
  const clientId = "4fd3bee81b9d4fbda67e18b6501ce4c0"; // Important to note that storing these here is bad practice
  const clientSecret = "9c15dceae58d4ab0895c563da4a6299d"; // client secret

  // Get Spotify access token (client credentials flow)
  const _getToken = async () => {
    try {
      // Make a POST request to get an access token from Spotify
      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST", // Use POST method to get the token
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Content type is application/x-www-form-urlencoded for the request body
          Authorization: "Basic " + btoa(clientId + ":" + clientSecret) // Encode clientId and clientSecret to base64 for Basic Authentication
        },
        body: "grant_type=client_credentials" // The body specifies that we are requesting client credentials
      });

      // Check if the response status is successful (200-299 range)
      if (!result.ok) {
        throw new Error("Failed to fetch token, status: " + result.status);
      }

      const data = await result.json(); // Parse the response JSON

      // Check if the token exists in the response
      if (!data.access_token) {
        throw new Error("Access token not found in response");
      }

      return data.access_token; // Return the access token
    } catch (error) {
      console.error("Error fetching token:", error.message);
      alert("There was an error fetching the access token. Please try again later."); // Show user-friendly alert
    }
  };

  // Get new releases from Spotify (does not require user authentication)
  const _getNewReleases = async token => {
    try {
      // Fetch the new releases from Spotify using the access token
      const result = await fetch(
        "https://api.spotify.com/v1/browse/new-releases?limit=10", // Endpoint for new releases, limiting to 10 albums
        {
          method: "GET", // GET request to fetch the data
          headers: { Authorization: "Bearer " + token } // Bearer token is used for authorization
        }
      );

      // Check if the response status is successful (200-299 range)
      if (!result.ok) {
        throw new Error("Failed to fetch new releases, status: " + result.status);
      }

      const data = await result.json(); // Parse the response JSON

      // Check if there are album items in the response
      if (!data.albums || !data.albums.items) {
        throw new Error("No new releases found in response");
      }

      return data.albums.items; // Return the album items from the response
    } catch (error) {
      console.error("Error fetching new releases:", error.message);
      alert("There was an error fetching new releases. Please try again later."); // Show user-friendly alert
    }
  };

  return {
    getToken() {
      return _getToken(); // Expose the method to get the token
    },
    getNewReleases(token) {
      return _getNewReleases(token); // Expose the method to get new releases
    }
  };
})();

// UIController.js

const UIController = (function() {
  // Object to store DOM element references for easy access
  const DOMElements = {
    buttonSubmitNewReleases: "#btn_new_releases", // Button to submit for new releases
    divNewReleasesList: ".new-releases-list", // Container to display the new releases
    hfToken: "#hidden_token" // Hidden token input field to store the token for later use
  };

  // Public method to create and display a new release item
  const createNewRelease = (name, imgUrl) => {
    // Create a new 'a' element for each release, which acts like a clickable list item
    const releaseItem = document.createElement("a");
    releaseItem.classList.add("list-group-item", "list-group-item-action"); // Add Bootstrap classes
    releaseItem.href = "#"; // No URL is needed for the release item, it's just clickable
    releaseItem.textContent = name; // Set the name of the release as the text content

    // Create an image element to display the album cover image
    const img = document.createElement("img");
    img.src = imgUrl; // Set the image source to the passed imgUrl
    img.alt = name; // Set the alt text for the image to the name of the release
    img.style.width = "50px"; // Set the width of the image
    img.style.height = "50px"; // Set the height of the image
    img.style.marginRight = "10px"; // Add margin to the right of the image for spacing

    // Prepend the image to the release item (so it's displayed before the name)
    releaseItem.prepend(img);

    // Append the release item to the new releases list container
    document
      .querySelector(DOMElements.divNewReleasesList)
      .appendChild(releaseItem);
  };

  // Method to reset the list of new releases by clearing the existing list
  const resetNewReleasesList = () => {
    document.querySelector(DOMElements.divNewReleasesList).innerHTML = ""; // Clear the list container
  };

  // Store the token in a hidden input field on the page (for convenience)
  const storeToken = value => {
    document.querySelector(DOMElements.hfToken).value = value; // Store the token in the hidden input
  };

  // Retrieve the stored token from the hidden input field
  const getStoredToken = () => {
    return document.querySelector(DOMElements.hfToken).value; // Return the stored token
  };

  return {
    DOMElements, // Expose DOM element references
    createNewRelease, // Expose method to create new release
    resetNewReleasesList, // Expose method to reset new releases list
    storeToken, // Expose method to store token
    getStoredToken // Expose method to get the stored token
  };
})();

// APPController.js

const APPController = (function(UICtrl, APICtrl) {
  const DOMInputs = UICtrl.DOMElements; // Get the DOM element references from the UIController

  // Initialize the app
  const init = async () => {
    console.log("App is starting");

    try {
      // Get the token from the API and store it
      const token = await APICtrl.getToken(); // Call APIController to get the token
      UICtrl.storeToken(token); // Store the token using the UIController
    } catch (error) {
      console.error("Error initializing app:", error.message);
      alert("There was an error initializing the app. Please try again later."); // Show user-friendly alert
    }

    // Event listener for the "Get New Releases" button
    document
      .querySelector(DOMInputs.buttonSubmitNewReleases)
      .addEventListener("click", async () => {
        // Clear any existing new releases
        UICtrl.resetNewReleasesList();

        // Get the stored token (it's stored in a hidden input field on the page)
        const token = UICtrl.getStoredToken();

        try {
          // Fetch new releases from Spotify using the token
          const newReleases = await APICtrl.getNewReleases(token);

          // Display new releases by creating a new release for each album
          newReleases.forEach(release => {
            UICtrl.createNewRelease(release.name, release.images[0].url); // Pass album name and image URL to UIController
          });
        } catch (error) {
          console.error("Error fetching new releases:", error.message);
          alert("There was an error fetching new releases. Please try again later."); // Show user-friendly alert
        }
      });
  };

  return {
    init // Expose the init method to start the app
  };
})(UIController, APIController); // Pass in the UIController and APIController modules to APPController

// Initialize the app
APPController.init(); // Call init() to start the application
