//CONNECT TO SOCKET

// const socket = io();

const main = document.querySelector(".main");
const overlay = document.querySelector(".overlay");
const inputBoard = document.querySelector(".input-board");
const formOverlay = document.querySelector(".form-overlay");
const btnSendOverlay = document.querySelector(".btn-send-overlay");

const navMenu = document.querySelector(".nav-menu");
const btnMenu = document.querySelector(".btn-menu");
const btnMenuCancel = document.querySelector(".btn-cancel");
const formChatbox = document.querySelector(".form-chatbox");

// INPUT ELEMENTS FOR CLIENTS
const chatInput = document.querySelector(".chatbox-input");
const btnSend = document.querySelector(".btn-send");

btnMenu.addEventListener("click", showMenu);
btnMenuCancel.addEventListener("click", hideMenu);

let data, username, present_id;
//  DEALING WITH THE OVERLAY
formOverlay.addEventListener("submit", async (e) => {
  e.preventDefault();
  username = e.target.elements["form-overlay-input"].value;

  if (username && username.length > 1) {
    overlay.classList.add("hide");
    inputBoard.classList.add("hide");
  }

  data = await makeCallToAPI("", "", "POST", username);

  renderServerMessage(data);
});

formChatbox.addEventListener("submit", async (e) => {
  e.preventDefault();
  // 1.) run input validation on client input
  let clientMessage = e.target.elements["chatbox-input"].value;

  if (!clientMessage || Number(clientMessage) > 99) {
    return;
  }

  renderMessage(clientMessage);

  e.target.elements["chatbox-input"].value = "";

  if (present_id == 1) {
    data = await makeCallToAPI(present_id, clientMessage);
  }

  if (clientMessage == 1) {
    data = await makeCallToAPI(clientMessage);
  }

  renderServerMessage(data);
});

function showMenu() {
  navMenu.classList.remove("hide-menu");
  navMenu.classList.add("show-menu");
}

function hideMenu() {
  navMenu.classList.remove("show-menu");
  navMenu.classList.add("hide-menu");
}

// DEALING WITH CLIENT INPUTS
function renderMessage(message) {
  // 2.) create markup for client text
  const markup = `
        <div class="msg client-message">
          <p>${message}</p>
        </div>`;

  //  3.) render text to DOM
  main.insertAdjacentHTML("afterbegin", markup);
}

async function makeCallToAPI(id = "", endpoint = "", method = "GET", username) {
  const options = {
    method,
    credentials: "include",
    // withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ username });

  method == "POST" ? (options.body = body) : "";

  console.log(options);

  const res = await fetch(
    `
  http://localhost:3030/api/v1/chatbot/${id}/${endpoint}`,
    options
  );

  return await res.json();
}

function renderServerMessage(data) {
  const messageHTML = displayData(data);
  const markup = `
    <div class="msg server-message">
      <p>${data.message}</p>
      <br/>
        ${messageHTML}
    </div>
  `;
  main.insertAdjacentHTML("afterbegin", markup);
}

function displayData(data) {
  const dataObj = data.data;

  if (!dataObj) return "";

  if (dataObj.instructions) {
    const p = document.createElement("p");
    dataObj.instructions.forEach((el) => {
      p.insertAdjacentHTML(
        "beforeend",
        `${el.option}. ${el.instruction} <br/>`
      );
    });
    return p.innerHTML;
  }

  if (dataObj.Items) {
    const p = document.createElement("p");
    dataObj.Items.forEach((el) => {
      p.insertAdjacentHTML("beforeend", `${el.id}. ${el.item} <br/>`);
    });
    return p.innerHTML;
  }

  if (dataObj.orders) {
    const div = document.createElement("div");
    dataObj.orders.forEach((el) => {
      const markup = `
        <div> 
          <span>${el.id}. ${el.dateCreated}</span>
          <p>You Bought ${el.itemsCount} items</p>
          <p>${el.items.forEach((elem) => {
            `${elem.items},`;
          })}</p>
          <span>Total Amount: ${el.amount}</span>
        </div>
        <br/>
      `;
      div.insertAdjacentHTML("beforeend", markup);
    });

    return div.innerHTML;
  }

  // select item
  if (dataObj.order) {
    const div = document.createElement("div");
    let count = 0;
    dataObj.order.forEach((el) => {
      const markup = `
        <div> 
          <span>${el.id}. ${el.dateCreated}</span>
          <p>You Bought ${el.itemsCount} items</p>
          <p>${el.items.forEach((elem) => {
            `${count++}. ${elem.items} - $${elem.amount}\n`;
          })}</p>
          <span>Total Amount: ${el.amount}</span>
        </div>
        <br/>
      `;
      div.insertAdjacentHTML("beforeend", markup);
    });

    return div.innerHTML;
  }
}
