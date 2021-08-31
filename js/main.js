var siteName = document.getElementById("setName");
var siteUrl = document.getElementById("setUrl");
var addBtn = document.getElementById("subBtn");
var table = document.getElementById("crudTable");
var nameAlert = document.getElementById("nameAlert");
var urlAlert = document.getElementById("urlAlert");
var search = document.getElementById("search");
var sites = [];
var nameRejex = /^[A-Z a-z 0-9]{4,12}$/
var urlRejex = /^[w W]{3}[.][A-Z a-z 0-9]{4,15}[.][A-Z a-z]{2,63}$/  //DNS allows for a maximum of 63 characters for an individual label

tableVisibility();

if (JSON.parse(localStorage.getItem("sitesList") != null)) {
    sites = JSON.parse(localStorage.getItem("sitesList"));
    display();
}

siteName.onkeyup = function () {
    if (!nameRejex.test(siteName.value)) {
        addBtn.disabled = "true";
        siteName.classList.add("is-invalid");
        siteName.classList.remove("is-valid");
        nameAlert.classList.remove("d-none");
    }
    else {
        siteName.classList.add("is-valid");
        siteName.classList.remove("is-invalid");
        nameAlert.classList.add("d-none");
        disableRemove();
    }
}

siteUrl.onkeyup = function () {
    if (!urlRejex.test(siteUrl.value)) {
        addBtn.disabled = "true";
        siteUrl.classList.add("is-invalid");
        siteUrl.classList.remove("is-valid");
        urlAlert.classList.remove("d-none");
    }
    else {
        siteUrl.classList.add("is-valid");
        siteUrl.classList.remove("is-invalid");
        urlAlert.classList.add("d-none");
        disableRemove();
    }
}

function formReset() {
    siteName.classList.remove("is-valid");
    siteUrl.classList.remove("is-valid");
    addBtn.disabled = "true";
}

function disableRemove() {
    if (urlRejex.test(siteUrl.value) && nameRejex.test(siteName.value)) {
        addBtn.removeAttribute("disabled");
    }
}

addBtn.onclick = function () {
    if (addBtn.innerHTML == "Update") {
        sites[siteIndex].name = siteName.value;
        sites[siteIndex].url = siteUrl.value;
        addBtn.classList.replace("btn-warning","btn-primary");
        addBtn.innerHTML = "submit";
        localStorage.setItem("sitesList", JSON.stringify(sites));
    }
    else {
        addSite();
    }
    display();
    clearform();
    formReset();
}

function tableVisibility() {
    if (sites.length == 0) {
        table.classList.add("visually-hidden");
    }
    else {
        table.classList.remove("visually-hidden");
    }
}

function addSite() {
    var site =
    {
        name: siteName.value,
        url: siteUrl.value
    }

    sites.push(site);
    localStorage.setItem("sitesList", JSON.stringify(sites));
}

function display() {
    var trs = "";
    for (var i = 0; i < sites.length; i++) {
        trs += `<tr>
                <td>${i + 1}</td>
                <td>${sites[i].name}</td>
                <td>${sites[i].url}</td>
                <td><button onclick="visitSite(${i})" class="btn btn-info">Visit</button></td>
                <td><button onclick="updateSite(${i})" class="btn btn-warning">Edit</button></td>
                <td><button onclick="deleteSite(${i})" class="btn btn-danger">Delete</button></td>
            </tr>`
    }
    document.getElementById("tableBody").innerHTML = trs;
    tableVisibility();
}

function clearform() {
    siteName.value = siteUrl.value = "";
}

function deleteSite(index) {
    sites.splice(index, 1);
    localStorage.setItem("sitesList", JSON.stringify(sites));
    display();
}

function visitSite(index) {
    if (sites[index].url.search("http://") != true && sites[index].url.search("https://") != true) {
        sites[index].url = "http://" + sites[index].url;
    }
    open(sites[index].url, "_blank");
}

function updateSite(index) {
    window.siteIndex = index;
    siteName.value = sites[index].name;
    siteUrl.value = sites[index].url;
    addBtn.classList.replace("btn-primary", "btn-warning");
    addBtn.innerHTML = "Update";
    addBtn.removeAttribute("disabled");
}

search.onkeyup = function () {
    var searchVal = search.value;
    var trs = "";
    for (var i = 0; i < sites.length; i++) {
        if (sites[i].name.toLowerCase().includes(searchVal.toLowerCase())) {
            trs += `<tr>
                <td>${i + 1}</td>
                <td>${sites[i].name}</td>
                <td>${sites[i].url}</td>
                <td><button onclick="visitSite(${i})" class="btn btn-info">Visit</button></td>
                <td><button onclick="updateSite(${i})" class="btn btn-warning">Edit</button></td>
                <td><button onclick="deleteSite(${i})" class="btn btn-danger">Delete</button></td>
            </tr>`
        }
    }
    document.getElementById("tableBody").innerHTML = trs;
}