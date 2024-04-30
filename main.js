function applyStyles(numCharacters) {
    var styledText = document.getElementById('output');
    styledText.className = 'styled-text'; 

    if (numCharacters === 1) {
        styledText.classList.add('one-character');
    } else if (numCharacters === 2) {
        styledText.classList.add('two-characters');
    } else if (numCharacters === 3) {
        styledText.classList.add('three-characters');
    } else if (numCharacters === 4) {
        styledText.classList.add('four-characters');
    } else if (numCharacters === 5) {
        styledText.classList.add('five-characters');
    } else if (numCharacters === 6) {
        styledText.classList.add('six-characters');
    } else if (numCharacters === 7) {
        styledText.classList.add('seven-characters');
    } else if (numCharacters >= 22 && numCharacters <= 28) {
        styledText.classList.add('twenty-eight-characters');
    }
}

function generateStyledText() {
    var inputText = document.getElementById('inputText').value;
    var outputDiv = document.getElementById('output');
    inputText = inputText.replace(/[\u3002\uff1f\uff01\uff0c\u3001\uff1b\u201c\u201d\u300a\u300b\uff08\uff09\u3002\uff0c]/g, "");
    outputDiv.innerHTML = '<p class="styled-text">' + inputText + '</p>';

    var regex = /(<([^>]+)>)/ig;
    var cleanText = inputText.replace(regex, ''); 
    var numCharacters = cleanText.length;

    applyStyles(numCharacters);
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
            window.saveAs(blob,"output.png")
        })
    })
})