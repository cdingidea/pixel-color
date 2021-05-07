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
  context.imageSmoothingEnabled = true;
  fragmentContext.imageSmoothingEnabled = true;
  fragment2Context.imageSmoothingEnabled = true;

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

  function hexComponent(value) {
    value = value.toString(16);
    return value.length < 2 ? ('0' + value) : value;
  }

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
      infoHexElement.innerHTML = `#${hexComponent(data[0])}${hexComponent(data[1])}${hexComponent(data[2])} (${Math.round(data[3]*100/255)}%)`;
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
  fragment2Context.fillStyle = '#fff';
  fragment2Context.beginPath();
  fragment2Context.arc(fragment2.width/2, fragment2.height/2, 1.5, 0, 2*Math.PI);
  fragment2Context.fill();

  canvas.addEventListener('mousemove', (e) => {
    const bounds = canvas.getBoundingClientRect();
    const data = context.getImageData(
      e.clientX - bounds.left - 6,
      e.clientY - bounds.top - 6,
      12,
      12,
    );
    fragmentContext.clearRect(0, 0, fragment.width, fragment.height);
    fragmentContext.putImageData(data, 0, 0);
  });

})();