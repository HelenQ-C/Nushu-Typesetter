let nushuFont;
let inputText = '';
let isTraditional = false;
let canvas;
const canvasWidth = 1748;
const canvasHeight = 2480;
const marginOutput = 100;

function preload() {
    nushuFont = loadFont('Assets/NyushuFengQi-1.003.ttf');
}

function setup() {
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('layout-output');
    
    textAlign(CENTER, CENTER);
    canvas.hide();
    noLoop();
    UIFunction();
}

function UIFunction() {
    const downloadButtons = document.querySelector('.download-buttons');
    if (downloadButtons) {
        downloadButtons.style.display = 'none';
    }
    
    const outputCollection = document.querySelector('.outputcollection');
    
    outputCollection.addEventListener('mouseenter', function() {
        if (downloadButtons) {
            downloadButtons.style.opacity = '0';
            downloadButtons.style.display = 'flex';
            fadeIn(downloadButtons, 600);
        }
    });
    
    outputCollection.addEventListener('mouseleave', function() {
        if (downloadButtons) {
            fadeOut(downloadButtons, 600);
        }
    });
    
    const aboutButtons = document.getElementsByClassName("about");
    const aboutPages = document.getElementsByClassName("aboutpage");
    
    for (let i = 0; i < aboutPages.length; i++) {
        aboutPages[i].style.display = "none";
    }
    
    for (let i = 0; i < aboutButtons.length; i++) {
        aboutButtons[i].addEventListener("click", function(event) {
            event.stopPropagation();
            for (let j = 0; j < aboutPages.length; j++) {
                if (aboutPages[j].style.display === "none") {
                    aboutPages[j].style.display = "block";
                } else {
                    aboutPages[j].style.display = "none";
                }
            }
        });
    }
    
    document.addEventListener("click", function(event) {
        for (let i = 0; i < aboutPages.length; i++) {
            if (!aboutPages[i].contains(event.target) && 
                !aboutButtons[i].contains(event.target)) {
                aboutPages[i].style.display = "none";
            }
        }
    });
}

//Download Toggle
function fadeIn(element, duration) {
  element.style.opacity = '0';
  element.style.display = 'block';
  
  let start = null;
  function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);
      element.style.opacity = opacity.toString();
      
      if (progress < duration) {
          requestAnimationFrame(animate);
      }
  }
  requestAnimationFrame(animate);
}

function fadeOut(element, duration) {
  let start = null;
  const initialOpacity = parseFloat(element.style.opacity) || 1;
  
  function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = initialOpacity * (1 - Math.min(progress / duration, 1));
      element.style.opacity = opacity.toString();
      
      if (progress < duration) {
          requestAnimationFrame(animate);
      } else {
          element.style.display = 'none';
      }
  }
  requestAnimationFrame(animate);
}

function draw() {
    background(255);
    
    if (!inputText) return;
    
    const segments = parseTextSegments(inputText);
    
    if (isTraditional) {
        outputEven(segments);
    } else {
        outputNormal(segments);
    }
}

// Parse text into segments separated by punctuation
function parseTextSegments(text) {
    const cleanedText = text.replace(/[\s]+/g, '');
    
    const punctuationRegex = /[\u3002\uff0c\u3001]/g;
    
    const segments = [];
    let currentSegment = '';
    
    for (let char of cleanedText) {
        if (char.match(punctuationRegex)) {
            if (currentSegment) {
                segments.push(currentSegment);
                currentSegment = '';
            }
        } else {
            currentSegment += char;
        }
    }
    
    if (currentSegment) {
        segments.push(currentSegment);
    }
    
    return segments;
}

