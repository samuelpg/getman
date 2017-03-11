var newS = document.querySelector("#new");
var historyS = document.querySelector("#history");
var modal = document.querySelector("#modal");
//var ls = new localStorage();
// request & responses variable (for history)
var ls = window.localStorage;
var responses = new Array();
var requests = new Array();
var app = {};
// Request Form variables
var url = document.querySelector("#url");
var method = document.querySelector("#method");
var data = document.querySelector("#data");
//Data input variables
var json = document.querySelector("#JSON");
var addpro = document.querySelector("#addproperty");
var sendjson = document.querySelector("#sendJSON");
var fd = document.querySelector("#FD");
var sendfd = document.querySelector("#sendForm");
var addfd = document.querySelector("#addform");
var formInput = document.querySelector("#forminput");
var urle = document.querySelector("#URLE");
var none = document.querySelector("#none");
var sendNone = document.querySelector("#sendNone");
var url2send = "";
//misc variables
var json2send = {};
//API
function newRequest(){
  modal.className = "modal";
}
function sendRequest(data2send){
  try{
    var request = new XMLHttpRequest();
    request.open(method.value,url.value,true);
    let id = getCurrentId();
    request.onload = function(e){
      addResponse(e, id)
    };
    request.setRequestHeader("Content-Type",data.value);
    request.send(data2send);
    addRequest(method.value, url.value, data.value);
    modal.className = "modal hidden";
  }catch(err){
    showErr(err);
  }
}
function sendEmptyRequest(){
  try{
    var request = new XMLHttpRequest();
    request.open(method.value, url.value, true);
    var id = getCurrentId();
    request.onload = function(e){
      addResponse(e, id);
    };
    modal.className = "modal hidden";
    request.send();
    addRequest(method.value, url.value, "Envio sin datos");
  }catch(err){
    showErr(err)
  }
}

function sendURLrequest(){
  try{
    var request = new XMLHttpRequest();
    request.open(method.value, url.value + "?" + url2send, true);
    request.setRequestHeader("Content-Type", data.value);
    var id = getCurrentId();
    request.onload = function(e){
      addResponse(e, id);
    };
    modal.className = "modal hidden";
    request.send();
    addRequest(method.value, url.value + "?" + url2send, "URLencoded");
  }catch(err){
    showErr(err)
  }
}

function changeInputs(){
  console.log(data.value);
  switch (data.value) {
    case "none":{
      allHidden();
      none.className = "show";
      break;}
    case "application/json":{
      allHidden();
      json.className = "show";
      break;}
    case "application/x-www-form-urlencoded":{
      allHidden();
      urle.className = "show";
      break;}
    case "multipart/form-data":{
      allHidden();
      fd.className = "show";
      break;}

  }
}
function addJSONproperty(){
  let type = document.querySelector("#typeJSON");
  let property = document.querySelector("#propertyJSON");
  let value = document.querySelector("#valueJSON");
  let table = document.querySelector("#json2send");
  let tr = document.createElement("tr");
  let tdp = document.createElement("td");
  tdp.setAttribute("class","property");
  tdp.textContent = property.value + ": ";
  switch (type.value) {
    case "number":{
      try{
        json2send[property.value] = parseInt(value.value);
        let tdn = document.createElement("td");
        tdn.textContent = value.value;
        tr.appendChild(tdp);
        tdn.setAttribute("class","number");
        tr.appendChild(tdn);
        table.appendChild(tr);
        break;
      }catch(err){
        console.log(err)
      }
    }
    case "text":{
      json2send[property.value] = value.value;
      let tdt = document.createElement("td");
      tdt.textContent = value.value;
      tr.appendChild(tdp);
      tdt.setAttribute("class","text");
      tr.appendChild(tdt);
      table.appendChild(tr);
      break;
    }
    case "JSON":{
      try{
        json2send[property.value] = JSON.parse(value.value);
        let tdj = document.createElement("td");
        tdj.textContent = value.value;
        tr.appendChild(tdp);
        tdj.setAttribute("class","object");
        tr.appendChild(tdj);
        table.appendChild(tr);
        break;
      }catch(err){
        showErr(err);
      }
    }
  }
}
function sendCreateJson(){
  if(document.querySelector("#string").value === "YES"){
    let sjson = JSON.stringify(json2send);
    sendRequest(sjson);
  }else{
    sendRequest(json2send);
  }
  json2send = {};
  reset();
}

