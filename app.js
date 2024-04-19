// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get,set, goOffline } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
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


const app = initializeApp(firebaseConfig);
// Get a reference to the database service

const database = getDatabase();
const email = "aapp@lima.com";
const password = "22gcb367wwbd9";

var fundo = document.getElementById('fundo');


function createListItem(msg) {
  var father = document.createElement('div');
  var lb = document.createElement('label');
  lb.innerHTML=msg.tag;

  var listItem = document.createElement('div');
  
  listItem.classList.add(msg.cont);

  var inputField = document.createElement('input');
  inputField.type = 'text';

  inputField.setAttribute("class",msg.lk);
  inputField.placeholder = 'Link para a imagem';

  inputField.value=msg.link;

  var deleteCheckbox = document.createElement('i');
  deleteCheckbox.setAttribute("class","material-icons");
  deleteCheckbox.style='font-size:36px;color:white;';
  deleteCheckbox.innerHTML="delete";

  var listItem2 = document.createElement('div');
  listItem2.classList.add(msg.cont);
  var inputField2 = document.createElement('input');
  inputField2.type = 'text';
  inputField2.classList.add(msg.d);
  inputField2.value=msg.desc;

  inputField2.placeholder = 'Descrição a imagem';

  deleteCheckbox.addEventListener("click",function(){
    let result = confirm("Deseja mesmo apagar?");
    if(result === true){
      father.remove();
    }
  });

  deleteCheckbox.addEventListener('change', function() {
      if (deleteCheckbox.checked) {
        let result = confirm("Deseja mesmo apagar?");
        if(result === true){
          father.remove();
        }
      }
  });

  listItem.appendChild(inputField);
  listItem.appendChild(deleteCheckbox);
  listItem2.appendChild(inputField2);

  father.appendChild(lb);
  father.appendChild(listItem);
  father.appendChild(listItem2);

  document.getElementById(msg.pid).appendChild(father);
}

// Add event listener to the "Add Item" button
document.getElementById('add-item-btn').addEventListener('click', function() {
  event.preventDefault();
  var msg ={link:"",desc:"",pid:"list-container",tag:"Imagem", cont:"list-item", lk:"lnk",d:"desc"};
  createListItem(msg);
});

document.getElementById('add-banner-btn').addEventListener('click', function() {
  event.preventDefault();
  var msg ={link:"",desc:"",pid:"banners", tag:"Banner", cont: "list-item-b", lk:"lnk-b",d:"desc-b"};
  createListItem(msg);
});

const auth = getAuth(app);
signInWithEmailAndPassword(auth,email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log("successfully logged");
    logged = true;
    getInfo();
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

var btSave = document.getElementById("btSave");
var background = document.getElementById("back");
//var mssg = document.getElementById("msg");
//var img = document.getElementById("lg");
var tel = document.getElementById("tel");
var links=document.getElementsByClassName('lnk');
var descs=document.getElementsByClassName('desc');
var links_b = document.getElementsByClassName('lnk-b');
var desc_b = document.getElementsByClassName('desc-b');

function update(){
    // Example: Read data from Firebase
    const usersRef = ref(database, 'gilConfig');
    
    const len = document.getElementById('list-container').childElementCount;
    const fotos = Array.from({ length: len }, () => '');
    const d = Array.from({ length: len }, () => '');

    for (var i=0; i<links.length; i++){
      fotos[i] = links[i].value;
      d[i] = descs[i].value;
    }

    const lenb = document.getElementById('banners').childElementCount;
    const bann = Array.from({length:lenb},()=> '');
    const dscb = Array.from({length:lenb},()=> '');

    for (var ind = 0;ind<links_b.length;ind++){
      bann[ind] = links_b[ind].value;
      dscb[ind] = desc_b[ind].value;
    }

    var t = background.value, base="", r=t;

    if(t.includes("https://drive.google.com/file/d/")){
      base="https://drive.google.com/thumbnail?id=";
      r = t.substring(t.indexOf("/d/") + 3, t.indexOf("/view"));
    }

    console.log("resilt: "+r);

    const info = {
        bc: base+r,
        lks:fotos.join('\n'),
        descpt:d.join('|'),
        tel:tel.value,
        msg:"",
        logo:"",
        banners:bann.join('\n'),
        dban:dscb.join('|')
    };

    set(usersRef, info).then(() => {
    console.log("Data saved successfully.");
    goOffline(database);
    alert("salvo");
    }).catch((error) => {
    console.error("Error saving data: ", error);
    goOffline(database);
    alert("erro");
    });
    console.log("updated called. I wanna know if it'll work now");
    event.preventDefault();
}

function getInfo(){
  const usersRef = ref(database, 'gilConfig');
      
  get(usersRef).then((snapshot) => {
      const info = snapshot.val();
      console.log(info);
      background.value=info.bc;
      document.body.style.backgroundImage='url("'+info.bc+'")';
      tel.value=info.tel;
      const ds = info.descpt.split('|');
      const fts  = info.lks.split('\n');
      const mbanners = info.banners.split('\n');
      const mdban = info.dban.split('|');

      var msg={link:"",desc:"",pid:"list-container",tag:"Imagem", cont:"list-item", lk:"lnk",d:"desc"};
      var msg2={link:"",desc:"",pid:"banners", tag:"Banner", cont: "list-item-b", lk:"lnk-b",d:"desc-b"};
      
      for (var ind=0, len=mbanners.length; ind<len; ind++){
        msg2.link = mbanners[ind];
        msg2.desc = mdban[ind];
        createListItem(msg2);
        console.log("creating banner element: "+ind);  
      }
      
      for (var i=0, len=fts.length; i<len; i++){
        msg.link = fts[i];
        msg.desc = ds[i];
        createListItem(msg);
        console.log("creating element: "+i);  
      }
      

      //mssg.value = info.msg;
      //img.value = info.logo;
  });

}

function setupButton(){
  btSave.addEventListener("click",update,false);
}

window.addEventListener('load',setupButton);

