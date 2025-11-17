// dit is de meme class, hier zit alle data van een meme in
class Meme{
    constructor(title, year, description, imageUrl, tags){
        this.title = title;
        this.year = year;
        this.description = description;
        this.imageUrl = imageUrl;
        this.tags = tags;
    }

    show(){
        // hier maak ik een card element voor de meme
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-300';
        
        // image toevoegen aan de card
        const img = document.createElement('img');
        img.src = this.imageUrl;
        img.alt = this.title;
        img.className = 'w-full h-56 object-cover border-b border-gray-100';
        card.appendChild(img);

        // div maken voor de content
        const content = document.createElement('div');
        content.className = 'p-5';

        // titel toevoegen
        const title = document.createElement('h3');
        title.className = 'text-xl font-bold text-gray-900 mb-2';
        title.textContent = this.title;
        content.appendChild(title);

        // jaartal toevoegen
        const year = document.createElement('p');
        year.className = 'text-gray-500 text-sm mb-3 font-medium';
        year.textContent = this.year;
        content.appendChild(year);

        // beschrijving toevoegen
        const description = document.createElement('p');
        description.className = 'text-gray-600 leading-relaxed mb-4 text-sm';
        description.textContent = this.description;
        content.appendChild(description);

        // div maken voor tags
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'flex flex-wrap gap-1';
        
        // door alle tags loopen en ze toevoegen
        for (let i = 0; i < this.tags.length; i++) {
            const tag = document.createElement('span');
            tag.className = 'bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs border border-gray-300';
            tag.textContent = this.tags[i].trim();
            tagsDiv.appendChild(tag);
        }
        
        content.appendChild(tagsDiv);
        card.appendChild(content);
        
        return card;
    }

    save(){
        // de meme naar de server sturen met XHR
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            console.log('Meme saved!');
            getData();
        };
        xhr.onerror = error;
        
        xhr.open('POST', 'write.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        let jsonData = {
            title: this.title,
            year: this.year,
            description: this.description,
            imageUrl: this.imageUrl,
            tags: this.tags
        };
        
        xhr.send(JSON.stringify(jsonData));
    }
}

// functie om data op te halen en te tonen
function success() {
    let data = JSON.parse(this.responseText);
    console.log(data);

    let container = document.getElementById('memesContainer');
    container.innerHTML = '';
    
    // door alle memes loopen
    for (let i = 0; i < data.length; i++) {
        let memeData = data[i];
        
        // kijken of url een externe link is of lokaal bestand
        let imageUrl = memeData.url;
        if (!memeData.url.includes('http')) {
            imageUrl = 'img/' + memeData.url;
        }
        
        // tags string omzetten naar array
        let tags = memeData.tags.split(',');
        
        // nieuwe meme aanmaken en op scherm zetten
        let meme = new Meme(memeData.title, memeData.year, memeData.description, imageUrl, tags);
        container.appendChild(meme.show());
    }
} 

function error(err) {
    console.error('An error Occurred :', err);
}

// functie voor het toevoegen van een nieuwe meme
function addMeme(e){
    e.preventDefault();
    
    // alle values uit het form halen
    let title = document.getElementById('title').value;
    let year = document.getElementById('year').value;
    let description = document.getElementById('description').value;
    let imageUrl = document.getElementById('imageUrl').value;
    let tags = document.getElementById('tags').value.split(',');

    // nieuwe meme maken en opslaan
    let newMeme = new Meme(title, year, description, imageUrl, tags);
    newMeme.save();
    
    // formulier weer leeg maken
    document.getElementById('newMeme').reset();
}

// get data from server. 
function getData(){
    let xhr = new XMLHttpRequest();
    xhr.onload = success;
    xhr.onerror = error;
    xhr.open('GET', 'read.php', true);
    xhr.send();
}

// get data 
getData();

window.addEventListener('load', ()=>{
    document.getElementById('addButton').addEventListener('click', addMeme);
})

