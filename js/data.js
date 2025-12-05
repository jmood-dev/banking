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
        email: 'admin@notewords.com',
        password: 'admin'
      },
      previousPasswords: ['admin'],
      accounts: [
        {
          id: generateAccountNumber(),
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
  if (window.location.href.includes("index") || window.location.href.endsWith("jmood-dev.github.io/notewords")  || window.location.href.endsWith("jmood-dev.github.io/notewords/")) {
    window.location.href = "html/landing.html"
  }
  let isLoggedIn = (typeof appData.loggedInUser !== 'undefined')
  if (isLoggedIn) {
    if (appData.loggedInUser.details.userName != "admin" && window.location.href.includes("admin") || window.location.href.includes("landing")) {
      window.location.href = "home.html"
    }
  } else {
    if (window.location.href.includes("home") || window.location.href.includes("settings") || window.location.href.includes("admin") || window.location.href.includes("requests") || window.location.href.includes("transfers")) {
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
    //listItem.querySelector(".account-name").onclick = () => {loadAccount(i)}
    listItem.querySelector(".account-type").innerHTML = "Type: " + account.type
    listItem.querySelector(".account-balance").innerHTML = "Balance: " + formatCurrency(account.balance)
    totalBalance += account.balance
    accountList.append(listItem)
  }
  document.getElementById('accounts-total-balance').innerText = "Total balance: " + formatCurrency(totalBalance)
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

  saveData()
  initHome()
}

function deleteCurrentNote() {
  appData.loggedInUser.notes.splice(appData.currentNoteIndex, 1)
  saveData()
  initHome()

  document.getElementById("note-edit-container").style.display = 'none'

  document.getElementById("note-name-input").value = ''
  document.getElementById("note-content-input").value = ''
}

function initTransferUI() {
  transferUiContainer = document.getElementById('transfer-ui-container')
  transferUiContainer.replaceChildren()

  document.getElementById('transfer-type').value = 'select'
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
  let newDepositRequest = {
    user: appData.loggedInUser.details.userName,
    accountId: document.querySelector('.deposit-account-select').value,
    amount: document.querySelector('.deposit-amount-input').value
  }
  document.querySelector('.deposit-amount-input').value = ''
  appData.users['admin'].requests.deposits.push(newDepositRequest)
  saveData()
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

  let destnationAccountSelectValue = document.getElementById('transfer-destination-select').value
  let destnationAccount = appData.loggedInUser.accounts.find(e => e.id == destnationAccountSelectValue)
  if (destnationAccountSelectValue.includes("connection")) {
    destnationAccount = findUserAndAccountForAccountNumber(destnationAccountSelectValue.split(" ")[1]).account
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
  } else {
    sourceAccount.balance -= amount
    destnationAccount.balance += amount
  }

  saveData()
  initTransferUI()
}

function requestNewConnection() {
  let accountNumber = document.getElementById('internal-transfer-new-connection-input').value
  let newConnectionRequest = {
    user: appData.loggedInUser.details.userName,
    accountId: accountNumber
  }
  let user = findUserAndAccountForAccountNumber(accountNumber).user
  if (user) {
    user.requests.connections.push(newConnectionRequest)
  }
  saveData()
  initTransferUI()
}

function requestExternalTransfer() {
  let userAccount = appData.loggedInUser.accounts.find(e => e.id == document.getElementById('external-transfer-user-account-select').value)
  let transferDirection = document.getElementById('external-transfer-direction-select').value
  let transferRoutingNumber = document.getElementById('external-transfer-routing-number-input').value
  let transferAccountNumber = document.getElementById('external-transfer-account-number-input').value
  let transferAmount = document.getElementById('external-transfer-amount-input').value

  if (transferDirection == 'outgoing') {
    userAccount.balance -= transferAmount
  } else {
    let newExternalTransferRequest = {
      user: appData.loggedInUser.details.userName,
      userAccountId: userAccount.id,
      externalRoutingNumber: transferRoutingNumber,
      externalAccountNumber: transferAccountNumber,
      amount: transferAmount
    }
    appData.users.admin.requests.incomingExternals.push(newExternalTransferRequest)
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
}

function approveRequest(type, index) {
  let request = appData.loggedInUser.requests[type][index]
  appData.loggedInUser.requests[type].splice(index, 1)
  if (type == 'deposits') {
    let user = appData.users[request.user]
    let account = user.accounts.find(e => e.id == request.accountId)
    account.balance += Number(request.amount)
  } else if (type == 'connections') {
    let newConnection = {
      user: appData.loggedInUser.details.username,
      accountId: request.accountId
    }
    appData.users[request.user].connections.push(newConnection)
  } else if (type == 'internalTranfers') {
    findUserAndAccountForAccountNumber(request.sourceAccountId).account.balance -= request.amount
    findUserAndAccountForAccountNumber(request.destinationAccountId).account.balance += request.amount
  } else if (type == 'incomingExternals') {
    findUserAndAccountForAccountNumber(request.userAccountId).account.balance += Number(request.amount)
  }
  saveData()
  initRequests()
}

function declineRequest(type, index) {
  let request = appData.loggedInUser.requests[type][index]
  appData.loggedInUser.requests[type].splice(index, 1)
  saveData()
  initRequests()
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

function generateAccountNumber() {
  let accountNumber = ""
  for (let i = 0; i < 15; i++) {
    accountNumber += Math.floor(Math.random()*10)
  }
  return accountNumber
}

function formatCurrency(amount) {
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  return "$" + Number(amount).toLocaleString('en-US', options);
}
