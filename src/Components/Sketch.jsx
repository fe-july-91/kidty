import { avatars, bakground } from '../Utils/kit';

export const Sketch = (p) => {
  let images = [];
  let bgImage
  let positions = [];
  let canvasheight = 750
  let size, step, gap, padding;
  let hoverSize = 1.6;
  let animationProgress = 0;
  let initialAnimation = true;
  let firstRender = true;

  p.preload = () => {
    images = avatars.map((url) => p.loadImage(url));
    bgImage=p.loadImage(bakground)
  };

    const calculateGrid = () => {
      if (p.width < 500) { 
        size = p.width / 4;
        step = p.width / 3;
      } else if (p.width < 768) {
        size = p.width / 6;
        step = p.width / 4;
      }else if (p.width < 1040) {
        size = p.width / 8;
        step = p.width / 6;
      }else if (p.width >= 1040 && p.width <1280) {
        size = p.width / 11;
        step = p.width / 7;
      }else if (p.width >= 1280 && p.width <1440) {
        size = p.width / 12;
        step = p.width / 8;
      }else if (p.width >= 1440) {
        size = p.width / 15;
        step = p.width / 10;
      }

      gap = step - size;
      padding = size + gap;

      let newPositions = [];

      for (let i = padding; i < p.width - gap; i += step) {
        for (let j = size; j < (size + gap)*3 ; j += step) {
          let imgIndex = Math.floor(p.random(images.length));
          newPositions.push({
            x: i,
            y: j,
            index: imgIndex,
            size: firstRender ? 0 : size,
            targetSize: size
          });
        }
      }
      positions = newPositions;
      firstRender = false;
    };

    p.setup = () => {
      p.createCanvas(window.innerWidth, canvasheight);
      calculateGrid();
      p.loop();
    };

  p.windowResized = () => {
    let prevSizes = positions.map(p => p.size);
      p.resizeCanvas(p.windowWidth, canvasheight);
    calculateGrid();
    
    positions.forEach((avatar, index) => {
      avatar.size = prevSizes[index] || size;
    });
    };

  p.draw = () => {
    p.background("#F6F6F6");
    let desiredWidth = p.windowWidth * 1.4;
    let newHeight = (desiredWidth / bgImage.width) * bgImage.height;
    if (p.width > 1040) { 
      p.image(bgImage, 0, 0, p.windowWidth, newHeight)
    }
     
    p.translate(0,90)
      if (animationProgress < 1) {
        animationProgress += 0.2; 
      } else {
        initialAnimation = false; 
      }

      let isAnimating = false;

      positions.forEach((avatar) => {
        let d = p.dist(p.mouseX, p.mouseY, avatar.x, avatar.y);
        let targetSize = d < size ? size * hoverSize : size; 

        if (initialAnimation) {
          avatar.size = p.lerp(avatar.size, targetSize * animationProgress, 0.1);
        } else {
          avatar.size = p.lerp(avatar.size, targetSize, 0.1); 
        }

        if (Math.abs(avatar.size - targetSize) > 0.1) {
          isAnimating = true; 
        }

        p.push();
        p.translate(avatar.x, avatar.y);
        if (images[avatar.index]) {
          p.image(images[avatar.index], -avatar.size / 2, -avatar.size / 2, avatar.size, avatar.size);
        }
        p.pop();

      });
      if (!isAnimating && !initialAnimation) {
        p.noLoop();
      }

    };

    p.mouseMoved = () => {
      p.loop();
    };

    p.mouseOut = () => {
      p.noLoop();
    };
}

export default Sketch;
