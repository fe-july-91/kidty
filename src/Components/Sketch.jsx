import { avatars } from '../Utils/kit';

export const Sketch = (p) => {
  let images = [];
  let positions = [];
  let canvasheight = 750;
  let size, step, gap, padding;
  let hoverSize = 1.6;
  let animationProgress = 0;
  let initialAnimation = true;
  let firstRender = true;
  
  let confetti = [];
  const confettiCount = 60;
  const confettiColors = [
    p.color(255, 50, 50),
    p.color(50, 255, 50),
    p.color(50, 50, 255),
    p.color(255, 255, 50),
    p.color(255, 50, 255),
    p.color(50, 255, 255)
  ];

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth < 768;
  };

  p.preload = () => {
    images = avatars.map((url) => p.loadImage(url));
  };

  const calculateGrid = () => {
    if (p.width < 480) { 
      size = p.width / 4;
      step = p.width / 3;
    } else if (p.width < 768) {
      size = p.width / 7;
      step = p.width / 5;
    } else if (p.width < 1040) {
      size = p.width / 8;
      step = p.width / 6;
    } else if (p.width >= 1040 && p.width <1280) {
      size = p.width / 11;
      step = p.width / 7;
    } else if (p.width >= 1280 && p.width <1440) {
      size = p.width / 12;
      step = p.width / 8;
    } else if (p.width >= 1440) {
      size = p.width / 15;
      step = p.width / 10;
    }

    gap = step - size;
    padding = size + gap;

    let newPositions = [];

    for (let i = padding; i < p.width - gap; i += step) {
      for (let j = size; j < (size + gap)*3; j += step) {
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

  const initConfetti = () => {
    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: p.random(p.width),
        y: p.random(-p.height, 0),
        size: p.random(8, 15),
        speed: p.random(1, 5),
        color: confettiColors[Math.floor(p.random(confettiColors.length))],
        shape: Math.floor(p.random(3)),
        rotation: p.random(p.TWO_PI),
        rotationSpeed: p.random(-0.05, 0.05)
      });
    }
  };

  const updateConfetti = () => {
    for (let i = 0; i < confetti.length; i++) {
      let c = confetti[i];
      c.y += c.speed;
      c.rotation += c.rotationSpeed;
      
      // Если конфетти улетело за нижнюю границу, возвращаем его наверх
      if (c.y > p.height) {
        c.y = p.random(-100, -10);
        c.x = p.random(p.width);
      }
    }
  };

  const drawConfetti = () => {
    p.push();
    p.translate(0, 90); // Такое же смещение как для аватарок
    
    for (let i = 0; i < confetti.length; i++) {
      let c = confetti[i];
      p.push();
      p.translate(c.x, c.y);
      p.rotate(c.rotation);
      p.noStroke();
      p.fill(c.color);
      
      switch (c.shape) {
        case 0: // круг
          p.ellipse(0, 0, c.size, c.size);
          break;
        case 1: // квадрат
          p.rect(-c.size/2, -c.size/2, c.size, c.size);
          break;
        case 2: // треугольник
          p.triangle(
            -c.size/2, c.size/2,
            c.size/2, c.size/2,
            0, -c.size/2
          );
          break;
        default: // дефолтная форма - круг
          p.ellipse(0, 0, c.size, c.size);
          break;
      }
      
      p.pop();
    }
    p.pop();
  };

  p.setup = () => {
    p.createCanvas(window.innerWidth, canvasheight);
    calculateGrid();
    initConfetti();
    p.loop();
    p.background("#202680");
  };

  p.windowResized = () => {
    let prevSizes = positions.map(p => p.size);
    p.resizeCanvas(p.windowWidth, canvasheight);
    calculateGrid();
    
    positions.forEach((avatar, index) => {
      avatar.size = prevSizes[index] || size;
    });
    
    confetti = [];
    initConfetti();
  };

  p.draw = () => {
    p.background("#202680");
    updateConfetti();
    drawConfetti();
     
    p.translate(0, 90);
    
    if (animationProgress < 1) {
      animationProgress += 0.2; 
    } else {
      initialAnimation = false; 
    }

    let isAnimating = false;

    positions.forEach((avatar) => {
      let targetSize = isMobile()
        ? size
        : (p.dist(p.mouseX, p.mouseY, avatar.x, avatar.y) < size ? size * hoverSize : size);


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
      p.loop();
    }
  };

  if (!isMobile()) {
    p.mouseMoved = () => {
      p.loop();
    };

    p.mouseOut = () => {
      p.noLoop();
    };
  }
};

export default Sketch;