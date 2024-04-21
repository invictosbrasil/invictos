// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, goOffline } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZt2GcKUNAuOxPf1zGXbU330wlKWMDMoI",
  authDomain: "teste1-52f37.firebaseapp.com",
  databaseURL: "https://teste1-52f37.firebaseio.com",
  projectId: "teste1-52f37",
  storageBucket: "teste1-52f37.appspot.com",
  messagingSenderId: "830217582096",
  appId: "1:830217582096:web:96d9bcfb7c6a7e99a7bc95"
};

var logged = false;
// Initialize Firebase

var phone, pf;

const app = initializeApp(firebaseConfig);
// Get a reference to the database service

const database = getDatabase();
const email = "aapp@lima.com";
const password = "22gcb367wwbd9";

const auth = getAuth(app);
signInWithEmailAndPassword(auth,email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log("successfully logged");
    logged = true;
      update();
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

function closeOverlay() {
  var imageOverlay = document.getElementById('image-overlay');
  imageOverlay.removeChild(imageOverlay.lastChild);
  imageOverlay.style.display = 'none';
}

var btclose = document.getElementById('bt-close');
btclose.addEventListener('click', ()=>{
  closeOverlay();
});

function createItem(msg){
  var father = document.createElement('div');
  father.setAttribute("class","cont");
  var divPic = document.createElement('div');
  divPic.setAttribute("class","el");
  var img = document.createElement('img');
  img.style.borderRadius="12px";
  img.setAttribute("class","icon");
  img.setAttribute("width","82");
  img.setAttribute("height","82");
  img.setAttribute("referrerpolicy","no-referrer");
  img.src=msg.link;
  var divTex = document.createElement('div');
  divTex.setAttribute("class","tx");
  divTex.innerHTML=msg.desc;
  
  var main = document.getElementById('main');
  var imageOverlay = document.getElementById('image-overlay');
  
  divPic.appendChild(img);
  img.addEventListener('click', () => {
    imageOverlay.style.display = 'flex';
    var big = document.createElement('img');
    big.src=msg.link;
    big.setAttribute("width","300");
    big.setAttribute("height","300");
    imageOverlay.appendChild(big);
  });

  father.appendChild(divPic);
  father.appendChild(divTex);

  divTex.addEventListener('click',function(){
    var txt = divTex.innerHTML;
    var u="https://wa.me/"+phone+"?text=Me%20interessei%20por%20este%20produto:%20"+txt.replaceAll(' ',"%20");
    window.location.href = u;
  });
  main.appendChild(father);
}

function createBanner(msg){
  var father = document.createElement('div');
  father.setAttribute("class","b-item");
  var pic = document.createElement('img');
  pic.src=msg.lk;
  pic.width="400";
  pic.height="125";
  father.appendChild(pic);
  document.getElementById('banners').appendChild(father);
}


function update(){
    // Example: Read data from Firebase
    const usersRef = ref(database, 'gilConfig');
    
    var msg = document.getElementById("title");
    //var img = document.getElementById("logo");
    var fotos = document.getElementsByClassName('icon');
    var tags = document.getElementsByClassName('tx');

    get(usersRef).then((snapshot) => {
        const info = snapshot.val();
        const links = info.lks.split('\n');
        const desc = info.descpt.split('|');
        const bann = info.banners.split('\n');
        const dsb = info.dban.split('|');

        //img.setAttribute("src",info.logo);
        //msg.innerHTML=info.msg;
        //bd.setAttribute('style','background-image: url('+info.bc+');');
        phone = info.tel;
        var m ={lk:"",ds:""};
        for(var ind=0;bann[0] !== "" && ind<bann.length;ind++){
          m.lk = bann[ind];
          m.ds = dsb[ind];
          createBanner(m);
        }

        for(var i=0;i<links.length;i++){
          var t = links[i], r=t, base="";
          if(t.includes("https://drive.google.com/file/d/")){
            base="https://drive.google.com/thumbnail?id=";
            r = t.substring(t.indexOf("/d/") + 3, t.indexOf("/view"));
//            r+="&authuser=0";
          }

          var param = {
            link:base+r,
            desc:desc[i]
          }
          createItem(param);
        }
        goOffline(database);
        console.log("data obtained: "+info);
        document.body.style.backgroundImage='url("'+info.bc+'")';
        console.log("Background image URL:", info.bc);
    });

}
