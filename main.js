document.addEventListener('DOMContentLoaded', function() {
    var outputDiv = document.getElementById('output');
    var inputText = document.getElementById('inputText');
    var generateButton = document.getElementById('generateButton');

    generateButton.addEventListener('click', function() {
        var text = inputText.value.trim(); // Get the trimmed input text
        if (text) {
            // Replace special characters with line breaks
            text = text.replace(/[\u3002\uff1f\uff01\uff0c\u3001\uff1b\u201c\u201d\u300a\u300b\uff08\uff09\u3002\uff0c]/g, "");
            
            outputDiv.innerHTML = ''; // Clear the output grid

            // Split the input text into individual characters
            var characters = text.split('');
            
            // Create a grid item for each character
            characters.forEach(function(character) {
                var gridItem = document.createElement('div');
                gridItem.textContent = character;
                gridItem.classList.add('grid-item');
                outputDiv.appendChild(gridItem);
            });
        } else {
            alert('Please enter some text.');
        }
    });
});

$(document).ready(function(){
    $("#button").click(function(){
        var outContainer = document.getElementById('outcontainer');
        var width = outContainer.offsetWidth;
        var height = outContainer.offsetHeight;
        
        domtoimage.toBlob(outContainer, {
            width: width,
            height: height
        })
        .then(function(blob){
            window.saveAs(blob,"output.png")
        })
    })
})