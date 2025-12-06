const REQ_INFO = {
  length: {
    text: "Minimum Length: ",
    addNum: true
  },
  lower: {
    text: "Minimum Lowercase Letters: ",
    addNum: true
  },
  upper: {
    text: "Minimum Uppercase Letters: ",
    addNum: true
  },
  number: {
    text: "Minimum Numeric Digits: ",
    addNum: true
  },
  special: {
    text: "Minimum Special Characters: ",
    addNum: true
  },
  extended: {
    text: "Minimum Non-Keyboard Characters: ",
    addNum: true
  },
  unique: {
    text: "Minimum Unique Characters: ",
    addNum: true
  },
  similarity: {
    text: "Not similar to previous password",
    addNum: false
  },
  prohibitCommon: {
    text: "Not on known passwords list",
    addNum: false
  },
  prohibitUserName: {
    text: "Does not include your username",
    addNum: false
  },
  prohibitFirstName: {
    text: "Does not include your first name",
    addNum: false
  },
  prohibitLastName: {
    text: "Does not include your last name",
    addNum: false
  },
  prohibitEmail: {
    text: "Does not include your email",
    addNum: false
  },
  strength: {
    text: "Minimum strength: ",
    addNum: false
  }
}

let defaultData = {
  users: {
    admin: {
      details: {
        userName: 'admin',
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@pbcu.org',
        password: 'admin'
      },
      previousPasswords: ['admin'],
      accounts: [
        {
          id: generateAccountNumber(false),
          type: "Savings",
          nickname: "My Savings",
          balance: 0,
          transactions: []
        }
      ],
      requests: {
        deposits: [],
        incomingExternals: [],
        internalTranfers: [],
        connections: []
      },
      connections: []
    }
  }, 
  configuration: {
    requirements: {
      length: 8,
      lower: 1,
      upper: 1,
      number: 1,
      special: 1,
      extended: 1,
      unique: 6,
      similarity: 70,
      prohibitCommon: true,
      prohibitFirstName: true,
      prohibitLastName: true,
      prohibitUserName: true,
      prohibitEmail: true,
      strength: "medium"
    },
    scoreWeights: {
      lower: 2,
      upper: 3,
      number: 1,
      special: 5,
      extended: 10,
      unique: 7
    },
    strengths: [
      {
        name: "Very Strong",
        threshold: 2500,
        bgColorClass: "bg-success",
        textColorClass: "text-success",
        id: "veryhigh"
      }, 
      {
        name: "Strong",
        threshold: 2000,
        bgColorClass: "bg-success-subtle",
        textColorClass: "text-success",
        id: "high"
      }, 
      {
        name: "Medium",
        threshold: 1500,
        bgColorClass: "bg-warning",
        textColorClass: "text-warning",
        id: "medium"
      }, 
      {
        name: "Weak",
        threshold: 1000,
        bgColorClass: "bg-danger-subtle",
        textColorClass: "text-danger",
        id: "low"
      },
      {
        name: "Very Weak",
        threshold: 0,
        bgColorClass: "bg-danger",
        textColorClass: "text-danger",
        id: "verylow"
      }
      
    ]
  }
}

let appData = {}

function initData() {
  let storedAppDataString = localStorage.getItem("appData")
  if (storedAppDataString != null) {
    appData = JSON.parse(storedAppDataString)
  } else {
    appData = JSON.parse(JSON.stringify(defaultData))
  }
  if (typeof appData.loggedInUser !== 'undefined') {
    logInUser(appData.loggedInUser)
  }


  
  //TODO: Move elsewhere
  if (typeof appData.loggedInUser !== 'undefined') {
    let adminLinkContainer = document.getElementById("admin-page-link")
    if (adminLinkContainer != null && appData.loggedInUser.details.userName == 'admin') {
        adminLinkContainer.style.display = 'block'
    }

    let firstNameInput = document.getElementById("first-name-input")
    let lastNameInput = document.getElementById("last-name-input")
    let emailInput = document.getElementById("email-input")

    if (firstNameInput != null) {
      firstNameInput.value = appData.loggedInUser.details.firstName
    }
    if (lastNameInput != null) {
      lastNameInput.value = appData.loggedInUser.details.lastName
    }
    if (emailInput != null) {
      emailInput.value = appData.loggedInUser.details.email
    }
  }

  let passwordChecksList = document.getElementById("password-checks-list")
  if (passwordChecksList) {
    for (let reqKey of Object.keys(appData.configuration.requirements)) {
      let req = appData.configuration.requirements[reqKey]
      if (!req) {
        let checkContainer = document.getElementById(reqKey + "-check-container")
        if (checkContainer) {
          checkContainer.style.setProperty('display', 'none', 'important')
        }
      } else {
        let minOutput = document.getElementById(reqKey + "-min-output")
        if (minOutput) {
          let text = minOutput.textContent.split(":")[0] + ": " + req
          minOutput.textContent = text
        }
      }
    }
    if (!appData.configuration.requirements.similarity) {
      let checkContainer = document.getElementById("easy-check-container")
      checkContainer.style.setProperty('display', 'none', 'important')
    }
    if (!appData.configuration.requirements.prohibitCommon) {
      let checkContainer = document.getElementById("previous-check-container")
      checkContainer.style.setProperty('display', 'none', 'important')
    }
  }
}

function saveData() {
  if (appData.loggedInUser) {
    appData.users[appData.loggedInUser.details.userName] = appData.loggedInUser
  }
  localStorage.setItem("appData", JSON.stringify(appData))
}

