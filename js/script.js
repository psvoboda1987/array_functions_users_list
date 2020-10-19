window.onload = function() {

    // ?nat=us,dk,fr,gb nationality
    // ?inc=gender,name,nat include fields
    // ?exc=login exclude fields

    document.getElementById('add_user').addEventListener('click', (event) => {

        event.preventDefault();

        addUser();

    });

    document.getElementById('double_money').addEventListener('click', (event) => {

        event.preventDefault();

        doubleMoney();

    });

    document.getElementById('only_millionares').addEventListener('click', (event) => {

        event.preventDefault();

        showOnlyMillionares();

    });

    document.getElementById('sort_by_wealth').addEventListener('click', (event) => {

        event.preventDefault();

        sortByWealth();

    });

    document.getElementById('calculate_total').addEventListener('click', (event) => {

        event.preventDefault();

        showTotal();

    });

    initUsers(3);

}

function initUsers(userCount = 3) {

    getAjax(

        'php/proxy.php' + '?url=' + 'https://randomuser.me/api?results=' + userCount,

        (reply) => {

            reply = JSON.parse(reply);

            showDefaultUsers(reply)

        }

    );

}

function showDefaultUsers(reply) {

    let users = document.getElementById('users');

    if (validateReply(reply) === false) return;

    let results = reply.results;

    let html = '';

    results.forEach((result) => {

        result.money = splitNumberByThreeDigits(getRandomMoney());

        html += getUserTemplate(result);

    });

    users.innerHTML = html;

}

function getUserTemplate(user) {

    let html = '';
    let {email, cell, money} = user;
    let {first, last} = user.name;
    let {city, country} = user.location;
    
    html += `
        <p><b>name</b>: <span class="value">${first} ${last}</span></p>
        <p><b>age</b>: <span class="value">${user.dob.age}</span></p>
        <p><b>email</b>: <span class="value">${email}</span></p>
        <p><b>cell</b>: <span class="value">${cell}</span></p>
        <p><b>city</b>: <span class="value">${city}</span></p>
        <p><b>country</b>: <span class="value">${country}</span></p>
        <p><b>wealth</b>: 
            <span class="value">
                <span class="money">${money}</span> €
            </span>
        </p>
    `;
        
    return `<div class="user">${html}</div>`;

}

function addUser() {

    getAjax(

        'php/proxy.php' + '?url=' + 'https://randomuser.me/api',

        (reply) => {

            showNewUser(reply);

            updateTotal();

        }

    );

}

function getAllUsers() {

    return Array.from(document.getElementsByClassName('user'));

}

function doubleMoney() {

    let users = getAllUsers();

    let doubledValues = users.map(doubleMoneyValue);

    let n = 0;

    users.forEach((user) => {

        user.children[6].children[1].children[0].innerText = splitNumberByThreeDigits(doubledValues[n]);

        n++;

    });

    updateTotal();

}

function doubleMoneyValue(userWealth) {

    userWealth = userWealth.children[6].children[1].children[0].innerText;
    userWealth = removeSpaces(userWealth);
    userWealth = parseInt(userWealth);

    return userWealth * 2;

}

function showOnlyMillionares() {

    let millionares = getMillionares();

    let html = '';

    millionares.forEach((millionare) => {

        html += millionare.outerHTML;

    });

    document.getElementById('users').innerHTML = html;

    updateTotal();

}

function getMillionares() {

    let users = getAllUsers();

    return users.filter(filterMillionares);

}

function filterMillionares(user) {

    let wealth = user.children[6];

    let value = parseInt(removeSpaces(wealth.children[1].innerText));

    return value >= 1000000 ? user : false;

}

function sortByWealth() {

    let users = getAllUsers();

    users.sort(sortUsers);

    let html = '';

    users.forEach((user) => {

        html += user.outerHTML;

    });

    document.getElementById('users').innerHTML = html;

}

function sortUsers(a, b) {

    let usersA = a.children[6].children[1].children[0].innerText;
    usersA = removeSpaces(usersA);
    usersA = parseInt(usersA);

    let usersB = b.children[6].children[1].children[0].innerText;
    usersB = removeSpaces(usersB);
    usersB = parseInt(usersB);

    return (usersB - usersA);

}

function showTotal() {

    let totalHtml = document.getElementById('total');
    let total = splitNumberByThreeDigits(calculateTotal());

    totalHtml.innerHTML = `<b class="total">Total</b>: ${total} €`;

}

function calculateTotal() {

    let values = Array.from(document.getElementsByClassName('money'));

    return values.reduce(getTotal, 0);

}

function getTotal(total, number) {

    number = removeSpaces(number.innerText);
    number = parseInt(number);

    return total + number;

}

function updateTotal() {

    if (document.getElementsByClassName('total') == null) return;
    
    showTotal();

}

function getRandomMoney() {

    let money = Math.round((Math.random() * 1000000));

    if ((money > 300000) && (money < 600000)) {

        money = (money * 3);

    }

    return money;

}

function splitNumberByThreeDigits(num) {

    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');

}

function removeSpaces(num) {

    return num.replace(/ /g, '');

}

function validateReply(reply) {

    if (reply.info.results !== 0) return true;

    alert('No response');

    return false;

}

function showNewUser(reply) {

    let users = document.getElementById('users');

    reply = JSON.parse(reply);

    if (validateReply(reply) === false) return;

    let result = reply.results[0];
    result.money = splitNumberByThreeDigits(getRandomMoney());
    
    let html = getUserTemplate(result);
    
    users.innerHTML += html;

}

function getAjax(url, success = null) {
    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status == 200 && typeof success == 'function') {
            success(xhr.responseText);
        }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
    return xhr;
}