function addFormInput(){
  let name = document.querySelector("#nameForm");
  let form2add = document.querySelector("#form");
  let label = document.createElement("label");
  if(formInput.value !== "other"){
    let x = document.createElement("input");
    x.setAttribute("type",formInput.value)
    x.setAttribute("name",name.value);
    label.textContent = name.value + ": ";
    label.appendChild(x);
    form2add.appendChild(label);
    form2add.appendChild(document.createElement("br"));
  }else{
    try{
      let x = document.createElement("input")
      x.setAttribute("type",document.querySelector("#otherForm").value)
      x.setAttribute("name",name.value);
      label.textContent = name.value + ": ";
      label.appendChild(x);
      form2add.appendChild(label);
      form2add.appendChild(document.createElement("br"));
    }catch(err){
      showErr(err);
    }
  }

}
function sendCreatedForm(){
  let form2send = document.querySelector("#form");
  let formData = new FormData(form2send);
  console.log(form2send);
  console.log(formData);
  sendRequest(formData);
  reset();
}
//URLencoded
var urlindex = 0;
function addURLencoded(){
    let name = document.querySelector("#nameURLE");
    let value = document.querySelector("#valueURLE");
    if(urlindex !== 0){
      url2send += "&";
    }
    url2send += name.value + "=" + value.value;
    urlindex += 1;
    let tr = document.createElement("tr");
    let tdn = document.createElement("td");
    tdn.textContent = name.value;
    let tdv = document.createElement("td");
    tdv.textContent = value.value;
    tr.appendChild(tdn);
    tr.appendChild(tdv);
    document.querySelector("#addedURL").appendChild(tr);
    name.value = "";
    value.value = "";
    console.log(url2send);
}

function sendURLencoded() {
    url2send = encodeURI(url2send);
    sendURLrequest();
    url2send = "";
    urlindex = 0;
    reset();
}

document.querySelector("#addURL").onclick = addURLencoded;
document.querySelector("#sendURL").onclick = sendURLencoded;
//MISC
function allHidden(){
  json.className = "hidden";
  fd.className = "hidden";
  urle.className = "hidden";
  none.className = "hidden";
}
function addResponse(e, i){
  console.log(e);
  setTimeout(function(){
    console.log(e.target);
    console.log(i);
    let tr = document.querySelector("#id"+i);
    console.log(tr);
    let tdr = tr.childNodes[5];
    let type = tr.childNodes[6];
    tdr.style.backgroundColor = "rgb(46, 0, 120)";
    tdr.style.color = "white";
    tdr.textContent = "Ver respuesta";
    tdr.setAttribute("onclick","seeResponse("+i+")");
    app = JSON.parse(ls.app);
    app.requests.forEach(function(req){
      if(req.id === i){
        req.res = true;
        req.response = e.target.response;
        console.log(req.response);
        req.restype = /*e.target.responseHeader*/typeof (e.target.response);
        type.textContent = req.restype;
      }
      ls.app = JSON.stringify(app);
    });
  },2000);
}
function addRequest(method, url, tdata){
  let id = getId();
  console.log(id);
  let app = JSON.parse(ls.app);
  let requests = app.requests;
  let request = {};
  request["method"] = method;
  request["url"] = url;
  request["tdata"] = tdata;
  let date = new Date();
  request["date"] = date.toString();
  request["id"] = id;
  request["res"] = false;
  request["response"] = "No recibida";
  request["restype"] = "null";
  requests.unshift(request);
  console.log(request);
  console.log(requests);
  if(requests.length > 30){
    requests.splice(30, 1);
  }
  app["requests"] = requests;
  ls.app = JSON.stringify(app);
  addToTableHistory(request, true);
}