function loginByKeyDown(event) {
  if (event.code == 'Enter') {
    logInByForm()
  }
}

function logInByForm() {
  let username = document.getElementById("login-username").value
  let password = document.getElementById("login-password").value
  let user = appData.users[username]
  if (typeof user !== 'undefined' && user.details.password == password) {
    logInUser(user)
  }
}

function logInUser(user) {
  appData.loggedInUser = JSON.parse(JSON.stringify(user))
  saveData()
  loggedInOutRedirect()
}

function loggedInOutRedirect() {
  if (window.location.href.includes("index") || window.location.href.endsWith("jmood-dev.github.io/banking")  || window.location.href.endsWith("jmood-dev.github.io/banking/")) {
    window.location.href = "html/landing.html"
  }
  let isLoggedIn = (typeof appData.loggedInUser !== 'undefined')
  if (isLoggedIn) {
    if (appData.loggedInUser.details.userName != "admin" && window.location.href.includes("admin") || window.location.href.includes("landing")) {
      window.location.href = "home.html"
    }
  } else {
    if (window.location.href.includes("home") || window.location.href.includes("settings") || window.location.href.includes("admin") || window.location.href.includes("requests") || window.location.href.includes("transfers") || window.location.href.includes("account")) {
      window.location.href = "landing.html"
    }
  }
}

function logout() {
  if (typeof appData.loggedInUser !== 'undefined') {
    delete appData.loggedInUser
    saveData()
    loggedInOutRedirect()
  }
}

function checkSignUpInput() {
  checkPasswordInput()
  checkSignUpInputNotNull()  
}

function checkSignUpInputNotNull() {
  let usernameInput = document.getElementById("username-input")
  let firstNameInput = document.getElementById("first-name-input")
  let lastNameInput = document.getElementById("last-name-input")
  let emailInput = document.getElementById("email-input")

  if (usernameInput != null && usernameInput.value == '' || firstNameInput != null && firstNameInput.value == '' || 
        lastNameInput != null && lastNameInput.value == '' || emailInput != null && emailInput.value == '') {
    let saveButton = document.getElementById("sign-up-button")
    if (saveButton == null) {
      saveButton = document.getElementById("change-password-button")
    }
    saveButton.disabled = true
  }
}

function signUpForm() {
  let usernameInput = document.getElementById("username-input")
  let firstNameInput = document.getElementById("first-name-input")
  let lastNameInput = document.getElementById("last-name-input")
  let emailInput = document.getElementById("email-input")
  let passwordInput = document.getElementById("password-input-1")

  let signupIssues = ""
  if (usernameInput.value == '') {
    signupIssues += "Username cannot be blank.<br>"
  }
  if (firstNameInput.value == '') {
    signupIssues += "First name cannot be blank.<br>"
  }
  if (lastNameInput.value == '') {
    signupIssues += "Last name cannot be blank.<br>"
  }
  if (emailInput.value == '') {
    signupIssues += "Email cannot be blank.<br>"
  }

  for (let user of Object.values(appData.users)) {
    if (user.details.userName == usernameInput.value) {
      signupIssues += "Username is already in use.<br>"
    }
    if (user.details.email == emailInput.value) {
      signupIssues += "Email is already in use.<br>"
    }
  }

  if (signupIssues.length > 0) {
    document.getElementById("signup-check-output").innerHTML = signupIssues
    return
  }

  let newUser = {}
  newUser.details = {}
  newUser.details.userName = usernameInput.value
  newUser.details.firstName = firstNameInput.value
  newUser.details.lastName = lastNameInput.value
  newUser.details.email = emailInput.value
  newUser.details.password = passwordInput.value
  newUser.previousPasswords = [passwordInput.value]
  newUser.accounts = [{
    id: generateAccountNumber(),
    type: "Savings",
    nickname: "My Savings",
    balance: 0,
    transactions: []
  }]
  newUser.requests = {
    deposits: [],
    incomingExternals: [],
    internalTranfers: [],
    connections: []
  },
  newUser.connections = []

  appData.users[usernameInput.value] = newUser
  saveData()
  logInUser(newUser)

}

function changeDetails() {
  let firstNameInput = document.getElementById("first-name-input")
  let lastNameInput = document.getElementById("last-name-input")
  let emailInput = document.getElementById("email-input")

  let changeDetailsIssues = ""
  if (firstNameInput.value == '') {
    changeDetailsIssues += "First name cannot be blank.<br>"
  }
  if (lastNameInput.value == '') {
    changeDetailsIssues += "Last name cannot be blank.<br>"
  }
  if (emailInput.value == '') {
    changeDetailsIssues += "Email cannot be blank.<br>"
  }

  for (let user of Object.values(appData.users)) {
    if (user.details.email == emailInput.value && appData.loggedInUser.details.email != emailInput.value) {
      changeDetailsIssues += "Email is already in use.<br>"
    }
  }

  document.getElementById("change-details-check-output").innerHTML = changeDetailsIssues
  if (changeDetailsIssues.length > 0) {
    return
  }

  appData.loggedInUser.details.firstName = firstNameInput.value
  appData.loggedInUser.details.lastName = lastNameInput.value
  appData.loggedInUser.details.email = emailInput.value

  appData.users[appData.loggedInUser.details.userName] = JSON.parse(JSON.stringify(appData.loggedInUser))
  saveData()
}

