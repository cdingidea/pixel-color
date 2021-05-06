(() => {

  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  const fileInput = document.getElementById('image');
  const copyButton = document.getElementById('copy-btn');
  const colorElement = document.getElementById('color-div');
  const infoElement = document.getElementById('color-info');
  const contentElement = document.querySelector('.content');
  
  let imageObject;

  fileInput.addEventListener('change', () => {
    imageObject = null;
    colorElement.style.backgroundColor = 'white';
    infoElement.textContent = '';
    context.clearRect(0, 0, canvas.width, canvas.height);

    const blob = fileInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const image = new Image();
      image.src = reader.result;
      image.addEventListener('load', () => imageObject = image);
    });
    reader.readAsDataURL(blob);
  });

  canvas.addEventListener('mouseup', (e) => {
    if (imageObject) {
      const bounds = canvas.getBoundingClientRect();
      const data = context.getImageData(
        e.clientX - bounds.left,
        e.clientY - bounds.top,
        1,
        1
      ).data;
      const color = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${(data[3]/255).toPrecision(2)})`;
      colorElement.style.backgroundColor = color;
      infoElement.innerHTML = color;
    }
  });

  (function render() {
    if (imageObject) {
      let aspectRatio = imageObject.width / imageObject.height;
      let maxWidth = contentElement.clientWidth - 100;
      let maxHeight = maxWidth / aspectRatio;
      let width = imageObject.width > maxWidth ? maxWidth : imageObject.width;
      let height = imageObject.height > maxHeight ? maxHeight : imageObject.height;

      canvas.width = width;
      canvas.height = height;
      context.drawImage(imageObject, 0, 0, width, height);
    }
    requestAnimationFrame(render);
  })();

  const poster = new Image();
  poster.src = 'favicon.ico';
  poster.addEventListener('load', () => {
    canvas.width = 480;
    canvas.height = 480;
    context.drawImage(poster, (canvas.width - poster.width) / 2, (canvas.height - poster.height) / 2);
  });

  copyButton.addEventListener('click', () => {
    const range = document.createRange();
    range.selectNodeContents(infoElement);
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    document.execCommand('copy');
    getSelection().removeAllRanges();
    alert(`Panoya kopyalandı!`);
  });

})();