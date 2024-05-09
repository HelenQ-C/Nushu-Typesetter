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
    var segments = cleanedInput.split(punctuationRegex);
    var longestSegmentLength = segments.reduce((max, segment) => Math.max(max, segment.length), 0);

    // Replace punctuations with a line break for display
    var displayText = cleanedInput.replace(punctuationRegex, "<br>");

    if (isTraditional) {
        // Check if the number of punctuations exceeds the longest segment length + 1
        if (punctuations.length > longestSegmentLength + 1) {
            alert('The maximum punctuation break should be less than the number of the greatest character plus one.');
            return; // Stop the function if condition not met
        }
        
        var className = `style${longestSegmentLength}-${punctuations.length}column`;
        outputDiv.className = ''; // Clear previous classes
        outputDiv.classList.add('styled-text', className); // Apply selected style class

        // Update the output HTML
        outputDiv.innerHTML = `<p class="styled-text">${displayText}</p>`;
    } else {
        // Check if the number of punctuations exceeds 8 for normal style
        if (punctuations.length > 10) {
            alert('The maximum punctuation break should be less than 10.');
            return; // Stop the function if condition not met
        }

        outputDiv.className = 'normal-text'; // Clear previous classes and apply normal-text class
        outputDiv.innerHTML = `<p class="normal-text">${displayText}</p>`; // Display cleaned input with line breaks for punctuations
    }

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
