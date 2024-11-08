// Scene class represents the main 3D scene containing various elements
class Scene {
  constructor() {
    // Define the colors used in the scene
    this.colors = {
      background: '#F1F2ED', // Light background color
      red: '#A03225',        // Red color for plates
      blue: '#486FBE',       // Blue color for plates
      grey: '#D8D6C7',       // Grey color for plates
      yellow: '#EBD42B',     // Yellow color for plates
      line: '#606060'        // Color for vertical support lines
    };

    // Define the configurations for the flat plates in the scene
    this.plateConfigs = [
      // Long grey plates
      { x: -200, y: -130, z: -40, w: 200, h: 10, d: 80, color: this.colors.grey },
      { x: -50, y: 200, z: -20, w: 200, h: 10, d: 80, color: this.colors.grey },
      
      // Colorful blocks； , blue * 1, red *2 , yellow *3
      { x: 100, y: 0, z: -15, w: 120, h: 10, d: 100, color: this.colors.blue },
      { x: -150, y: 50, z: -30, w: 80, h: 10, d: 80, color: this.colors.red },
      { x: -10, y: -50, z: -25, w: 80, h: 10, d: 80, color: this.colors.red },
      { x: 200, y: 100, z: -10, w: 80, h: 10, d: 180, color: this.colors.yellow },
      { x: -250, y: 30, z: -20, w: 80, h: 10, d: 200, color: this.colors.yellow },
      { x: 130, y: -150, z: 0, w: 200, h: 10, d: 80, color: this.colors.yellow },
    ];

    // Array to hold vertical support lines
    this.verticalLines = [];
    this.initializeVerticalLines(); // Initialize vertical lines based on plate configurations
    
    this.plates = []; // Array to hold plate objects
    this.initializePlates(); // Create plate objects from configurations

    this.randomBoxes = []; // Array to hold randomly generated boxes
    this.initializeRandomBoxes(); // Generate random boxes in the scene
  }

  // Method to initialize vertical lines for each plate
  initializeVerticalLines() {
    // Create support lines for each plate
    this.plateConfigs.forEach(plate => {
      // Get the corners for diagonal support lines
      let corners = [
        { x: plate.x - plate.w / 2, y: plate.y - plate.d / 2 }, // Bottom left corner
        { x: plate.x + plate.w / 2, y: plate.y + plate.d / 2 }  // Top right corner
      ];
      
      // Create vertical lines at the corners
      corners.forEach(corner => {
        this.verticalLines.push(new VerticalLine(
          corner.x,
          corner.y,
          plate.z,
          300,  // Height of the line
          5,    // Width of the line
          this.colors.line // Set the line color
        ));
      });
    });
  }

  // Method to initialize plate objects based on configurations
  initializePlates() {
    // Create Plate instances from the plate configurations
    this.plates = this.plateConfigs.map(config => 
      new Plate(config.x, config.y, config.z, config.w, config.h, config.d, config.color)
    );
  }

  // Method to generate random boxes within the scene
  initializeRandomBoxes() {
    let boxCount = 20; // Number of random boxes to generate
    for (let i = 0; i < boxCount; i++) {
      // Randomly select a color for the box
      let boxColor = random([this.colors.red, this.colors.blue, this.colors.grey, this.colors.yellow]);
      let boxSize = random(10, 30); // Random box size between 10 and 30

      // Randomly select a base position from vertical lines for the box
      let baseLine = random(this.verticalLines);
      let boxX = baseLine.x + random(-10, 10); // Small random offset for X
      let boxY = baseLine.y + random(-10, 10); // Small random offset for Y
      let boxZ = random(-40, -300); // Limit Z-axis range for boxes

      // Create a new Plate object for the random box and add to the array
      this.randomBoxes.push(new Plate(boxX, boxY, boxZ, boxSize, boxSize, boxSize, boxColor));
    }
  }

  // Method to draw the entire scene
  draw() {
    background(this.colors.background); // Set background color
    
    // Draw all vertical lines in the scene
    this.verticalLines.forEach(line => line.draw());
    
    // Draw all plates in the scene
    this.plates.forEach(plate => plate.draw());

    // Draw all randomly generated boxes in the scene
    this.randomBoxes.forEach(box => box.draw());
  }
}

// Plate class represents a rectangular plate in 3D space
class Plate {
  constructor(x, y, z, width, height, depth, color) {
    this.x = x;       // X position of the plate
    this.y = y;       // Y position of the plate
    this.z = z;       // Z position of the plate
    this.width = width;  // Width of the plate
    this.height = height; // Height of the plate
    this.depth = depth;   // Depth of the plate
    this.color = color;   // Color of the plate
  }

  // Method to draw the plate in the scene
  draw() {
    push(); // Save current transformation state
    translate(this.x, this.y, this.z); // Move to the plate's position
    fill(this.color); // Set the fill color for the plate
    noStroke(); // Disable the outline stroke for the plate
    box(this.width, this.depth, this.height); // Draw the plate as a box
    pop(); // Restore the previous transformation state
  }
}

// VerticalLine class represents a vertical line in 3D space
class VerticalLine {
  constructor(x, y, z, height, width, color) {
    this.x = x;       // X position of the line
    this.y = y;       // Y position of the line
    this.z = z;       // Z position of the line
    this.height = height; // Height of the line
    this.width = width;   // Width of the line
    this.color = color;   // Color of the line
  }

  // Method to draw the vertical line in the scene
  draw() {
    push(); // Save current transformation state
    translate(this.x, this.y, this.z - this.height / 2); // Move to the line's position, adjusting for height
    fill(this.color); // Set the fill color for the line
    noStroke(); // Disable the outline stroke for the line
    box(this.width, this.width, this.height); // Draw the line as a box
    pop(); // Restore the previous transformation state
  }
}

// Global variable to hold the scene instance
let scene;

// Setup function runs once when the program starts
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // Create a canvas in WEBGL mode
  camera(-800, 800, 600, 0, 0, 0, 0, 0, -1); // Set the camera position and orientation
  scene = new Scene(); // Create a new Scene instance
}

// Draw function continuously executes the lines of code contained inside its block
function draw() {
  scene.draw(); // Call the draw method of the Scene instance
  orbitControl(); // Allow user to control the camera orbit
}

// Window resize event handler
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Adjust canvas size when the window is resized
}