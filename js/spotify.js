// APIController Module
const APIController = (function() {
    
    const clientId = "4fd3bee81b9d4fbda67e18b6501ce4c0"; // Storing credentials in code is not a secure practice. Normally, you should use environment variables or a backend to keep them safe.
    const clientSecret = "047498b6315342808c7ba8f13e42c3fe"; // Same for client secret.

    // Private method to retrieve an access token from Spotify
    const _getToken = async () => {
        try {
            const result = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST', // POST request to the Spotify API for token
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded', 
                    'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret) // Encode the clientId and clientSecret using Base64 for Basic Authentication
                },
                body: 'grant_type=client_credentials' // Grant type is client_credentials for accessing public data
            });

            // Check if the response is ok (status code 200)
            if (!result.ok) {
                throw new Error(`Failed to get token: ${result.status} ${result.statusText}`);
            }

            const data = await result.json(); // Parse the response data to JSON
            return data.access_token; // Return the access token
        } catch (error) {
            console.error("Error fetching token:", error); // Log the error
            throw error; // Rethrow the error to propagate it up to the caller
        }
    }
    
    // Private method to get genres from Spotify
    const _getGenres = async (token) => {
        try {
            const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
                method: 'GET', // GET request to fetch genres
                headers: { 'Authorization' : 'Bearer ' + token} // Use the token for authorization
            });

            // Check if the response is ok (status code 200)
            if (!result.ok) {
                throw new Error(`Failed to fetch genres: ${result.status} ${result.statusText}`);
            }

            const data = await result.json(); // Parse the response data to JSON
            return data.categories.items; // Return the genre items
        } catch (error) {
            console.error("Error fetching genres:", error); // Log the error
            throw error; // Rethrow the error to propagate it up to the caller
        }
    }

    // Private method to fetch playlists by genre
    const _getPlaylistByGenre = async (token, genreId) => {
        try {
            const limit = 10; // Set a limit for how many playlists to fetch
            
            const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
                method: 'GET', // GET request to fetch playlists for a specific genre
                headers: { 'Authorization' : 'Bearer ' + token} // Use the token for authorization
            });

            // Check if the response is ok (status code 200)
            if (!result.ok) {
                throw new Error(`Failed to fetch playlists for genre ${genreId}: ${result.status} ${result.statusText}`);
            }

            const data = await result.json(); // Parse the response data to JSON
            return data.playlists.items; // Return the playlist items
        } catch (error) {
            console.error("Error fetching playlists by genre:", error); // Log the error to the console
            throw error; // Rethrow the error to propagate it up to the caller
        }
    }


    // Private method to get tracks for a playlist
    const _getTracks = async (token, tracksEndPoint) => {
        try {
            const limit = 10; // Set a limit for how many tracks to fetch

            const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
                method: 'GET', // GET request to fetch tracks from the playlist
                headers: { 'Authorization' : 'Bearer ' + token} // Use the token for authorization
            });

            // Check if the response is ok (status code 200)
            if (!result.ok) {
                throw new Error(`Failed to fetch tracks from playlist: ${result.status} ${result.statusText}`);
            }

            const data = await result.json(); // Parse the response data to JSON
            return data.items; // Return the track items
        } catch (error) {
            console.error("Error fetching tracks:", error); // Log the error
            throw error; // Rethrow the error to propagate it up to the caller
        }
    }


    // Private method to get details of a specific track
    const _getTrack = async (token, trackEndPoint) => {
        try {
            const result = await fetch(`${trackEndPoint}`, {
                method: 'GET', // GET request to fetch details of a specific track
                headers: { 'Authorization' : 'Bearer ' + token} // Use the token for authorization
            });

            // Check if the response is ok (status code 200)
            if (!result.ok) {
                throw new Error(`Failed to fetch track details: ${result.status} ${result.statusText}`);
            }

            const data = await result.json(); // Parse the response data to JSON
            return data; // Return the track data
        } catch (error) {
            console.error("Error fetching track details:", error); // Log the error
            throw error; // Rethrow the error to propagate it up to the caller
        }
    }


    // Public methods to allow external access to private methods
    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();