function addToTableHistory(request, hex){
  let table = document.querySelector("#history");
  let tr = document.createElement("tr");
  tr.setAttribute("id","id"+request.id);
  let data = new Array;
  data.push("#" + request.id);
  data.push(request.date);
  data.push(request.method);
  data.push(request.url);
  data.push(request.tdata);
  data.forEach(function(i){
    let td = document.createElement("td");
    td.textContent = i;
    tr.appendChild(td);
  });
  let tdr = document.createElement("td");
  if(request.res){
    tdr.style.backgroundColor = "rgb(46, 0, 120)";
    tdr.style.color = "white";
    tdr.textContent = "Ver respuesta";
    tdr.setAttribute("onclick","seeResponse("+request.id+")");
  }else{
    tdr.textContent = "Sin respuesta"
  }
  tr.appendChild(tdr);
  let td = document.createElement("td");
  td.textContent = request.restype;
  tr.appendChild(td);
  if(hex){
    table.insertBefore(tr, table.firstChild);
  }else{
    table.appendChild(tr);
  }
}
function getId(){
  app = JSON.parse(ls.app);
  let a = app.id;
  app.id = a + 1;
  ls.app = JSON.stringify(app);
  return a;
}
function getCurrentId(){
  app = JSON.parse(ls.app);
  let a = app.id;
  return a;
}
function init(){
  if(typeof ls.app === "undefined"){
    ls.app = JSON.stringify({"id":0, "requests":[]});
  }else{
    let app = JSON.parse(ls.app);
    app.requests.forEach(function(i){
      addToTableHistory(i, false);
    })
  }
}
function seeResponse(id){
  app = JSON.parse(ls.app);
  app.requests.forEach(function(req){
    if(req.id === id){
      showReq(req.response);
      document.querySelector("#responseContent").className = "res";
    }
  })
}

function reset(){
    //JSON
    document.querySelector("#json2send").textContent = "";
    json2send = {};
    //form
    document.querySelector("#form").textContent = "";
    //url
    url2send = "";
    urlindex = 0;
    document.querySelector("#nameURLE").value = "";
    document.querySelector("#valueURLE").value = "";
    document.querySelector("#addedURL").textContent = "";
    document.querySelector("#modal").className = "modal hidden";
}
document.querySelector("#cancelRequest").onclick = reset;
window.onload = init;
//Functionality
var close = document.querySelector("#closeRes");
close.onclick = function(){
  document.querySelector("#responseContent").className = "hidden";
  document.querySelector("#showRes").textContent = "";
}
newS.onclick = newRequest;
data.onchange = changeInputs;
allHidden();
method.value = null;
data.value = null;
addpro.onclick = addJSONproperty;
sendNone.onclick = sendEmptyRequest;
addfd.onclick = addFormInput;
formInput.onchange = function(){
  if(formInput.value === "other"){
    document.querySelector("#otherForm").className = "";
  }else{
    document.querySelector("#otherForm").className = "hidden";
  }
}
sendfd.onclick = sendCreatedForm;
sendjson.onclick = sendCreateJson;

function showReq(object){
  if(typeof(object)==="string"){
    try{
      object = JSON.parse(object);
    }catch(e){
      console.log(e);
      document.querySelector("#showRes").textContent = object;
      document.querySelector("#responseContent").className = "res";
      return 0;
    }
  }
  let index = new Array();
  for (var x in object){
    index.push(x);
  }
  let table = document.createElement("table");
  index.forEach(function(i){
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    let td = document.createElement("td");
    th.style.backgroundColor = "rgb(171, 106, 255)";
    td.style.backgroundColor = "rgb(175, 175, 175)";
    th.textContent = i;
    if(typeof(object[i])==="string"){
      td.textContent = object[i];
    }else{
      let a = JSON.stringify(object[i]);
      td.textContent = a;
    }
    tr.appendChild(th);
    tr.appendChild(td);
    table.appendChild(tr);
  });
  document.querySelector("#showRes").appendChild(table);
  document.querySelector("#responseContent").className = "res";
}

function showErr(e){
  document.querySelector("#err").textContent = e;
  document.querySelector("#idid").className = "err";
}

document.querySelector("#closeErr").onclick = function(){
  document.querySelector("#idid").className = "err hidden";
  document.querySelector("#err").textContent = "";
}