function changePassword() {
  let passwordInput1 = document.getElementById("password-input-1")
  let passwordInput2 = document.getElementById("password-input-2")

  appData.loggedInUser.details.password = passwordInput1.value
  appData.loggedInUser.previousPasswords.push(passwordInput1.value)
  appData.users[appData.loggedInUser.details.userName] = JSON.parse(JSON.stringify(appData.loggedInUser))
  saveData()

  passwordInput1.value = ''
  passwordInput2.value = ''

  document.getElementById("password-checker-floating-output").style.display = "none"
  let saveButton = document.getElementById("sign-up-button")
  if (saveButton == null) {
    saveButton = document.getElementById("change-password-button")
  }
  saveButton.disabled = true
}

function initAdmin() {
  let userList = document.getElementById("user-list")
  userList.replaceChildren()
  for (let user of Object.values(appData.users)) {
    if (user.details.userName != 'admin') {
      let listItem = document.getElementById("user-list-item-template").content.firstElementChild.cloneNode(true)
      listItem.querySelector(".username-list-item").innerHTML=user.details.userName
      listItem.querySelector(".delete-user-button").onclick=() => {deleteUser(user.details.userName)}
      userList.append(listItem)
    }
  }

  for (let weightKey in appData.configuration.scoreWeights) {
    let weightInput = document.getElementById(weightKey + "-score-input")
    weightInput.value = appData.configuration.scoreWeights[weightKey]
  }

  for (let reqKey of Object.keys(appData.configuration.requirements)) {
    if (reqKey == 'prohibitCommon') {
      document.getElementById("prohibitCommon-req-checkbox").checked = appData.configuration.requirements[reqKey]
    } else if (reqKey == 'prohibitFirstName') {
      document.getElementById("prohibitFirstName-req-checkbox").checked = appData.configuration.requirements[reqKey]
    } else if (reqKey == 'prohibitLastName') {
      document.getElementById("prohibitLastName-req-checkbox").checked = appData.configuration.requirements[reqKey]
    } else if (reqKey == 'prohibitUserName') {
      document.getElementById("prohibitUserName-req-checkbox").checked = appData.configuration.requirements[reqKey]
    } else if (reqKey == 'prohibitEmail') {
      document.getElementById("prohibitEmail-req-checkbox").checked = appData.configuration.requirements[reqKey]
    } else if (reqKey == 'strength') {
      document.getElementById("min-strength-group-select").value = appData.configuration.requirements[reqKey] ? appData.configuration.requirements[reqKey] : 'none'
      setMinStrengthSelectColor()
    } else {
      document.getElementById(reqKey + "-req-input").value = appData.configuration.requirements[reqKey]
    }
  }

  for (let i = 0; i < appData.configuration.strengths.length; i++) {
    let strengthThresholdInput = document.getElementById(appData.configuration.strengths[i].id + "-strength-threshold-input")
    strengthThresholdInput.value = appData.configuration.strengths[i].threshold
    
    if (i < appData.configuration.strengths.length - 1) {
      strengthThresholdInput.min = appData.configuration.strengths[i+1].threshold + 1
    }
    if (i > 0) {
      strengthThresholdInput.max = appData.configuration.strengths[i-1].threshold - 1
    }
  }
}

function deleteUser(userName) {
  let confirmed = confirm(`Are you sure you want to delete user ${userName}? All of this user's data WILL BE LOST and cannot be restored!`)
  if (confirmed) {
    delete appData.users[userName]
    saveData()
    document.getElementById("user-list").replaceChildren()
    initAdmin()
  }
}

function updateConfiguration() {
  for (let reqKey of Object.keys(appData.configuration.requirements)) {
    if (reqKey == 'prohibitCommon' || reqKey == 'prohibitFirstName' || reqKey == 'prohibitLastName' || reqKey == 'prohibitUserName' || reqKey == 'prohibitEmail') {
      let reqCheckbox = document.getElementById(reqKey + "-req-checkbox")
      appData.configuration.requirements[reqKey] = reqCheckbox.checked
    } else if (reqKey == 'strength') {
      appData.configuration.requirements[reqKey] = document.getElementById("min-strength-group-select").value == 'none' ? null : document.getElementById("min-strength-group-select").value
    } else {
      let reqInput = document.getElementById(reqKey + "-req-input")

      //validate requirements input
      if (reqInput.min && Number(reqInput.value) < Number(reqInput.min)) {
        reqInput.value = reqInput.min
      } else if (reqInput.max && Number(reqInput.value) > Number(reqInput.max)) {
        reqInput.value = reqInput.max
      }
      if (reqInput.value == "") {
        reqInput.value = appData.configuration.requirements[reqKey]
      }

      appData.configuration.requirements[reqKey] = Number(reqInput.value)
    }
  }

  for (let weightKey of Object.keys(appData.configuration.scoreWeights)) {
    weightInput = document.getElementById(weightKey + "-score-input")

    //validate requirements input
    if (weightInput.min && Number(weightInput.value) < Number(weightInput.min)) {
      weightInput.value = weightInput.min
    }
    if (weightInput.value == "") {
      weightInput.value = appData.configuration.scoreWeights[weightKey]
    }

    appData.configuration.scoreWeights[weightKey] = Number(weightInput.value)
  }

  for (let i = 0; i < appData.configuration.strengths.length; i++) {
    let strengthThresholdInput = document.getElementById(appData.configuration.strengths[i].id + "-strength-threshold-input")
    
    if (strengthThresholdInput.min && Number(strengthThresholdInput.value) < Number(strengthThresholdInput.min)) {
      strengthThresholdInput.value = strengthThresholdInput.min
    } else if (strengthThresholdInput.max && Number(strengthThresholdInput.value) > Number(strengthThresholdInput.max)) {
      strengthThresholdInput.value = strengthThresholdInput.max
    }
    if (strengthThresholdInput.value == "") {
      strengthThresholdInput.value = appData.configuration.strengths.length[i]
    }
    
    appData.configuration.strengths[i].threshold = Number(strengthThresholdInput.value)
  }

  for (let i = 0; i < appData.configuration.strengths.length; i++) {
    let strengthThresholdInput = document.getElementById(appData.configuration.strengths[i].id + "-strength-threshold-input")
    
    if (i < appData.configuration.strengths.length - 1) {
      strengthThresholdInput.min = appData.configuration.strengths[i+1].threshold + 1
    }
    if (i > 0) {
      strengthThresholdInput.max = appData.configuration.strengths[i-1].threshold - 1
    }
  }

  setMinStrengthSelectColor()
  saveData()
}

