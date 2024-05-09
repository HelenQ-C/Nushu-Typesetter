function generateStyledText() {
    var inputText = document.getElementById('inputText').value;
    var outputDiv = document.getElementById('output');
    var isTraditional = document.getElementById('traditional').checked;

    // Remove all spaces, tabs, and newline characters before processing
    var cleanedInput = inputText.replace(/[\s]+/g, '');

    // Updated regex to include common Chinese punctuation
    var punctuationRegex = /[\u3002\uff0c\u3001]/g;

    // Match punctuations for counting
    var punctuations = cleanedInput.match(punctuationRegex) || [];

    // Check the number of punctuations
    if (punctuations.length > 8) {
        alert('The input must contain less than 8 sentences.');
        return; // Stop the function if too many punctuations
    }

    var segments = cleanedInput.split(punctuationRegex);
    var longestSegmentLength = segments.reduce((max, segment) => Math.max(max, segment.length), 0);

    // Replace punctuations with a line break for display
    var displayText = cleanedInput.replace(punctuationRegex, "<br>");

    // Choose class based on typesetting option
    var baseClass = isTraditional ? 'styled-text' : 'normal-text';
    outputDiv.className = ''; // Clear previous classes
    outputDiv.classList.add(baseClass); // Apply selected style class

    if (isTraditional) {
        var className = `style${longestSegmentLength}-${punctuations.length}column`;
        outputDiv.classList.add(className);
    }

    // Update the output HTML
    outputDiv.innerHTML = `<p class="${baseClass}">${displayText}</p>`;

    // Make the output collection visible
    $('.outputcollection').show();

    // Hide the background text
    $('.backgroundtext').css('display', 'none');
}

$(document).ready(function(){
    $("#run").click(generateStyledText);  // Bind the Run button to the generate function

    $("#button").click(function(){
        var outContainer = document.getElementById('outcontainer');
        var width = outContainer.offsetWidth;
        var height = outContainer.offsetHeight;

        domtoimage.toBlob(outContainer, {
            width: width,
            height: height
        }).then(function(blob){
            window.saveAs(blob, "NushuOutput.png");
        });
    });

    $('#button').hide();

    $('.outputcollection').hover(
        function() { // Mouse enter
            $('#button').stop(true, true).fadeIn(600);
        },
        function() { // Mouse leave
            $('#button').stop(true, true).fadeOut(600);
        }
    );
});
