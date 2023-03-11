const main = document.querySelector(".main");

const navMenu = document.querySelector(".nav-menu");
const btnMenu = document.querySelector(".btn-menu");
const btnMenuCancel = document.querySelector(".btn-cancel");

// INPUT ELEMENTS FOR CLIENTS
const chatInput = document.querySelector(".chatbox-input");
const btnSend = document.querySelector(".btn-send");

let inputEvent;

btnMenu.addEventListener("click", showMenu);
btnMenuCancel.addEventListener("click", hideMenu);
chatInput.addEventListener("input", captureUserInput);
btnSend.addEventListener("click", renderClientMessage);

function showMenu() {
  navMenu.classList.remove("hide-menu");
  navMenu.classList.add("show-menu");
}

function hideMenu() {
  navMenu.classList.remove("show-menu");
  navMenu.classList.add("hide-menu");
}

// DEALING WITH CLIENT INPUTS
function captureUserInput(event) {
  inputEvent = event;
}

function renderClientMessage(e) {
  e.preventDefault();
  let clientMessage = inputEvent.target.value;
  // 1.) run some input validation on client input
  if (Number(clientMessage) > 99) {
    return;
  }

  // 2.) create markup for client text
  const markup = `
        <div class="msg client-message">
          <p>${clientMessage}</p>
        </div>`;
  //   4.) render text to DOM

  main.insertAdjacentHTML("afterbegin", markup);
  inputEvent.target.value = "";
}
