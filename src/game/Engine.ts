import Matter from 'matter-js';
import { useGameStore } from '../store/gameStore';

export class GameEngine {
  engine: Matter.Engine;
  world: Matter.World;
  render?: Matter.Render;
  runner?: Matter.Runner;

  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;

  width = window.innerWidth;
  height = window.innerHeight;

  // Game specific state
  blocks: Matter.Body[] = [];
  ground: Matter.Body | null = null;
  activeDriftingBlock: Matter.Body | null = null;
  
  driftX = 0;
  driftDirection = 1;
  driftSpeed = 4;
  
  blockWidth = 100;
  blockHeight = 30;

  highestY = 0;
  targetCameraY = 0;
  cameraY = 0;

  score = 0;
  towerHeight = 0;
  combo = 0;
  multiplier = 1;
  
  blockThemes = [
    { primary: '#00F5FF', secondary: '#0098FF', frequency: '440Hz' },
    { primary: '#FF00E5', secondary: '#FF006B', frequency: '880Hz' },
    { primary: '#9D00FF', secondary: '#6E00FF', frequency: '1.2GHz' }
  ];
  activeTheme = this.blockThemes[0];

  animationFrameId: number | null = null;
  isGameOver = false;

  constructor() {
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.5, scale: 0.001 } // slightly heavy gravity for snappy feel
    });
    this.world = this.engine.world;
    this.highestY = this.height - 100; // initially ground level
    this.targetCameraY = 0;
  }

  mount(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    const parent = canvas.parentElement;
    this.width = parent ? parent.clientWidth : window.innerWidth;
    this.height = parent ? parent.clientHeight : window.innerHeight;

    canvas.width = this.width;
    canvas.height = this.height;

    window.addEventListener('resize', this.handleResize);

    this.initWorld();
    
    // Start loop
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);
    
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.renderLoop);
  }

  unmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.runner) Matter.Runner.stop(this.runner);
    Matter.World.clear(this.world, false);
    Matter.Engine.clear(this.engine);
  }

  handleResize = () => {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.width = parent ? parent.clientWidth : window.innerWidth;
    this.height = parent ? parent.clientHeight : window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if (this.ground) {
      Matter.Body.setPosition(this.ground, { x: this.width / 2, y: this.height - 50 });
    }
  }

  initWorld() {
    // Clear old stuff
    Matter.World.clear(this.world, false);
    this.blocks = [];
    this.score = 0;
    this.towerHeight = 0;
    this.combo = 0;
    this.multiplier = 1;
    this.highestY = this.height - 100;
    this.cameraY = 0;
    this.targetCameraY = 0;
    this.isGameOver = false;

    // Ground (narrow pedestal)
    this.ground = Matter.Bodies.rectangle(this.width / 2, this.height - 50, this.blockWidth, 100, { 
      isStatic: true,
      friction: 0.8,
      restitution: 0.1,
      render: { fillStyle: '#111' }
    });
    
    // Base block
    const baseBlock = Matter.Bodies.rectangle(this.width / 2, this.height - 110, this.blockWidth, this.blockHeight, {
       isStatic: true,
       friction: 1.0,
       restitution: 0,
       plugin: { color: '#333' }
    })
    
    Matter.World.add(this.world, [this.ground, baseBlock]);
    this.blocks.push(baseBlock);
    
    this.spawnDrifter();
    this.updateZustand();
  }

  spawnDrifter() {
    if (this.isGameOver) return;
    const spawnY = this.highestY - 300;
    
    // Random theme
    this.activeTheme = this.blockThemes[Math.floor(Math.random() * this.blockThemes.length)];

    this.activeDriftingBlock = Matter.Bodies.rectangle(0, spawnY, this.blockWidth, this.blockHeight, {
      isStatic: true, // It's static until dropped
      friction: 0.8,
      restitution: 0.1,
      density: 0.05,
      plugin: { theme: this.activeTheme }
    });
    
    this.driftX = 0;
    // Speed increases with height
    this.driftSpeed = 4 + (this.towerHeight * 0.15);
    if (this.driftSpeed > 15) this.driftSpeed = 15;
    
    Matter.World.add(this.world, this.activeDriftingBlock);
  }

  drop() {
    if (!this.activeDriftingBlock || this.isGameOver) return;

    // Make it dynamic so gravity affects it
    Matter.Body.setStatic(this.activeDriftingBlock, false);
    
    // Add it to our block stack
    this.blocks.push(this.activeDriftingBlock);
    
    this.activeDriftingBlock = null;
  }

  lastTime = 0;

  renderLoop = (time: number) => {
    const dt = time - this.lastTime;
    this.lastTime = time;

    this.updateLogic(dt);
    this.draw();

    this.animationFrameId = requestAnimationFrame(this.renderLoop);
  }

  updateLogic(dt: number) {
    if (this.isGameOver) return;

    // Move drifter
    if (this.activeDriftingBlock) {
      this.driftX += this.driftSpeed * this.driftDirection;
      const margin = this.blockWidth / 2;
      if (this.driftX > this.width - margin) {
        this.driftX = this.width - margin;
        this.driftDirection = -1;
      } else if (this.driftX < margin) {
        this.driftX = margin;
        this.driftDirection = 1;
      }
      
      const spawnY = this.highestY - 300;
      Matter.Body.setPosition(this.activeDriftingBlock, { x: this.driftX, y: spawnY });
    }

    // Check physics state
    let newHighestY = this.height - 100;
    let anyFell = false;
    
    // Ignore ground and drifter for stability check
    const stack = this.blocks.filter(b => !b.isStatic && b !== this.activeDriftingBlock);
    
    let allResting = true;

    stack.forEach(block => {
        // if fallen off screen
        if (block.position.y > this.height + 200) {
            anyFell = true;
        } else {
           if (block.position.y < newHighestY) {
               newHighestY = block.position.y;
           }
        }
        
        // simple velocity check to see if resting
        if (Math.abs(block.velocity.x) > 0.1 || Math.abs(block.velocity.y) > 0.1) {
            allResting = false;
        }
    });

    if (anyFell) {
        this.triggerGameOver();
        return;
    }

    // Update highest Y logic if stable
    if (allResting && stack.length > 0 && !this.activeDriftingBlock) {
       // Only trigger when a NEW block finishes resting
       // Let's also check for matches!
       
       let didMatch = false;
       const toRemove = new Set<Matter.Body>();
       const validBlocks = this.blocks.filter(b => !b.isStatic && b.plugin?.theme);
       
       for (const block of validBlocks) {
           if (toRemove.has(block)) continue;
           
           // BFS to find connected components of same color
           const component = new Set<Matter.Body>();
           const queue = [block];
           component.add(block);
           
           while (queue.length > 0) {
               const curr = queue.shift()!;
               
               for (const other of validBlocks) {
                   if (component.has(other)) continue;
                   if (curr.plugin.theme.primary !== other.plugin.theme.primary) continue;
                   
                   const dx = Math.abs(curr.position.x - other.position.x);
                   const dy = Math.abs(curr.position.y - other.position.y);
                   
                   if (dx < this.blockWidth * 1.1 && dy < this.blockHeight * 1.5) {
                       component.add(other);
                       queue.push(other);
                   }
               }
           }
           
           if (component.size >= 3) {
               component.forEach(b => toRemove.add(b));
               didMatch = true;
           }
       }
       
       if (didMatch) {
           // Remove matched blocks
           toRemove.forEach(b => {
               Matter.World.remove(this.world, b);
               this.blocks = this.blocks.filter(blk => blk !== b);
           });
           
           this.combo++;
           this.multiplier += 0.5 * this.combo;
           this.score += toRemove.size * 50 * this.multiplier;
           this.screenShake = 20 + (toRemove.size * 3);
           this.updateZustand();
           
           // Don't spawn yet, wait for cascade to settle
           return;
       }

       if (!didMatch) {
           // If we didn't match anything, we are stable. Update highest Y and spawn next block.
           this.highestY = newHighestY;
           this.towerHeight = stack.length; // Approximate tower height by block count or calculate max tower
           this.score += 10; // 10 points for a stable placement
           this.updateZustand();
           
           setTimeout(() => {
              // Ensure we only spawn if still no drifter
              if (!this.activeDriftingBlock && !this.isGameOver) {
                 this.spawnDrifter();
                 this.combo = 0;
                 this.multiplier = 1;
                 this.updateZustand();
              }
           }, 200);
       }
    }

    // Smooth camera tracking
    this.targetCameraY = (this.height - 400) - this.highestY;
    if (this.targetCameraY < 0) this.targetCameraY = 0;
    
    this.cameraY += (this.targetCameraY - this.cameraY) * 0.1;
  }

  screenShake = 0;

  triggerGameOver() {
    this.isGameOver = true;
    useGameStore.getState().setGameState('GAME_OVER');
  }

  updateZustand() {
     useGameStore.getState().updateStats(this.score, this.towerHeight, this.combo, this.multiplier);
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;

    // Clear background
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, this.width, this.height);

    // Apply camera and screen shake
    ctx.save();
    
    let shakeX = 0;
    let shakeY = 0;
    if (this.screenShake > 0) {
       shakeX = (Math.random() - 0.5) * this.screenShake;
       shakeY = (Math.random() - 0.5) * this.screenShake;
       this.screenShake *= 0.9;
       if (this.screenShake < 0.5) this.screenShake = 0;
    }

    ctx.translate(shakeX, this.cameraY + shakeY);

    // Draw Grid / Background Details
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < this.height * 3; i += 50) { // arbitrary high bound
        ctx.beginPath();
        ctx.moveTo(0, this.height - i);
        ctx.lineTo(this.width, this.height - i);
        ctx.stroke();
    }

    // Draw blocks
    // Helper to draw a matter block
    const drawBody = (body: Matter.Body, theme?: { primary: string, secondary: string, frequency?: string }) => {
      ctx.beginPath();
      body.vertices.forEach((v, i) => {
        if (i === 0) ctx.moveTo(v.x, v.y);
        else ctx.lineTo(v.x, v.y);
      });
      ctx.closePath();
      
      if (theme) {
        // Gradient fill
        const minX = Math.min(...body.vertices.map(v => v.x));
        const maxX = Math.max(...body.vertices.map(v => v.x));
        const gradient = ctx.createLinearGradient(minX, 0, maxX, 0);
        gradient.addColorStop(0, theme.primary);
        gradient.addColorStop(1, theme.secondary);
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // White border left (approximate visual)
        ctx.beginPath();
        ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
        ctx.lineTo(body.vertices[3].x, body.vertices[3].y);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Outer glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = theme.primary + '66'; // add alpha
        ctx.lineWidth = 2;
        ctx.strokeStyle = theme.primary;
        
        ctx.beginPath();
        body.vertices.forEach((v, i) => {
          if (i === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Text
        if (theme.frequency) {
           ctx.save();
           ctx.translate(body.position.x, body.position.y);
           ctx.rotate(body.angle);
           ctx.fillStyle = 'rgba(255,255,255,0.6)';
           ctx.font = 'bold 10px sans-serif';
           ctx.textAlign = 'right';
           ctx.textBaseline = 'middle';
           // approximate right edge
           ctx.fillText(theme.frequency, this.blockWidth / 2 - 8, 0);
           ctx.restore();
        }
      } else {
        // Fallback for ground
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    if (this.ground) {
      drawBody(this.ground);
    }

    this.blocks.forEach(block => {
        const theme = block.plugin?.theme;
        drawBody(block, theme);
    });

    if (this.activeDriftingBlock) {
       drawBody(this.activeDriftingBlock, this.activeTheme);
    }

    ctx.restore();
  }
}