function setMinStrengthSelectColor() {
  let minStrengthSelect = document.getElementById("min-strength-group-select")

  for (let strength of appData.configuration.strengths) {
    minStrengthSelect.classList.remove(strength.bgColorClass)
    if (strength.id == appData.configuration.requirements.strength) {
      minStrengthSelect.classList.add(strength.bgColorClass)
    }
  }
  
}

function resetPasswordConfiguration() {
  appData.configuration = JSON.parse(JSON.stringify(defaultData.configuration))
  saveData()
  initAdmin()
}

function initHome() {
  let totalBalance = 0
  let accountList = document.getElementById("account-list")
  accountList.replaceChildren()
  for (let i = 0; i < appData.loggedInUser.accounts.length; i++) {
    let account = appData.loggedInUser.accounts[i]
    let listItem = document.getElementById("account-list-item-template").content.firstElementChild.cloneNode(true)
    listItem.querySelector(".account-name").innerHTML = account.nickname
    listItem.querySelector(".account-name").href = "account.html?id=" + appData.loggedInUser.accounts[i].id
    listItem.querySelector(".account-type").innerHTML = "Type: " + account.type
    listItem.querySelector(".account-balance").innerHTML = "Balance: " + formatCurrency(account.balance)
    totalBalance += account.balance
    accountList.append(listItem)
  }
  document.getElementById('accounts-total-balance').innerText = "Total balance: " + formatCurrency(totalBalance)

  updateRequestsBadge()
}

function loadNote(index) {
  let note = appData.loggedInUser.notes[index]
  appData.currentNoteIndex = index

  document.getElementById("note-edit-container").style.display = 'block'
  document.getElementById("note-name-input").value = note.name != '' ? note.name : '(Untitled Note)'
  document.getElementById("note-content-input").value = note.content

  saveData()
}

function updateNote() {
  document.getElementById("note-edit-container").style.display = 'block'

  let note = appData.loggedInUser.notes[appData.currentNoteIndex]
  note.name = document.getElementById("note-name-input").value
  note.content = document.getElementById("note-content-input").value
  appData.loggedInUser.notes[appData.currentNoteIndex] = note

  saveData()
  initHome()
}

function checkCanOpenAccount() {
  document.getElementById('open-account-button').disabled = document.getElementById('open-account-type').value == 'select' || document.getElementById('open-account-name-input').value == ''
}

function openAccount() {
  
  let newAccount = {
    id: generateAccountNumber(),
    type: document.getElementById('open-account-type').value,
    nickname: document.getElementById('open-account-name-input').value,
    balance: 0,
    transactions: []
  }
  
  document.getElementById('open-account-type').value = 'select'
  document.getElementById('open-account-name-input').value = ''

  appData.loggedInUser.accounts.push(newAccount)

  postAlert("Opened new account " + newAccount.nickname + " (" + newAccount.type + ")", 'success')

  saveData()
  initHome()
  checkCanOpenAccount()
}

function deleteCurrentNote() {
  appData.loggedInUser.notes.splice(appData.currentNoteIndex, 1)
  saveData()
  initHome()

  document.getElementById("note-edit-container").style.display = 'none'

  document.getElementById("note-name-input").value = ''
  document.getElementById("note-content-input").value = ''
}

function initAccountPage() {
  let account = findUserAndAccountForAccountNumber((new URLSearchParams(window.location.search)).get('id')).account
  document.getElementById('account-name').innerText = account.nickname
  document.getElementById('account-type').innerText = "Type: " + account.type
  document.getElementById('account-id').innerText = "Account Number: " + account.id
  document.getElementById('account-balance').innerText = "Balance: " + formatCurrency(account.balance)

  let transactionsTable = document.getElementById('transactions-table')
  for (let transaction of account.transactions) {
    let rowItem = document.getElementById("transaction-row-item-template").content.firstElementChild.cloneNode(true)
    rowItem.querySelector('.date-time-row').innerText = (new Date(transaction.dateTime)).toLocaleString()
    rowItem.querySelector('.description-row').innerText = transaction.description
    rowItem.querySelector('.type-row').innerText = transaction.type
    rowItem.querySelector('.amount-row').innerText = formatCurrency(transaction.amount)
    if (transaction.amount < 0) {
      rowItem.querySelector('.amount-row').classList.add("subtracted-amount")
    } else {
      rowItem.querySelector('.amount-row').classList.add("added-amount")
    }

    rowItem.querySelector('.balance-row').innerText = formatCurrency(transaction.balance)
    transactionsTable.append(rowItem)
  }

  updateRequestsBadge()
}

function initTransferUI() {
  transferUiContainer = document.getElementById('transfer-ui-container')
  transferUiContainer.replaceChildren()

  document.getElementById('transfer-type').value = 'select'

  updateRequestsBadge()
}

