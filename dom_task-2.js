const url = "https://todollst.herokuapp.com/todo";
// const url = " http://localhost:3000/todo";
getData(url);
let tbody = document.querySelector(".tbody");
let inputVal = document.querySelector(".inputA");
let editVal = document.querySelector(".editTheTodo");
let textCo = document.querySelector("#error");
const addBtn = document.querySelector(".sub");
const styleIt = document.querySelector("styleMe");
const displayTime = document.querySelector(".display-time");
const loading = document.getElementById("#loading");

// Filtering
const search = document.getElementById("search");
const filterAll = document.querySelector(".f_all");
const filterCom = document.querySelector(".f_com");
const filterUncom = document.querySelector(".f_uncom");

//  Modal Mechanism
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelectorAll(".show-modal");
let editTheTodo = document.querySelector(".editTheTodo");
let update = document.querySelector(".update");

// Date and Time

// Time
function showTime() {
  let time = new Date();
  displayTime.innerText = time.toLocaleTimeString("en-US", { hour12: false });
  setTimeout(showTime, 1000);
}

showTime();

// Date
function updateDate() {
  let today = new Date();

  // return number
  let dayName = today.getDay(),
    dayNum = today.getDate(),
    month = today.getMonth(),
    year = today.getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // value -> ID of the html element
  const IDCollection = ["day", "daynum", "month", "year"];
  // return value array with number as a index
  const val = [dayWeek[dayName], dayNum, months[month], year];
  for (let i = 0; i < IDCollection.length; i++) {
    document.getElementById(IDCollection[i]).firstChild.nodeValue = val[i];
  }
}

updateDate();

// for opening of Modal
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

//for closing the Modal
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// fetching data and displaying it
async function showTemplate(data) {
  let html = "";
  data?.forEach((elem) => {
    html += `
     <tr class = ${elem?.status}  class="tr">
     <td class="styleName icon_item ">${elem?.name}</td>
     <td id="styleMe" class="icon_item styleTodo" data_id=${elem?.id}> 
        <svg xmlns="http://www.w3.org/2000/svg" class="designTodo" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
     </svg></td>
     <td id='edit_todo' class="icon_item show-modal" data_id=${elem?.id}><svg xmlns="http://www.w3.org/2000/svg" class="editTodo" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
       <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
     </svg></td>
     <td id="delete_todo" class="icon_item  " data_id=${elem?.id}><svg xmlns="http://www.w3.org/2000/svg" class="deleteTodo" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
       <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
     </svg></td>
   </tr>
     `;
  });
  document.getElementById("loading").style.display = "none";

  tbody.innerHTML = html;
}
// fetch function
async function getData(url) {
  const res = await fetch(url);
  let data = await res.json();
  showTemplate(data);
}

// Utils function to post
async function postTask(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// Search
search.addEventListener("keyup", async () => {
  let val = search.value;
  let res = await fetch(url);
  let data = await res.json();

  let filter = data?.filter((elem) => {
    return elem.name.match(val);
  });
  showTemplate(filter);
});

//Enter key Functionality
inputVal.addEventListener("keyup", async function (e) {
  if (e.key === "Enter") {
    let inputValue = inputVal.value;
    const res = await fetch(url);
    let data = await res.json();

    let resss = data.filter((elem) => {
      return elem.name.toLowerCase() === inputValue.toLowerCase();
    });

    if (resss.length === 0) {
      await postTask(url, { name: inputValue, status: "false" });
      inputVal.value = "";
      getData(url);
    } else {
      alert("Duplicate data found Please Enter new One ");
    }
  }
});

// Filter data

// all

filterAll.addEventListener("click", async () => {
  // load;
  const res = await fetch(url);
  let data = await res.json();
  await showTemplate(data);
});

// completd

filterCom.addEventListener("click", async () => {
  const res = await fetch(url);
  let data = await res.json();
  let resu = data?.filter((elem) => elem.status === "true");
  await showTemplate(resu);
});

// uncompleted

filterUncom.addEventListener("click", async () => {
  const res = await fetch(url);
  let data = await res.json();
  let resu = data?.filter((elem) => elem.status === "false");
  await showTemplate(resu);
});

// Adding  the input todo to Todo list

tbody.addEventListener("click", async (e) => {
  let click = e.target.closest(".icon_item");
  if (!click) return;
  let id = click.getAttribute("data_id");
  let performTask = e.target.closest(".icon_item").id;
  //delete tdo
  if (performTask === "delete_todo") {
    await deleteTask(`${url}/${id}`);
    await getData(url);
  }
  // edit todo
  if (performTask === "edit_todo") {
    const res = await fetch(`${url}/${id}`);
    let data = await res.json();
    openModal();
    editTheTodo.value = data?.name;
    update.addEventListener("click", async (e) => {
      await editTodo(`${url}/${id}`, { name: editTheTodo.value });
      closeModal();
      getData(url);
    });
  }

  // adding style
  if (performTask === "styleMe") {
    const res = await fetch(`${url}/${id}`);
    let data = await res.json();
    if (data?.status === "false") {
      let res = await editTodo(`${url}/${id}`, { status: "true" });
      await getData(url);
    } else {
      let res = await editTodo(`${url}/${id}`, { status: "false" });
      await getData(url);
    }
  }
});
// util to delete the Todo
async function deleteTask(url) {
  await fetch(url, {
    method: "DELETE",
  });
}

// Edit the Todo
async function editTodo(url, data) {
  let res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (res.ok) {
    console.log("hi");
  }
  return res;
}

// Dark Mode
function darkMode() {
  var darkmode = document.body;
  darkmode.classList.toggle("dark");
}

// add task to db
addBtn.addEventListener("click", async () => {
  let inputValue = inputVal.value;

  const res = await fetch(url);
  let data = await res.json();

  let resss = data.filter((elem) => {
    return elem.name.toLowerCase() === inputValue.toLowerCase();
  });

  if (resss.length === 0) {
    await postTask(url, { name: inputValue, status: "false" });
    inputVal.value = "";
    getData(url);
  } else {
    alert("Enter some todo into it ");
  }
});

// Window Open and Close
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
