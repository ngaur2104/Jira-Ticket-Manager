let addButton = document.querySelector(".addButton");
let modalCont = document.querySelector(".modalContainer");
let mainCont = document.querySelector(".mainContainer");
let textAreaCont = document.querySelector(".textAreaContainer");
let addFlag = false;

addButton.addEventListener("click", (e) => {
    
    addFlag = !addFlag;

    if(addFlag){
        modalCont.style.display = "flex";
    }
    else{
        modalCont.style.display = "none";
    }
})

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if(key == "Shift"){
        createTicket();
        modalCont.style.display = "none";
        addFlag = false;
        textAreaCont.value = "";
    }
})

function createTicket(){
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticketContainer");
    ticketCont.innerHTML =  `
    <div class="ticketColor"></div>
    <div class="ticketID"></div>
    <div class="taskContainer"></div>
    `;
    mainCont.appendChild(ticketCont);
}