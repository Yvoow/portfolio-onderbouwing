// =---= Charcters / word counter =---=
function countWordsAndCharacters() {
    var text = document.getElementById('extraInformation').value;
    var words = text.match(/\b\w+\b/g);
    var wordCount = words ? words.length : 0;
    document.getElementById('wordCount').innerText = wordCount + ' woorden ';
    
    var charCount = text.length;
    document.getElementById('charCount').innerText = charCount + ' karakters';
}