function updateTransferUI(event) {
  transferUiContainer = document.getElementById('transfer-ui-container')
  transferUiContainer.replaceChildren()

  let transferUi = {}
  if (event.target.value == "Deposit") {
    transferUi = document.getElementById("deposit-item-template").content.firstElementChild.cloneNode(true)
    let accountSelect = transferUi.querySelector(".deposit-account-select")
    for (let account of appData.loggedInUser.accounts) {
      let option = document.createElement("option")
      option.value = account.id
      option.innerText = account.nickname + " (" + formatCurrency(account.balance) + ")"
      accountSelect.append(option)
    }
  } else if (event.target.value == "Internal") {
    transferUi = document.getElementById("internal-transfer-item-template").content.firstElementChild.cloneNode(true)
    let sourceAccountSelect = transferUi.querySelector('.transfer-source-select')
    for (let account of appData.loggedInUser.accounts) {
      let option = document.createElement("option")
      option.value = account.id
      option.innerText = account.nickname + " (" + formatCurrency(account.balance) + ")"
      sourceAccountSelect.append(option)
    }
    for (let connection of appData.loggedInUser.connections) {
      let {user, account} = findUserAndAccountForAccountNumber(connection.accountId)
      let option = document.createElement("option")
      option.value = "connection " + connection.accountId
      option.innerText = user.details.firstName + " " + user.details.lastName + ": " + account.nickname + " (" + account.type + ")"
      sourceAccountSelect.append(option)
    }

    let option = document.createElement("option")
    option.value = 'newConnection'
    option.innerText = '(Link New Account)'
    sourceAccountSelect.append(option)
  } else if (event.target.value == "External") {
    transferUi = document.getElementById("external-transfer-item-template").content.firstElementChild.cloneNode(true)
    let userAccountSelect = transferUi.querySelector('.external-transfer-user-account-select')
    for (let account of appData.loggedInUser.accounts) {
      let option = document.createElement("option")
      option.value = account.id
      option.innerText = account.nickname + " (" + formatCurrency(account.balance) + ")"
      userAccountSelect.append(option)
    }
  }

  transferUiContainer.append(transferUi)
}

function requestDeposit() {
  let amount = document.querySelector('.deposit-amount-input').value
  if (amount < 0.01) {
    postAlert("You cannot deposit an amount less than $0.01", 'dark')
    return
  }

  let newDepositRequest = {
    user: appData.loggedInUser.details.userName,
    accountId: document.querySelector('.deposit-account-select').value,
    amount: amount
  }
  document.querySelector('.deposit-amount-input').value = ''
  appData.users['admin'].requests.deposits.push(newDepositRequest)
  saveData()
  updateRequestsBadge()
  postAlert("Deposit of " + formatCurrency(newDepositRequest.amount) + " sent for approval.", 'primary')
}

function transferSourceSelected() {
  let internalTransferDestinationDiv = document.querySelector(".internal-transfer-destination-div")
  
  internalTransferDestinationDiv.querySelector('.transfer-destination-select')
  let sourceAccountSelect = document.querySelector('.transfer-source-select')

  let internalTransferNewConnectionDiv = document.querySelector('.internal-transfer-new-connection-div')
  let internalTransferAmountDiv = document.querySelector('.internal-transfer-amount-div')

  if (document.getElementById('transfer-source-select').value == 'newConnection') {
    internalTransferDestinationDiv.classList.add("hidden")
    internalTransferAmountDiv.classList.add("hidden")
    internalTransferNewConnectionDiv.classList.remove("hidden")
  } else {
    internalTransferDestinationDiv.classList.remove("hidden")
    internalTransferNewConnectionDiv.classList.add("hidden")

    let destnationAccountSelect = document.getElementById('transfer-destination-select')
    destnationAccountSelect.replaceChildren()
    destnationAccountSelect.append(document.createElement('option'))
    for (let account of appData.loggedInUser.accounts) {
      if (sourceAccountSelect.value != account.id) {
        let option = document.createElement("option")
        option.value = account.id
        option.innerText = account.nickname + " (" + formatCurrency(account.balance) + ")"
        destnationAccountSelect.append(option)
      }
    }
    if (!sourceAccountSelect.value.includes('connection')) {
      for (let connection of appData.loggedInUser.connections) {
        if (sourceAccountSelect.value != connection.accountId) {
          let {user, account} = findUserAndAccountForAccountNumber(connection.accountId)
          let option = document.createElement("option")
          option.value = "connection " + connection.accountId
          option.innerText = user.details.firstName + " " + user.details.lastName + ": " + account.nickname + " (" + account.type + ")"
          destnationAccountSelect.append(option)
        }
      }
    }

    let option = document.createElement("option")
    option.value = 'newConnection'
    option.innerText = '(Link New Account)'
    destnationAccountSelect.append(option)

    internalTransferDestinationDiv.classList.remove("hidden")

    internalTransferAmountDiv.classList.add("hidden")
    document.querySelector('.internal-transfer-amount-input').value = ''
  }
}

function transferDestinationSelected() {
  let internalTransferNewConnectionDiv = document.querySelector('.internal-transfer-new-connection-div')
  let internalTransferAmountDiv = document.querySelector('.internal-transfer-amount-div')

  if (document.getElementById('transfer-destination-select').value == 'newConnection') {
    internalTransferAmountDiv.classList.add("hidden")
    internalTransferNewConnectionDiv.classList.remove("hidden")
  } else {
    internalTransferAmountDiv.classList.remove("hidden")
    internalTransferNewConnectionDiv.classList.add("hidden")
  }
  
}

