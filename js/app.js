// APIController.js
const APIController = (function() {
  const clientId = "4fd3bee81b9d4fbda67e18b6501ce4c0"; // Storing these here is bad practice, I was not sure if I was meant to do work with node/react to hide it based on the project description
  const clientSecret = "047498b6315342808c7ba8f13e42c3fe"; // client secret

  // Get Spotify access token (client credentials flow)
  const _getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret)
      },
      body: "grant_type=client_credentials"
    });
    const data = await result.json();
    return data.access_token;
  };

  // Get new releases from Spotify (does not require user authentication)
  const _getNewReleases = async token => {
    const result = await fetch(
      "https://api.spotify.com/v1/browse/new-releases?limit=10",
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token }
      }
    );
    const data = await result.json();
    return data.albums.items; // Return the album items
  };

  return {
    getToken() {
      return _getToken();
    },
    getNewReleases(token) {
      return _getNewReleases(token);
    }
  };
})();

// UIController.js
const UIController = (function() {
  const DOMElements = {
    buttonSubmitNewReleases: "#btn_new_releases", // Button to submit for new releases
    divNewReleasesList: ".new-releases-list", // Container to display the new releases
    hfToken: "#hidden_token" // Hidden token input field
  };

  // Public methods to create a new release item
  const createNewRelease = (name, imgUrl) => {
    const releaseItem = document.createElement("a");
    releaseItem.classList.add("list-group-item", "list-group-item-action");
    releaseItem.href = "#";
    releaseItem.textContent = name;

    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = name;
    img.style.width = "50px";
    img.style.height = "50px";
    img.style.marginRight = "10px";

    releaseItem.prepend(img);

    document
      .querySelector(DOMElements.divNewReleasesList)
      .appendChild(releaseItem);
  };

  // Reset the list of new releases
  const resetNewReleasesList = () => {
    document.querySelector(DOMElements.divNewReleasesList).innerHTML = "";
  };

  // Store the token in a hidden field (for convenience)
  const storeToken = value => {
    document.querySelector(DOMElements.hfToken).value = value;
  };

  // Retrieve the stored token
  const getStoredToken = () => {
    return document.querySelector(DOMElements.hfToken).value;
  };

  return {
    DOMElements,
    createNewRelease,
    resetNewReleasesList,
    storeToken,
    getStoredToken
  };
})();

// APPController.js
const APPController = (function(UICtrl, APICtrl) {
  const DOMInputs = UICtrl.DOMElements;

  // Initialize the app
  const init = async () => {
    console.log("App is starting");

    // Get the token from the API and store it
    const token = await APICtrl.getToken();
    UICtrl.storeToken(token);

    // Event listener for the "Get New Releases" button
    document
      .querySelector(DOMInputs.buttonSubmitNewReleases)
      .addEventListener("click", async () => {
        // Clear any existing new releases
        UICtrl.resetNewReleasesList();

        // Get the stored token
        const token = UICtrl.getStoredToken();

        // Fetch new releases from Spotify
        const newReleases = await APICtrl.getNewReleases(token);

        // Display new releases
        newReleases.forEach(release => {
          UICtrl.createNewRelease(release.name, release.images[0].url);
        });
      });
  };

  return {
    init
  };
})(UIController, APIController);

// Initialize the app
APPController.init();
