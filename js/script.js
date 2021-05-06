(() => {

  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  const fileInput = document.getElementById('image');
  const copyButton = document.getElementById('copy-btn');
  const colorElement = document.getElementById('color-div');
  const infoElement = document.getElementById('color-info');
  const infoHexElement = document.getElementById('color-info-hex');
  const contentElement = document.querySelector('.content');
  const fragment = document.getElementById('fragment');
  const fragmentContext = fragment.getContext('2d');
  const fragment2 = document.getElementById('fragment2');
  const fragment2Context = fragment2.getContext('2d');

  let imageObject;

  fileInput.addEventListener('change', () => {
    imageObject = null;
    colorElement.style.backgroundColor = 'rgb(31, 34, 39)';
    infoElement.textContent = '';
    infoHexElement.textContent = '';
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
      infoHexElement.innerHTML = `#${data[0].toString(16)}${data[1].toString(16)}${data[2].toString(16)} (${Math.round(data[3]*100/255)}%)`;
    }
  });

  (function render() {
    if (imageObject) {
      let aspectRatio = imageObject.width / imageObject.height;
      let maxWidth = contentElement.clientWidth - 150;
      let maxHeight = maxWidth / aspectRatio;
      let width = imageObject.width > maxWidth ? maxWidth : imageObject.width;
      let height = imageObject.height > maxHeight ? maxHeight : imageObject.height;

      canvas.width = width;
      canvas.height = height;
      context.drawImage(imageObject, 0, 0, width, height);
    }
    requestAnimationFrame(render);
  })();

  canvas.width = 1;
  canvas.height = 1;

  copyButton.addEventListener('click', () => {
    const range = document.createRange();
    range.selectNodeContents(infoElement);
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    document.execCommand('copy');
    getSelection().removeAllRanges();
  });

  fragment.width = 6;
  fragment.height = 6;
  fragment2.width = 50;
  fragment2.height = 50;
  fragment2Context.strokeStyle = '#fff';
  
  fragment2Context.beginPath();
  fragment2Context.moveTo(0, fragment2.height/2);
  fragment2Context.lineTo(fragment2.width, fragment2.height/2);
  fragment2Context.stroke();
  fragment2Context.moveTo(fragment2.width/2, 0);
  fragment2Context.lineTo(fragment2.width/2, fragment2.height);
  fragment2Context.stroke();

  canvas.addEventListener('mousemove', (e) => {
    const bounds = canvas.getBoundingClientRect();
    const data = context.getImageData(
      e.clientX - bounds.left - 3,
      e.clientY - bounds.top - 3,
      6,
      6,
    );
    fragmentContext.clearRect(0, 0, fragment.width, fragment.height);
    fragmentContext.putImageData(data, 0, 0);
  });

})();