// Rocket cursor management

export function createRocketCursor() {
  const rocketCursor = document.createElement('div');
  rocketCursor.className = 'rocket-cursor';
  document.body.appendChild(rocketCursor);
  
  let mouseX = 0, mouseY = 0;
  
  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    
    const target = event.target;
    if (target.tagName === 'BUTTON') {
      rocketCursor.style.display = 'none';
    } else {
      rocketCursor.style.display = 'block';
      rocketCursor.style.left = mouseX + 'px';
      rocketCursor.style.top = mouseY + 'px';
    }
  });
  
  return { rocketCursor, getMousePosition: () => ({ x: mouseX, y: mouseY }) };
}