function requestInternalTransfer() {
  let amount = Number(document.querySelector('.internal-transfer-amount-input').value)

  if (amount < 0.01) {
    postAlert("You cannot tranfer an amount less than $0.01", 'dark')
    return
  }

  let destnationAccountSelectValue = document.getElementById('transfer-destination-select').value
  let destnationAccount = appData.loggedInUser.accounts.find(e => e.id == destnationAccountSelectValue)
  let destinationUser = {}
  if (destnationAccountSelectValue.includes("connection")) {
    destnationAccount = findUserAndAccountForAccountNumber(destnationAccountSelectValue.split(" ")[1]).account
    destinationUser = findUserAndAccountForAccountNumber(destnationAccountSelectValue.split(" ")[1]).user
  }

  let sourceAccountSelectValue = document.getElementById('transfer-source-select').value
  let sourceAccount = appData.loggedInUser.accounts.find(e => e.id == sourceAccountSelectValue)
  if (sourceAccountSelectValue.includes("connection")) {
    let {user, account} = findUserAndAccountForAccountNumber(sourceAccountSelectValue.split(" ")[1])
    sourceAccount = account
    let newInternalTransferRequest = {
      user: appData.loggedInUser.details.userName,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destnationAccount.id,
      amount: amount
    }
    user.requests.internalTranfers.push(newInternalTransferRequest)
    postAlert("Transfer of " + formatCurrency(amount) +  " from " + user.details.firstName + " " + user.details.lastName + "'s " +account.nickname + " sent for approval.", 'primary')
  } else {
    if (sourceAccount.balance - amount < 0) {
      postAlert("Insufficient funds to complete transfer.", 'dark')
      return
    }

    sourceAccount.balance -= amount
    destnationAccount.balance += amount
    
    let sourceTransactionDescription = "Transfer to " + destnationAccount.nickname
    let destinationTransactionDescription = "Transfer from " + sourceAccount.nickname
    let transferToText = destnationAccount.nickname
    if (destnationAccountSelectValue.includes("connection")) {
      sourceTransactionDescription = "Transfer to " + destinationUser.details.firstName + " " + destinationUser.details.lastName + "'s " + destnationAccount.nickname
      destinationTransactionDescription = "Transfer from " + appData.loggedInUser.details.firstName + " " + appData.loggedInUser.details.lastName + "'s " + sourceAccount.nickname
      transferToText = destinationUser.details.firstName + " " + destinationUser.details.lastName + "'s " + destnationAccount.nickname
    }

    let sourceTransaction = {
      dateTime: new Date(),
      description: sourceTransactionDescription,
      type: "Internal Transfer",
      amount: -amount,
      balance: new Number(sourceAccount.balance)
    }
    sourceAccount.transactions.unshift(sourceTransaction)

    let destinationTransaction = {
      dateTime: new Date(),
      description: destinationTransactionDescription,
      type: "Internal Transfer",
      amount: amount,
      balance: new Number(destnationAccount.balance)
    }
    destnationAccount.transactions.unshift(destinationTransaction)
    postAlert(destinationTransactionDescription + " to " + transferToText + " of " + formatCurrency(amount) + " was successful.", 'success')
  }

  saveData()
  initTransferUI()
  updateRequestsBadge()
}

function checkCanRequestConnection() {
  document.getElementById('internal-transfer-new-connection-request-button').disabled = document.getElementById('internal-transfer-new-connection-input').value == ''
}

function requestNewConnection() {
  let accountNumber = document.getElementById('internal-transfer-new-connection-input').value
  
  let user = findUserAndAccountForAccountNumber(accountNumber) ? findUserAndAccountForAccountNumber(accountNumber).user : null
  if (!user) {
    postAlert("No account found with number " + accountNumber, 'dark')
  }
  else if (user.details.userName == appData.loggedInUser.details.userName) {
    postAlert("You cannot link to your own account.", 'dark')
  } else if (appData.loggedInUser.connections.find( e => e.accountId == accountNumber )) {
    postAlert("You are already connected to this account.", 'dark')
  } else {
    let newConnectionRequest = {
      user: appData.loggedInUser.details.userName,
      accountId: accountNumber
    }
    user.requests.connections.push(newConnectionRequest)
    saveData()
    updateRequestsBadge()
    postAlert("Request to connect to account with number " + accountNumber + " sent for approval.", 'primary')
  }
  initTransferUI()
}

function checkCanRequestExternalTranfer() {
  document.getElementById('external-transfer-request-button').disabled = document.getElementById('external-transfer-direction-select').value == '' || document.getElementById('external-transfer-routing-number-input').value == '' || document.getElementById('external-transfer-account-number-input').value == ''
}

