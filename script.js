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

  if (!username) return;

  overlay.classList.add("hide");
  inputBoard.classList.add("hide");

  data = await makeCallToAPI("", "", "POST", username);

  renderServerMessage(data);
});

formChatbox.addEventListener("submit", async (e) => {
  e.preventDefault();
  // 1.) run input validation on client input
  let clientMessage = e.target.elements["chatbox-input"].value;

  renderMessage(clientMessage);

  if (
    !clientMessage ||
    Number(clientMessage) > 99 ||
    (clientMessage > 10 && clientMessage < 97)
  ) {
    renderServerMessage({
      message: `Please make a request using bot instructions`,
    });
  }

  e.target.elements["chatbox-input"].value = "";

  const routes = ["99", "98", "97", "0"];

  if (clientMessage) {
    if (present_id == 1 && clientMessage && !routes.includes(clientMessage)) {
      data = await makeCallToAPI(present_id, clientMessage);
    }

    if (!present_id && clientMessage == "1")
      data = await makeCallToAPI(clientMessage);

    if (routes.includes(clientMessage)) {
      data = await makeCallToAPI(clientMessage);
    }

    renderServerMessage(data);

    if (clientMessage == "1") present_id = clientMessage;
  }
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
  try {
    const options = {
      method,
      mode: "cors",
      credentials: "include",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin":
          "https://zeuhz-orderbotconsumer-droid.netlify.app",
      },
    };

    const body = JSON.stringify({ username });

    method == "POST" ? (options.body = body) : "";

    const res = await fetch(
      `https://zeuhz-orderbot-droid.onrender.com/api/v1/chatbot${
        id ? "/" : ""
      }${id}${endpoint ? "/" : ""}${endpoint}`,
      options
    );

    return await res.json();
  } catch (error) {
    renderServerMessage({
      message: `The server is down at this time, please try again later`,
    });
  }
}

function renderServerMessage(data) {
  const messageHTML = displayData(data);
  const messages = ["Order cancelled😓.", "Order Placed👍."];
  if (messages.includes(data.message)) present_id = "";
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

  // constructs order instructions from server
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

  // constructs list of items from servere
  if (dataObj.Items) {
    const p = document.createElement("p");
    dataObj.Items.forEach((el) => {
      p.insertAdjacentHTML("beforeend", `${el.id}. ${el.item} <br/>`);
    });
    return p.innerHTML;
  }

  // constructs order history from server
  if (dataObj.orders) {
    const div = document.createElement("div");
    let count = 0;
    dataObj.orders.forEach((el) => {
      const markup = `
        <div> 
          <span>${++count}. ${el.dateCreated}</span>
          <p> <em>*</em> You Bought ${el.itemsCount} items</p>
          <p> <em>*</em> ${el.items.map((elem) => ` ${elem.item}`)}</p>
          <span> <em>*</em> Total Amount: $${el.amount}</span>
        </div>
        <br/>
      `;
      div.insertAdjacentHTML("beforeend", markup);
    });

    return div.innerHTML;
  }

  // select an item
  if (dataObj.order) {
    const div = document.createElement("div");
    let count = 0;
    console.log(dataObj.order);

    const { itemsCount, items, amount } = dataObj.order;

    const markup = `
        <div> 
          <p>${itemsCount} item(s) selected</p>
          <span>Total Amount: $${amount}</span>
        </div>
        <br/>
      `;
    div.insertAdjacentHTML("beforeend", markup);

    return div.innerHTML;
  }

  // select an item
  if (dataObj.currentOrder) {
    const div = document.createElement("div");
    let count = 0;

    const { itemsCount, items, amount } = dataObj.currentOrder;

    const markup = `
        <div> 
          <p>${itemsCount} item(s) selected</p>
           <p>${items.map(
             (elem) => `${++count}. ${elem.item} - $${elem.amount}\n`
           )}</p>
          <span>Total Amount: $${amount}</span>
        </div>
        <br/>
      `;
    div.insertAdjacentHTML("beforeend", markup);

    return div.innerHTML;
  }
}
