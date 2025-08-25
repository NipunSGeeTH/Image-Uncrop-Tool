const imageInput = document.getElementById('imageInput');
    const bgColorInput = document.getElementById('bgColor');
    const expandSizeInput = document.getElementById('expandSize');
    const downloadBtn = document.getElementById('downloadBtn');
    const processBtn = document.getElementById('processBtn');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Background controls
    const bgControlsFieldset = document.getElementById('background-controls-fieldset');
    const bgTypeRadios = document.querySelectorAll('input[name="bgType"]');
    const colorPickerGroup = document.getElementById('color-picker-group');
    const bgImageGroup = document.getElementById('bg-image-group');
    const bgImageInput = document.getElementById('bgImageInput');

    let img = new Image();
    let bgImg = new Image();
    let bgImageLoaded = false;
    let originalFileName = '';

    function processImage() {
      if (!img.src || !img.complete || img.naturalWidth === 0) {
        return;
      }

      const padding = parseInt(expandSizeInput.value, 10) || 0;
      const width = img.width + padding * 2;
      const height = img.height + padding * 2;

      canvas.width = width;
      canvas.height = height;
      
      canvas.style.display = 'block';

      ctx.clearRect(0, 0, width, height);

      const selectedBgType = document.querySelector('input[name="bgType"]:checked').value;

      if (selectedBgType === 'color') {
        ctx.fillStyle = bgColorInput.value;
        ctx.fillRect(0, 0, width, height);
      } else if (selectedBgType === 'image' && bgImageLoaded) {
        const pattern = ctx.createPattern(bgImg, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
      // For 'transparent', we do nothing, leaving the cleared canvas.

      // Draw main image
      ctx.drawImage(img, padding, padding);

      downloadBtn.disabled = false;
    }

    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      originalFileName = file.name.split('.').slice(0, -1).join('.');
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        img.onload = () => {
          bgControlsFieldset.disabled = false;
          processBtn.disabled = false;
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    bgImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) {
        bgImageLoaded = false;
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        bgImg.onload = () => {
          bgImageLoaded = true;
        };
        bgImg.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    bgTypeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const type = e.target.value;
        colorPickerGroup.style.display = type === 'color' ? 'flex' : 'none';
        bgImageGroup.style.display = type === 'image' ? 'flex' : 'none';
      });
    });

    processBtn.addEventListener('click', processImage);

    downloadBtn.addEventListener('click', () => {
      if (downloadBtn.disabled) return;
      const link = document.createElement('a');
      const fileName = originalFileName ? `${originalFileName}-uncropped.png` : 'uncropped.png';
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
