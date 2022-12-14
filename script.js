let addButton = document.querySelector(".addButton");
let removeButton = document.querySelector(".removeButton");
let lockEle = document.querySelector(".ticketLock");
let modalCont = document.querySelector(".modalContainer");
let mainCont = document.querySelector(".mainContainer");
let textAreaCont = document.querySelector(".textAreaContainer");
let colors = ["lightpink", "lightbue", "lightgreen", "black"]
let modalPriorityColor = colors[colors.length - 1];
let allPriorityColor = document.querySelectorAll(".priorityColor");
let toolBoxColors = document.querySelectorAll(".color");
let addFlag = false;
let removeFlag = false;

let ticketsArr = [];

if(localStorage.getItem("jiraTickets")){
    ticketsArr = JSON.parse(localStorage.getItem("jiraTickets"));
    ticketsArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    })
}

for(let i = 0; i < toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter((ticketObj, idx) => {
            return currentToolBoxColor === ticketObj.ticketColor;
        })

        let allTicketsContainer = document.querySelectorAll(".ticketContainer");
        for(let i = 0; i < allTicketsContainer.length; i++){
            allTicketsContainer[i].remove();
        }

        //display new filtered tickets
        filteredTickets.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })

    toolBoxColors[i].addEventListener("dblclick", (e) => {
        let allTicketsContainer = document.querySelectorAll(".ticketContainer");
            for(let i = 0; i < allTicketsContainer.length; i++){
                allTicketsContainer[i].remove();
            }

            ticketsArr.forEach((ticketObj, idx) => {
                createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
            })
    })
}


// modal priority coloring

allPriorityColor.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColor.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");

        let color = colorElem.classList[0];
        modalPriorityColor = color;
    })
})

addButton.addEventListener("click", (e) => {
    
    addFlag = !addFlag;

    if(addFlag){
        modalCont.style.display = "flex";
    }
    else{
        modalCont.style.display = "none";
    }
})

removeButton.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
})

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if(key == "Enter"){
        createTicket(modalPriorityColor, textAreaCont.value);
        addFlag = false;
        setModalToDefault();
    }
})

function createTicket(ticketColor, ticketTask, ticketID){
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticketContainer");
    ticketCont.innerHTML =  `
        <div class="ticketColor ${ticketColor}"></div>
        <div class="ticketID">#${id}</div>
        <div class="taskContainer">${ticketTask}</div>
        <div class="ticketLock">
            <i class="fa-solid fa-lock"></i>
        </div>
    `;
    mainCont.appendChild(ticketCont);

    //create obj of ticket and add to []
    if(!ticketID){
        ticketsArr.push({ticketColor, ticketTask, ticketID: id});
        localStorage.setItem("jiraTickets", JSON.stringify(ticketsArr));
    } 

    handleRemoval(ticketCont, id);
    handleLock(ticketCont, id);
    handleColor(ticketCont, id);
}

function handleRemoval(ticket, id){
    ticket.addEventListener("click", (e) => {
        if(!removeFlag){
            return;
        }
    
        let idx = getTicketIndex(id);
        ticketsArr.splice(idx, 1);
        let strTicketArr = JSON.stringify(ticketsArr);
        localStorage.setItem("jiraTickets", strTicketArr);

        ticket.remove();
    })
}

function handleLock(ticket, id){
    let LockEle = ticket.querySelector(".ticketLock");
    let ticketLock = LockEle.children[0];
    let ticketTaskArea = ticket.querySelector(".taskContainer");
    ticketLock.addEventListener("click", (e) => {
        let ticketIndex = getTicketIndex(id);

        if(ticketLock.classList.contains("fa-lock")){
            ticketLock.classList.remove("fa-lock");
            ticketLock.classList.add("fa-lock-open");
            ticketTaskArea.setAttribute("contenteditable", "true");
        }
        else{
            ticketLock.classList.remove("fa-lock-open");
            ticketLock.classList.add("fa-lock");
            ticketTaskArea.setAttribute("contenteditable", "false");
        }

        // modify data in local storage
        ticketsArr[ticketIndex].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("jiraTickets", JSON.stringify(ticketsArr));
    })
}

function handleColor(ticket, id){
    let ticketColor = ticket.querySelector(".ticketColor");
    ticketColor.addEventListener("click", (e) => {
        let ticketIndex = getTicketIndex(id);
        let currentTicketColor = ticketColor.classList[1];
        let currentTicketColorIndex = colors.findIndex((color) => {
            return currentTicketColor === color;
        })

        console.log(currentTicketColor, currentTicketColorIndex);
        currentTicketColorIndex++;
        let newTicketColorIndex = currentTicketColorIndex%colors.length;
        let newTicketColor = colors[newTicketColorIndex];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        ticketsArr[ticketIndex].ticketColor = newTicketColor;
        localStorage.setItem("jiratTickets", JSON.stringify(ticketsArr));
    })
     
}

function getTicketIndex(id) {
    let ticketIndex = ticketsArr.findIndex((ticketObj) => {
        return ticketObj.ticketID === id;
    })
    return ticketIndex;
}

function setModalToDefault(){
    modalCont.style.display = "none";
    textAreaCont.value = "";
    modalPriorityColor = colors[colors.length - 1];
    allPriorityColor.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    })
    allPriorityColor[allPriorityColor.length - 1].classList.add("border");
}