function requestExternalTransfer() {
  let userAccount = appData.loggedInUser.accounts.find(e => e.id == document.getElementById('external-transfer-user-account-select').value)
  let transferDirection = document.getElementById('external-transfer-direction-select').value
  let transferRoutingNumber = document.getElementById('external-transfer-routing-number-input').value
  let transferAccountNumber = document.getElementById('external-transfer-account-number-input').value
  let transferAmount = document.getElementById('external-transfer-amount-input').value

  if (transferAmount < 0.01) {
    postAlert("You cannot transfer an amount less than $0.01", 'dark')
    return
  }

  if (transferDirection == 'outgoing') {
    if (userAccount.balance - transferAmount < 0) {
      postAlert("Insufficient funds to complete transfer.", 'dark')
      return
    }

    userAccount.balance -= transferAmount

    let transaction = {
      dateTime: new Date(),
      description: "Transfer to " + transferRoutingNumber + " " + transferAccountNumber,
      type: "External Transfer",
      amount: -transferAmount,
      balance: new Number(userAccount.balance)
    }
    userAccount.transactions.unshift(transaction)
    postAlert(transaction.description + " of " + formatCurrency(transferAmount) + " was successful.", 'success')
  } else {
    let newExternalTransferRequest = {
      user: appData.loggedInUser.details.userName,
      userAccountId: userAccount.id,
      externalRoutingNumber: transferRoutingNumber,
      externalAccountNumber: transferAccountNumber,
      amount: transferAmount
    }
    appData.users.admin.requests.incomingExternals.push(newExternalTransferRequest)
    postAlert("Request to transfer in " + formatCurrency(transferAmount) + " from " + transferRoutingNumber + " " + transferAccountNumber + " sent for approval.", 'primary')
  }

  saveData()

  document.getElementById('external-transfer-direction-select').value = ''
  document.getElementById('external-transfer-routing-number-input').value = ''
  document.getElementById('external-transfer-account-number-input').value = ''
  document.getElementById('external-transfer-amount-input').value = ''

  let userAccountSelect = document.getElementById('external-transfer-user-account-select')
  userAccountSelect.replaceChildren()
  for (let account of appData.loggedInUser.accounts) {
    let option = document.createElement("option")
    option.value = account.id
    option.innerText = account.nickname + " (" + formatCurrency(account.balance) + ")"
    userAccountSelect.append(option)
  }

  updateRequestsBadge()
}

function updateRequestsBadge() {
  let requestsBadge = document.getElementById('requests-badge')
  let numRequests = appData.loggedInUser.requests.connections.length + appData.loggedInUser.requests.deposits.length + appData.loggedInUser.requests.incomingExternals.length + appData.loggedInUser.requests.internalTranfers.length
  requestsBadge.innerText = numRequests
  if (numRequests > 0) {
    requestsBadge.classList.remove("hidden")
  } else {
    requestsBadge.classList.add("hidden")
  }
}

function initRequests() {
  let requestList = document.getElementById("request-list")
  requestList.replaceChildren()
  for (let i = 0; i < appData.loggedInUser.requests.deposits.length; i++) {
    let request = appData.loggedInUser.requests.deposits[i]
    let listItem = document.getElementById("request-list-item-template").content.firstElementChild.cloneNode(true)
    listItem.querySelector(".request-user").innerHTML = "From: " + appData.users[request.user].details.firstName + " " + appData.users[request.user].details.lastName
    listItem.querySelector(".request-type").innerHTML = "Type: Deposit"
    listItem.querySelector(".request-amount").innerHTML = "Amount: " + formatCurrency(request.amount)
    listItem.querySelector(".approve-request-button").onclick = () => {approveRequest('deposits', i)}
    listItem.querySelector(".decline-request-button").onclick = () => {declineRequest('deposits', i)}
    requestList.append(listItem)
  }
  for (let i = 0; i < appData.loggedInUser.requests.connections.length; i++) {
    let request = appData.loggedInUser.requests.connections[i]
    let listItem = document.getElementById("request-list-item-template").content.firstElementChild.cloneNode(true)
    listItem.querySelector(".request-user").innerHTML = "From: " + appData.users[request.user].details.firstName + " " + appData.users[request.user].details.lastName
    listItem.querySelector(".request-type").innerHTML = "Type: Link Account"
    listItem.querySelector(".request-amount").classList.add("hidden")
    listItem.querySelector(".approve-request-button").onclick = () => {approveRequest('connections', i)}
    listItem.querySelector(".decline-request-button").onclick = () => {declineRequest('connections', i)}
    requestList.append(listItem)
  }
  for (let i = 0; i < appData.loggedInUser.requests.internalTranfers.length; i++) {
    let request = appData.loggedInUser.requests.internalTranfers[i]
    let listItem = document.getElementById("request-list-item-template").content.firstElementChild.cloneNode(true)
    listItem.querySelector(".request-user").innerHTML = "From: " + appData.users[request.user].details.firstName + " " + appData.users[request.user].details.lastName
    listItem.querySelector(".request-type").innerHTML = "Type: Tranfer"
    listItem.querySelector(".request-amount").innerHTML = "Amount: " + formatCurrency(request.amount) + " drawn from your account " + findUserAndAccountForAccountNumber(request.sourceAccountId).account.nickname
    listItem.querySelector(".approve-request-button").onclick = () => {approveRequest('internalTranfers', i)}
    listItem.querySelector(".decline-request-button").onclick = () => {declineRequest('internalTranfers', i)}
    requestList.append(listItem)
  }
  for (let i = 0; i < appData.loggedInUser.requests.incomingExternals.length; i++) {
    let request = appData.loggedInUser.requests.incomingExternals[i]
    let listItem = document.getElementById("request-list-item-template").content.firstElementChild.cloneNode(true)
    listItem.querySelector(".request-user").innerHTML = "From: " + appData.users[request.user].details.firstName + " " + appData.users[request.user].details.lastName
    listItem.querySelector(".request-type").innerHTML = "Type: Incoming External Transfer"
    listItem.querySelector(".request-routing-number").innerHTML = "Routing Number: " + request.externalRoutingNumber
    listItem.querySelector(".request-routing-number").classList.remove("hidden")
    listItem.querySelector(".request-account-number").innerHTML = "Account Number: " + request.externalAccountNumber
    listItem.querySelector(".request-account-number").classList.remove("hidden")
    listItem.querySelector(".request-amount").innerHTML = "Amount: " + formatCurrency(request.amount)
    listItem.querySelector(".approve-request-button").onclick = () => {approveRequest('incomingExternals', i)}
    listItem.querySelector(".decline-request-button").onclick = () => {declineRequest('incomingExternals', i)}
    requestList.append(listItem)
  }

  if (requestList.children.length == 0) {
    let listItem = document.getElementById("request-list-item-template").content.firstElementChild.cloneNode(true)
    listItem.querySelector(".request-user").classList.add("hidden")
    listItem.querySelector(".request-type").innerText = "No pending requests."
    listItem.querySelector(".request-amount").classList.add("hidden")
    listItem.querySelector(".button-div").classList.add("hidden")
    requestList.append(listItem)
  }

  updateRequestsBadge()
}

