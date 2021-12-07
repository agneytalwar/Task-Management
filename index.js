const taskcontainer = document.querySelector(".task_container");
let globaltaskdata = [];


const inserttoDOM = (content) =>
  taskcontainer.insertAdjacentHTML("beforeend", content);

const savetolocalstorage = () =>
  localStorage.setItem("TaskMaster", JSON.stringify({ cards: globaltaskdata }));

const generateHTML = (taskData) =>
  `<div class="modal fade" tabindex="-1" aria-hidden="true" id="modal${taskData.id}">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
      </div>
      <div class="modal-body">
       <img src="${taskData.image}" style = "height: 300px; width: 100% ">
        <h5 class="card-title">${taskData.title}</h5>
        <p class="card-text">${taskData.description}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
 

  <div id=${taskData.id} class="col-md-6 col-lg-4 my-2">
<div class="card ">
<div class="card-header gap-2 d-flex justify-content-end">
    <!-- Featured -->
    <button class="btn btn-outline-info" name=${taskData.id} onclick="editCard.apply(this,arguments)">
        <i class="fal fa-pencil" name=${taskData.id}></i>
    </button>
    <button class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this, arguments)">
        <i class="far fa-trash-alt" name=${taskData.id} ></i>
    </button>
</div>
<div class="card-body">
    <img class="card-img"
        src=${taskData.image}
        alt="">
    <h5 class="card-title mt-4">${taskData.title}</h5>
    <p class="card-text">${taskData.description}</p>
    <span class="badge bg-primary">${taskData.type}</span>
</div>
<div class="card-footer ">
    <button class="btn btn-outline-success" name=${taskData.id} data-bs-toggle="modal" data-bs-target="#modal${taskData.id}">
        Open Task
    </button>
</div>
</div>
</div>

`;

const addNewCard = () => {
  //get task data
  const taskData = {
    id: `${Date.now()}`, //template literal
    title: document.getElementById("taskname").value,
    image: document.getElementById("imageURL").value,
    type: document.getElementById("tasktype").value,
    description: document.getElementById("taskdescription").value,
  };

  globaltaskdata.push(taskData);

  //update the local storage
  //localStorage.setItem("TaskMaster",taskData);
  //if we do this it will show TaskMaster [object Object] and not the value because it expects data in json format
  //since globaltaskdata is an array we cannot store it in json
  //we create an object with the key as cards and value with globaltaskdata(DOUBT*************)
  //localStorage.setItem("TaskMaster", JSON.stringify({ cards: globaltaskdata }));
  savetolocalstorage();
  // console.log(taskData);

  //generate HTML code for the card
  const newCard = generateHTML(taskData);

  //Inject it into the DOM
  //To do this we use a method called insert adjacent HTML
  inserttoDOM(newCard);

  //clear the form
  document.getElementById("taskname").value = "";
  document.getElementById("imageURL").value = "";
  document.getElementById("tasktype").value = "";
  document.getElementById("taskdescription").value = "";
  // we close the form by writing data-bs-dismiss="modal" in the save task option
  return;
};

//stringify- converts js object to json
//parse-Json to js object
const loadOldCards = () => {
  //check local storage
  const getData = localStorage.getItem("TaskMaster");

  //parse JSON data , if existing
  if (!getData) return;
  const taskcards = JSON.parse(getData);

  globaltaskdata = taskcards.cards;

  //generate HTML code for this data
  // for each will alter the original array but map will create a new copy which is better as we do not want to accidentally modify old data
  globaltaskdata.map((taskData) => {
    const newCard = generateHTML(taskData);
    //inject into the DOM
    inserttoDOM(newCard);
  });
  return;
};
//event is a glabally defined object in DOM
const deleteCard = (event) =>{
  const targetid=event.target.getAttribute("name");
  const elementtype=event.target.tagName;
  
  const removeTask=globaltaskdata.filter((task) => task.id !== targetid);
  globaltaskdata=removeTask;
  savetolocalstorage();

  //access DOM to remove card
  if(elementtype == "BUTTON"){
    return taskcontainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  }
    else{
      return taskcontainer.removeChild(
        event.target.parentNode.parentNode.parentNode.parentNode
      );
    }
} 

const editCard = (event) =>{
  //const targetid=event.target.getAttribute("name");
  const elementtype=event.target.tagName;

  let taskname;
  let tasktype;
  let taskdescription;
  let parentelement;
  let submitbutton;

  if(elementtype == "BUTTON"){
    parentelement=event.target.parentNode.parentNode;
  }
  else{
    parentelement=event.target.parentNode.parentNode.parentNode;   
  }

  //to check which child element do we need to access by number
  //console.log(parentelement.childNodes);
  //console.log(parentelement.childNodes[3].childNodes);
  //console.log(parentelement.childNodes[5].childNodes);

  taskname=parentelement.childNodes[3].childNodes[3];
  taskdescription=parentelement.childNodes[3].childNodes[5];
  tasktype=parentelement.childNodes[3].childNodes[7];
  submitbutton=parentelement.childNodes[5].childNodes[1];

  taskname.setAttribute("contenteditable","true");
  taskdescription.setAttribute("contenteditable","true");
  tasktype.setAttribute("contenteditable","true");
  submitbutton.setAttribute("onclick","saveEdit.apply(this,arguments)")
  submitbutton.innerHTML="Save Changes";
   
  //console.log(taskname,taskdescription,tasktype);
}

const saveEdit = (event) =>{
  const targetid=event.target.getAttribute("name");
  const elementtype=event.target.tagName;

  if(elementtype == "BUTTON"){
    parentelement=event.target.parentNode.parentNode;
  }
  else{
    parentelement=event.target.parentNode.parentNode.parentNode;   
  }

  const taskname=parentelement.childNodes[3].childNodes[3];
  const taskdescription=parentelement.childNodes[3].childNodes[5];
  const tasktype=parentelement.childNodes[3].childNodes[7];
  const submitbutton=parentelement.childNodes[5].childNodes[1];

  const updateddata={
    title:taskname.innerHTML,
    type:tasktype.innerHTML,
    description:taskdescription.innerHTML
  }

  const updatedglobaltaskdata=globaltaskdata.map((task) =>{
    if(task.id==targetid){
      return {...task, ...updateddata};
    }
    return task;
  });
  globaltaskdata=updatedglobaltaskdata

  console.log(targetid);
  console.log(globaltaskdata)

  savetolocalstorage();

  taskname.setAttribute("contenteditable","false");
  taskdescription.setAttribute("contenteditable","false");
  tasktype.setAttribute("contenteditable","false");
  submitbutton.innerHTML="Open Task";


}

