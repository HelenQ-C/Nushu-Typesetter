function applyStyles(numCharacters, numPunctuations) {
    var styledText = document.getElementById('output');
    styledText.className = '';  // Clear previous classes
    styledText.classList.add('styled-text');

    var className = `style${numCharacters}-${numPunctuations}column`;
    console.log("Applying class: ", className);  // Diagnostic output
    styledText.classList.add(className);
}

function generateStyledText() {
    var inputText = document.getElementById('inputText').value;
    var outputDiv = document.getElementById('output');

    // Remove all spaces, tabs, and newline characters before processing
    var cleanedInput = inputText.replace(/[\s]+/g, '');

    // Updated regex to include common Chinese punctuation
    var punctuationRegex = /[\u3002\uff0c\u3001]/g

    // Match punctuations for counting
    var punctuations = cleanedInput.match(punctuationRegex) || [];

    // Calculate the longest segment length between punctuations
    var segments = cleanedInput.split(punctuationRegex);
    var longestSegmentLength = segments.reduce((max, segment) => Math.max(max, segment.length), 0);

    // Replace punctuations with a line break for display
    var displayText = cleanedInput.replace(punctuationRegex, "<br>");

    // Update the output HTML to include formatted text with line breaks after punctuation
    outputDiv.innerHTML = '<p class="styled-text">' + displayText + '</p>';

    applyStyles(longestSegmentLength, punctuations.length);
}

$(document).ready(function(){
    $("#button").click(function(){
        generateStyledText();

        var outContainer = document.getElementById('outcontainer');
        var width = outContainer.offsetWidth;
        var height = outContainer.offsetHeight;
        
        domtoimage.toBlob(outContainer, {
            width: width,
            height: height
        })
        .then(function(blob){
            window.saveAs(blob, "output.png");
        });
    });
});
