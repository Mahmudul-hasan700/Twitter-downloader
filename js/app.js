document.addEventListener("DOMContentLoaded", function() {
  const downloadForm = document.getElementById("downloadForm");
  const resultDiv = document.getElementById("result");
  const loader = document.getElementById("loader");
  const alertDiv = document.getElementById("alert");
  const closeAlertButton = alertDiv.querySelector("button");
  const errorAlertText = alertDiv.querySelector("#error-alert");

  const urlErrorDiv = document.getElementById("url-error");
  const urlErrorText = urlErrorDiv.querySelector("#error-text");
  const urlErrorCloseButton = urlErrorDiv.querySelector("button");

  downloadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultDiv.innerHTML = "";
    alertDiv.classList.add("hidden"); // Hide the alert
    loader.classList.remove("hidden");

    const twitterUrl = document.getElementById("twitterUrl").value;

    if (isTwitterUrl(twitterUrl)) {
      const apiKey = '3310140644msh1db7d0febe86dabp1bec8bjsn72eab7657ff6';
      const apiUrl = 'https://twitter65.p.rapidapi.com/api/twitter/links';

      const headers = {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'twitter65.p.rapidapi.com'
      };

      const data = {
        url: twitterUrl
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
        });

        if (response.ok) {
          const responseData = await response.json();

          responseData.forEach(video => {
            const videoDetails = document.createElement("div");
            videoDetails.classList.add("details", "mb-4");

            const thumbnailTitleContainer = document.createElement("div");
            thumbnailTitleContainer.classList.add("thumbnail-title");

            const thumbnailImage = document.createElement("img");
            thumbnailImage.src = video.pictureUrl;
            thumbnailImage.classList.add("w-full", "h-auto", "thumbnail", "rounded-md");
            thumbnailTitleContainer.appendChild(thumbnailImage);

            videoDetails.appendChild(thumbnailTitleContainer);

            const downloadLinksContainer = document.createElement("div");
            downloadLinksContainer.classList.add("download-links");

            video.urls.forEach(urlInfo => {
              const downloadLink = document.createElement("a");
              downloadLink.href = urlInfo.url;
              downloadLink.classList.add("download-link", "hover:underline");
              downloadLink.textContent = `Download ${urlInfo.name} - ${urlInfo.quality}p`;

              downloadLink.addEventListener("click", function(e) {
                e.preventDefault();
                downloadLink.blur();
                downloadFile(urlInfo.url, `video_${Date.now()}.${urlInfo.name}`);
              });

              downloadLinksContainer.appendChild(downloadLink);
            });

            videoDetails.appendChild(downloadLinksContainer);
            resultDiv.appendChild(videoDetails);
          });

          resultDiv.classList.remove("hidden");
        } else {
          const errorResponse = await response.json();
          const errorMessage = errorResponse.error_message || "The tweet you entered is invalid, deleted, or set to private. Please ensure you are using a valid, public tweet.";
          console.error("API request failed:", errorMessage);
          showAlert(errorMessage, "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showAlert("An error occurred. Please check your network connection and try again.", "error");
      } finally {
        loader.classList.add("hidden");
      }
    } else {
      urlErrorText.textContent = "Invalid Twitter URL. Please enter a valid Twitter video URL.";
      urlErrorDiv.classList.remove("hidden");
      loader.classList.add("hidden");
    }
  });

  closeAlertButton.addEventListener("click", () => {
    alertDiv.classList.add("hidden"); // Hide the alert
  });

  urlErrorCloseButton.addEventListener("click", () => {
    urlErrorDiv.classList.add("hidden"); // Hide the URL error alert
  });

  function isTwitterUrl(url) {
    // Regular expression to check if the URL is a Twitter video URL
    const twitterUrlRegex = /twitter\.com\/[^/]+\/status\/\d+/;
    return twitterUrlRegex.test(url);
  }

  function showAlert(message, type) {
    errorAlertText.textContent = message;
    alertDiv.classList.remove("hidden"); // Display the alert

    if (type === "error") {
      alertDiv.classList.add("error-alert");
    } else {
      alertDiv.classList.remove("error-alert");
    }
  }

  function downloadFile(url, filename) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    xhr.open('GET', url);
    xhr.send();
  }
});