// UIController Module
const UIController = (function() {

    // Object to hold references to the DOM elements
    const DOMElements = {
        selectGenre: '#select_genre', // Genre select dropdown
        selectPlaylist: '#select_playlist', // Playlist select dropdown
        buttonSubmit: '#btn_submit', // Submit button
        divSongDetail: '#song-detail', // Section for displaying track details
        hfToken: '#hidden_token', // Hidden input field to store the token
        divSonglist: '.song-list' // Container for displaying the song list
    }

    // Public methods for interacting with the DOM
    return {

        // Method to return input field references
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre), // Genre select
                playlist: document.querySelector(DOMElements.selectPlaylist), // Playlist select
                tracks: document.querySelector(DOMElements.divSonglist), // Song list container
                submit: document.querySelector(DOMElements.buttonSubmit), // Submit button
                songDetail: document.querySelector(DOMElements.divSongDetail) // Song detail container
            }
        },

        // Method to create and insert a genre option into the select dropdown
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html); // Insert the option into the genre dropdown
        }, 

        // Method to create and insert a playlist option into the select dropdown
        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html); // Insert the option into the playlist dropdown
        },

        // Method to create and insert a track list item
        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html); // Insert the track item into the song list
        },

        // Method to create and display track details (image, title, and artist)
        createTrackDetail(img, title, artist) {

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            detailDiv.innerHTML = ''; // Clear any previous track details

            const html = 
            `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">        
            </div>
            <div class="row col-sm-12 px-0">
                <label for="Genre" class="form-label col-sm-12">${title}:</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
            </div> 
            `;

            detailDiv.insertAdjacentHTML('beforeend', html); // Insert the track details into the UI
        },

        // Method to reset the song detail section
        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = ''; // Clear the song detail section
        },

        // Method to reset the tracks section
        resetTracks() {
            this.inputField().tracks.innerHTML = ''; // Clear the song list
            this.resetTrackDetail(); // Reset the song detail section as well
        },

        // Method to reset the playlist section
        resetPlaylist() {
            this.inputField().playlist.innerHTML = ''; // Clear the playlist dropdown
            this.resetTracks(); // Reset the tracks section as well
        },
        
        // Method to store the access token in the hidden field
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        // Method to get the stored access token
        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }
    }

})();

// APPController Module
const APPController = (function(UICtrl, APICtrl) {

    const DOMInputs = UICtrl.inputField(); // Get references to input fields

    // Function to load genres on page load
    const loadGenres = async () => {
        const token = await APICtrl.getToken(); // Get the access token
        UICtrl.storeToken(token); // Store the token in the hidden input field
        const genres = await APICtrl.getGenres(token); // Fetch the genres
        genres.forEach(element => UICtrl.createGenre(element.name, element.id)); // Populate the genre dropdown
    }

    // Event listener for when the genre is changed
    DOMInputs.genre.addEventListener('change', async () => {
        UICtrl.resetPlaylist(); // Reset the playlist dropdown
        const token = UICtrl.getStoredToken().token; // Get the stored token
        const genreSelect = UICtrl.inputField().genre; // Get the genre select field
        const genreId = genreSelect.options[genreSelect.selectedIndex].value; // Get the selected genre ID
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId); // Fetch playlists for the selected genre
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href)); // Populate the playlist dropdown
    });

    // Event listener for when the submit button is clicked
    DOMInputs.submit.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent page reload
        UICtrl.resetTracks(); // Reset the tracks list
        const token = UICtrl.getStoredToken().token; // Get the stored token
        const playlistSelect = UICtrl.inputField().playlist; // Get the playlist select field
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value; // Get the selected playlist's endpoint URL
        const tracks = await APICtrl.getTracks(token, tracksEndPoint); // Fetch tracks for the selected playlist
        tracks.forEach(el => UICtrl.createTrack(el.track.id, el.track.name)); // Display tracks in the song list
    });

    // Event listener for when a track is clicked
    DOMInputs.tracks.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent page reload
        UICtrl.resetTrackDetail(); // Reset the track details section
        const token = UICtrl.getStoredToken().token; // Get the stored token
        const trackEndpoint = e.target.id; // Get the clicked track's endpoint
        const track = await APICtrl.getTrack(token, trackEndpoint); // Fetch track details
        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name); // Display the track details
    });    

    return {
        init() {
            console.log('App is starting');
            loadGenres(); // Initialize the app by loading genres
        }
    }

})(UIController, APIController);

// Initialize the app
APPController.init();
