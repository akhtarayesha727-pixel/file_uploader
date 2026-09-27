const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const errorMessage = document.getElementById('error-message');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const previewContainer = document.getElementById('preview-container');
const previewImage = document.getElementById('preview-image');
const removeBtn = document.getElementById('remove-btn');

const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
const STORAGE_KEY = 'saved_uploaded_image';

document.addEventListener('DOMContentLoaded', () => {
  const savedImage = localStorage.getItem(STORAGE_KEY);
  if (savedImage) {
    displayPreview(savedImage);
  }
});

dropZone.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    processFile(file);
  }
  fileInput.value = '';
});

['dragenter', 'dragover'].forEach(event => {
  dropZone.addEventListener(event, (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
});

['dragleave', 'drop'].forEach(event => {
  dropZone.addEventListener(event, (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
  });
});

dropZone.addEventListener('drop', (e) => {
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
});

removeBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  previewImage.src = '';
  previewContainer.classList.add('hidden');
  clearError();
});

function showError(text) {
  errorMessage.textContent = text;
  errorMessage.classList.remove('hidden');
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
}

function processFile(file) {
  clearError();

  if (!validTypes.includes(file.type)) {
    showError('Unsupported file format. Please choose a JPG, PNG, or GIF.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    startUploadSimulation(reader.result);
  };
  reader.onerror = () => {
    showError('Failed to read the selected file.');
  };
  reader.readAsDataURL(file);
}

function startUploadSimulation(dataUrl) {
  previewContainer.classList.add('hidden');
  progressContainer.classList.remove('hidden');
  progressBar.style.width = '0%';
  progressText.textContent = '0%';

  let percent = 0;
  const timer = setInterval(() => {
    percent += Math.floor(Math.random() * 12) + 6;

    if (percent >= 100) {
      percent = 100;
      clearInterval(timer);

      progressBar.style.width = '100%';
      progressText.textContent = '100%';

      setTimeout(() => {
        progressContainer.classList.add('hidden');
        displayPreview(dataUrl);
        localStorage.setItem(STORAGE_KEY, dataUrl);
      }, 250);
    } else {
      progressBar.style.width = `${percent}%`;
      progressText.textContent = `${percent}%`;
    }
  }, 60);
}

function displayPreview(dataUrl) {
  previewImage.src = dataUrl;
  previewContainer.classList.remove('hidden');
}