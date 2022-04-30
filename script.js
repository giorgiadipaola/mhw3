
const artists= document.querySelectorAll('.autore');
for(const artist of artists ){
 artist.addEventListener('click', searchArt);
 artist.addEventListener('mouseover', onArtistOver);
}
const modalView=document.querySelector('#modal-view');
modalView.addEventListener('click', onModalClick);

const map_points= document.querySelectorAll('.map');
for(const point of map_points){
    point.addEventListener('click', onPointClick);
    point.addEventListener('mouseover', onPointOver);

}

const simartists= modalView.querySelector('#simartists');
simartists.addEventListener('click', onSimilarClick);
//------global-----//


function onClick(event){
    
    const opera= event.currentTarget;
    document.body.classList.add('no-scroll');
    console.log('cliccato');

    modalView.style.top= window.pageYOffset +'px';
    modalView.classList.remove("hidden");

}
function onModalClick(){
    
    modalView.classList.add("hidden");
    document.body.classList.remove('no-scroll');
    const modalView_div=modalView.querySelector("#bio");
    const bio_divs=modalView_div.querySelectorAll("div");
    for( const one of bio_divs)
    {
      one.innerHTML='';
    }
    const modalView_imgs= modalView.querySelector('#images');
    modalView_imgs.innerHTML='';
    const similarity= document.querySelector("#similarity");
    similarity.innerText='';
    simartists.classList.add('hidden');
   

}
function onXViewClick(event){

  search_view.classList.add("hidden");
  const paragraphs=document.querySelectorAll('.opened_view');
  for( const each of paragraphs){
    each.classList.remove("opened_view");
  each.classList.add("paragraph");
 }
  
 discover.classList.remove("hidden");
  const divs=search_view.querySelector("#contents");
  divs.innerText='';

}

function onPointClick(event){
    const point= event.currentTarget;
    const mapPointId= point.dataset.id;
    console.log("point cliccato: " +mapPointId);
    modalView.style.top= window.pageYOffset +'px';
    modalView.classList.remove("hidden");
    document.body.classList.add('no-scroll');
   
   const modalView_imgs=modalView.querySelector('#images');
    const image=document.createElement('img');
      image.src= sale[mapPointId].source;
      modalView_imgs.appendChild(image);
   
}



function onPointOver(event){
    const point=event.currentTarget;
    const image= point.querySelector('img');
    image.src= "black_point.png";
  
    setTimeout( function () {
        image.src= "point_map.png";
      }, 1000);
    }

    function onArtistOver(event){
        const artist= event.currentTarget;
        const name= artist.dataset.name;
          artist.textContent='show more';
          setTimeout( function () {
            artist.textContent= name;
          }, 2000);
    }


//------API ARTSY-----//
function searchArt(event){

  const artista= event.currentTarget;
   
  document.body.classList.add('no-scroll');
  console.log('cliccato');

  modalView.style.top= window.pageYOffset +'px';
  modalView.classList.remove("hidden");
    const artist= event.currentTarget.dataset.id;
    simartists.dataset.id=artist;
    console.log('Eseguo ricerca: ' + artist);
                                                                                 
    fetch("https://api.artsy.net/api/artists/" +artist ,
      {
        headers:
        {
          'X-XAPP-Token': token 
        }
      }
    ).then(onResponse).then(onJsonArt);
    
 }

 function onJsonArt(json){
   console.log(json);
    if(!json.name){
      const not_found= modalView.querySelector('#name');
      not_found.textContent= "Artist not found";
    
    }
 else{
   const nome= modalView.querySelector("#name");
    nome.textContent= json.name; 
    const biography= modalView.querySelector('#biography');
    biography.textContent = 'born in ' + json.birthday+' in ' + json.location;
   const imag= document.createElement('img');
   const links= json._links;
   const thumbnail= links.thumbnail;
  imag.src= thumbnail.href ;  
  const images=modalView.querySelector("#images");
  images.appendChild(imag);
  simartists.classList.remove('hidden');
  
}
 }

 function onSimilarClick(event){

  fetch("https://api.artsy.net/api/artists/" +simartists.dataset.id ,
  {
    headers:
    {
      'X-XAPP-Token': token 
    }
  }
).then(onResponse).then(onJsonArt2);
simartists.classList.add('hidden');
event.stopPropagation();

 
}