function approveRequest(type, index) {
  let request = appData.loggedInUser.requests[type][index]
  appData.loggedInUser.requests[type].splice(index, 1)
  if (type == 'deposits') {
    let user = appData.users[request.user]
    let account = user.accounts.find(e => e.id == request.accountId)
    account.balance += Number(request.amount)
    let transaction = {
      dateTime: new Date(),
      description: "Deposit into " + account.nickname,
      type: "Desposit",
      amount: request.amount,
      balance: new Number(account.balance)
    }
    account.transactions.unshift(transaction)
  } else if (type == 'connections') {
    let newConnection = {
      user: appData.loggedInUser.details.username,
      accountId: request.accountId
    }
    appData.users[request.user].connections.push(newConnection)
  } else if (type == 'internalTranfers') {
    let {account: sourceAccount, user: sourceUser} = findUserAndAccountForAccountNumber(request.sourceAccountId)

    if (sourceAccount.balance - request.amount < 0) {
      postAlert("Insufficient funds to complete transfer.", 'dark')
      return
    }

    sourceAccount.balance -= request.amount
    let {account: destnationAccount, user: destinationUser} = findUserAndAccountForAccountNumber(request.destinationAccountId)
    destnationAccount.balance += request.amount

    let sourceTransaction = {
      dateTime: new Date(),
      description: "Transfer to " + destinationUser.details.firstName + " " + destinationUser.details.lastName + "'s " + destnationAccount.nickname,
      type: "Internal Transfer",
      amount: -request.amount,
      balance: new Number(sourceAccount.balance)
    }
    sourceAccount.transactions.unshift(sourceTransaction)

    let destinationTransaction = {
      dateTime: new Date(),
      description: "Transfer from " + sourceUser.details.firstName + " " + sourceUser.details.lastName + "'s " + sourceAccount.nickname,
      type: "Internal Transfer",
      amount: request.amount,
      balance: new Number(destnationAccount.balance)
    }
    destnationAccount.transactions.unshift(destinationTransaction)
  } else if (type == 'incomingExternals') {
    let account = findUserAndAccountForAccountNumber(request.userAccountId).account
    account.balance += Number(request.amount)
    let transaction = {
      dateTime: new Date(),
      description: "Transfer from " + request.externalRoutingNumber + " " + request.externalAccountNumber,
      type: "External Transfer",
      amount: request.amount,
      balance: new Number(account.balance)
    }
    account.transactions.unshift(transaction)
  }
  saveData()
  initRequests()
  postAlert("Request approved.", 'success')
}

function declineRequest(type, index) {
  let request = appData.loggedInUser.requests[type][index]
  appData.loggedInUser.requests[type].splice(index, 1)
  saveData()
  initRequests()
  postAlert("Request declined.", 'dark')
}

function findUserAndAccountForAccountNumber(accountNumber) {
  for (let username in appData.users) {
    let user = appData.users[username]
    for (let account of user.accounts) {
      if (account.id == accountNumber) {
        return {user, account}
      }
    }
  }
  return
}

function generateAccountNumber(checkForDuplicate=true) {
  let accountNumber = ""
  do {
    for (let i = 0; i < 15; i++) {
      accountNumber += Math.floor(Math.random()*10)
    }
  } while (checkForDuplicate && findUserAndAccountForAccountNumber(accountNumber) !== undefined);
  return accountNumber
}

function formatCurrency(amount) {
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  let amountNum = Number(amount)
  if (amountNum < 0) {
    return "-$" + (-amountNum).toLocaleString('en-US', options);
  }
  return "$" + Number(amount).toLocaleString('en-US', options);
}

let alertList = []

function postAlert(message, type) {
  alertList.push({
    message: message,
    type: type,
    time: Date.now(),
    id: crypto.randomUUID()
  })
  updateAlerts()
  setTimeout(updateAlerts, 7100)
}

function updateAlerts() {
  let alertListNode = document.getElementById('alert-list')
  alertListNode.replaceChildren()
  let newAlertList = []
  for (let alertObject of alertList) {
    if (alertObject.time + 7000 > Date.now()) {
      newAlertList.push(alertObject)
      let listItem = document.getElementById("alert-item-template").content.firstElementChild.cloneNode(true)
      
      let messageContainer = listItem.querySelector('.alert-' + alertObject.type)
      messageContainer.classList.remove('hidden')
      messageContainer.querySelector('.message').innerText = alertObject.message
      messageContainer.querySelector('.btn-close').onclick = () => removeAlert(alertObject.id)
      
      alertListNode.append(listItem)
    }
  }
  alertList = newAlertList
}

function removeAlert(id) {
  let newAlertList = []
  for (let alertObject of alertList) {
    if (alertObject.id != id) {
      newAlertList.push(alertObject)
    }
  }
  alertList = newAlertList
  updateAlerts()
}