// "Normal" layout
function outputNormal(segments) {
  if (segments.length === 0) return;
  
  const usableHeight = canvasHeight - (2 * marginOutput);
  
  let fontSize = 130;
  
  const columnSpacingMultiplier = 1.0; 
  const charSpacingMultiplier = 1.5;   
  
  let columnSpacing = fontSize * columnSpacingMultiplier;
  

  const totalWidthNeeded = ((segments.length - 1) * columnSpacing) + fontSize;
  
  if (totalWidthNeeded > canvasWidth - (2 * marginOutput)) {

      const maxWidth = canvasWidth - (2 * marginOutput);
      fontSize = maxWidth / (((segments.length - 1) * columnSpacingMultiplier) + 1);
      columnSpacing = fontSize * columnSpacingMultiplier;
  }
  
  const maxSegmentLength = Math.max(...segments.map(s => s.length));
  const charSpacing = fontSize * charSpacingMultiplier;
  const maxHeightNeeded = marginOutput + fontSize + (maxSegmentLength * charSpacing);
  
  if (maxHeightNeeded > canvasHeight - marginOutput) {
      const availableHeight = usableHeight - fontSize;
      const neededCharSpacing = availableHeight / maxSegmentLength;
      const newFontSize = neededCharSpacing / charSpacingMultiplier;
      
      if (newFontSize < fontSize) {
          fontSize = newFontSize;
          columnSpacing = fontSize * columnSpacingMultiplier;
      }
  }
  
  const finalCharSpacing = fontSize * charSpacingMultiplier;
  
  if (nushuFont) {
      textFont(nushuFont);
  }
  textSize(fontSize);
  
  for (let col = 0; col < segments.length; col++) {
    const segment = segments[col];
    const x = canvasWidth - marginOutput - (col * columnSpacing);
    
    const startY = marginOutput + fontSize * 0.5;
    
    for (let i = 0; i < segment.length; i++) {
        const char = segment[i];
        const y = startY + (i * finalCharSpacing);
        
        if (y > canvasHeight - marginOutput) break;
        
        push();
        translate(x, y);
        fill(0);
        text(char, 0, 0);
        pop();
    }
  }
}

// "Evenly Spaced" layout
function outputEven(segments) {
    if (segments.length === 0) return;
    
    const maxChars = Math.max(...segments.map(s => s.length));
    const numColumns = segments.length;
    
    const usableWidth = canvasWidth - (2 * marginOutput);
    const usableHeight = canvasHeight - (2 * marginOutput);
    
    const columnWidth = usableWidth / numColumns;
    const cellHeight = usableHeight / maxChars;
    
    let fontSize = Math.min(cellHeight * 0.65);
    
    if (nushuFont) {
        textFont(nushuFont);
    }
    textSize(fontSize);
    
    for (let col = 0; col < segments.length; col++) {
      const segment = segments[col];
      const x = canvasWidth - marginOutput - (col * columnWidth) - (columnWidth / 2);
      
      const segmentHeight = segment.length * cellHeight;
      const startY = marginOutput + (usableHeight - segmentHeight) / 2;
      
      for (let i = 0; i < segment.length; i++) {
          const char = segment[i];
          const y = startY + (i * cellHeight) + (cellHeight / 2);
          
          push();
          translate(x, y);
          fill(0);
          text(char, 0, 0);
          pop();
      }
    }
}

// Run
function generateStyledText() {
    inputText = document.getElementById('inputText').value;
    isTraditional = document.getElementById('traditional').checked;
    
    if (!inputText.trim()) {
        alert('Please enter text.');
        return;
    }
    
    canvas.show();
    
    const outputCollection = document.querySelector('.outputcollection');
    outputCollection.style.display = 'block';
    
    const backgroundText = document.querySelector('.backgroundtext');
    backgroundText.style.display = 'none';
    
    redraw();
}

// Download as PNG
function downloadCanvas() {
    saveCanvas(canvas, 'NushuOutput', 'png');
}

// Download as PDF using jsPDF
function downloadPDF() {

    canvas.loadPixels();
    const imgData = canvas.canvas.toDataURL('image/png');
    
    if (typeof jspdf === 'undefined') {
        alert('PDF library not loaded. Please check your internet connection and try again.');
        return;
    }
    
    const widthMM = (canvasWidth / 72) * 25.4;
    const heightMM = (canvasHeight / 72) * 25.4;
    
    const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [widthMM, heightMM]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, widthMM, heightMM);
    
    pdf.save('NushuOutput.pdf');
}