function onJsonArt2(json){
  const links= json._links;
  const similar_artists= links.similar_artists;
  let similar_url= similar_artists.href;

  fetch( similar_url,
    {
      headers:
      {
        'X-XAPP-Token': token 
      }
    }
  ).then(onResponse).then(onJsonArtworks);
    

 }


 function onJsonArtworks(json){
   console.log(json);
   const embedded=json._embedded;
   const artists= embedded.artists;
   const num= artists.length;
   for( let i=0; i<num; i++){
     let artist= artists[i];
     const links=artist._links;
     const name= artist.name;
     const thumb= document.createElement('div');
     const span= document.createElement('span');
     span.textContent=name;
     thumb.appendChild(span);
     const thumbnail= links.thumbnail;
     if(!thumbnail){
       continue;
     }
     const image_url=thumbnail.href;
     const image= document.createElement('img');
     image.classList.add("similar_artist");
     image.src=image_url;
     const similarity=modalView.querySelector("#similarity");
      similarity.appendChild(thumb);
      thumb.appendChild(image);
     

   }
 }
 function onResponse(response) {
   console.log('Risposta ricevuta');
   return response.json();
 }
 function onTokenResponse(response){
     return response.json();
 }
 
 function onTokenJson(json)
 {
   console.log(json)
   token = json.token;
   console.log(token);
 }
 
 //  credentials
 const client_id = '978fcf99e3b6c5781ba0';
 const client_secret = 'a6788bea0ec6d41893071b2da7c6ca36';
 
 let token;
 
 fetch("https://api.artsy.net/api/tokens/xapp_token" ,
     {
 
    method: "post",
    body:"client_id=" +client_id +'&client_secret=' +client_secret,
    headers:
    {
     'Content-Type': 'application/x-www-form-urlencoded',
    
    }
    
      }
     
 ).then(onTokenResponse).then(onTokenJson);
 


 function onDiscover(event){
    
    search_view.classList.remove("hidden");
    const paragraphs=document.querySelectorAll('.paragraph');
    for( const each of paragraphs){
      each.classList.add("opened_view");
    each.classList.remove("paragraph");
   }
   discover.classList.add("hidden");
    console.log('cliccato');
   
 }

 const discover= document.querySelector('#discover');
 discover.addEventListener('click', onDiscover);
 const search_view= document.querySelector('#modal-view-right');
 const  x= document.querySelector('#ics');
 x.addEventListener('click', onXViewClick);


  function onTokenResponse(response){
     return response.json();
 }

 //--------- libreria---------//
  function onJson(json){
   console.log(json);
   console.log('ricevuto');
   const content =document.querySelector('#contents');
   content.innerHTML='';


  let num = json.num_found;

  if(num> 4)
    num = 4;

  for(let i=0; i<num; i++)
  {
    const doc = json.docs[i]

    const title = doc.title;
  
    if(!doc.isbn)
    {
      console.log('salto');
      continue;
    }

    const isbn = doc.isbn[0];
  
    const copertina = 'http://covers.openlibrary.org/b/isbn/' + isbn + '-M.jpg';
  
    const brochure= document.createElement('div');
    
  brochure.classList.add('content');
  const img = document.createElement('img');
  img.src = copertina;
  const titolo = document.createElement('span');
  titolo.textContent = title;
  brochure.appendChild(img);
  brochure.appendChild(titolo);
  const content= document.querySelector('#contents');
  content.appendChild(brochure);}


 }

 

 function search(event){
   event.preventDefault();
   
   const search_input = document.querySelector('#subject');
   const search_value = encodeURIComponent(search_input.value);
   console.log('Sto cercando: ' + search_value);
   const url= 'http://openlibrary.org/search.json?q=' + search_value;
   console.log('URL: ' +url);
   fetch(url).then(onResponse).then(onJson);

 }

 const form= document.querySelector('form');
 form.addEventListener('submit', search);

 //--------------- libreria---------//

 