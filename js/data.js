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
      notes: []
    }
  }, 
  settings: {
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
    for (let reqKey of Object.keys(appData.settings.requirements)) {
      let req = appData.settings.requirements[reqKey]
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
    if (!appData.settings.requirements.similarity) {
      let checkContainer = document.getElementById("easy-check-container")
      checkContainer.style.setProperty('display', 'none', 'important')
    }
    if (!appData.settings.requirements.prohibitCommon) {
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
    if (window.location.href.includes("home") || window.location.href.includes("account") || window.location.href.includes("admin")) {
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
  newUser.notes = []

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

  for (let weightKey in appData.settings.scoreWeights) {
    let weightInput = document.getElementById(weightKey + "-score-input")
    weightInput.value = appData.settings.scoreWeights[weightKey]
  }

  for (let reqKey of Object.keys(appData.settings.requirements)) {
    if (reqKey == 'prohibitCommon') {
      document.getElementById("prohibitCommon-req-checkbox").checked = appData.settings.requirements[reqKey]
    } else if (reqKey == 'prohibitFirstName') {
      document.getElementById("prohibitFirstName-req-checkbox").checked = appData.settings.requirements[reqKey]
    } else if (reqKey == 'prohibitLastName') {
      document.getElementById("prohibitLastName-req-checkbox").checked = appData.settings.requirements[reqKey]
    } else if (reqKey == 'prohibitUserName') {
      document.getElementById("prohibitUserName-req-checkbox").checked = appData.settings.requirements[reqKey]
    } else if (reqKey == 'prohibitEmail') {
      document.getElementById("prohibitEmail-req-checkbox").checked = appData.settings.requirements[reqKey]
    } else if (reqKey == 'strength') {
      document.getElementById("min-strength-group-select").value = appData.settings.requirements[reqKey] ? appData.settings.requirements[reqKey] : 'none'
      setMinStrengthSelectColor()
    } else {
      document.getElementById(reqKey + "-req-input").value = appData.settings.requirements[reqKey]
    }
  }

  for (let i = 0; i < appData.settings.strengths.length; i++) {
    let strengthThresholdInput = document.getElementById(appData.settings.strengths[i].id + "-strength-threshold-input")
    strengthThresholdInput.value = appData.settings.strengths[i].threshold
    
    if (i < appData.settings.strengths.length - 1) {
      strengthThresholdInput.min = appData.settings.strengths[i+1].threshold + 1
    }
    if (i > 0) {
      strengthThresholdInput.max = appData.settings.strengths[i-1].threshold - 1
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

function updateSettings() {
  for (let reqKey of Object.keys(appData.settings.requirements)) {
    if (reqKey == 'prohibitCommon' || reqKey == 'prohibitFirstName' || reqKey == 'prohibitLastName' || reqKey == 'prohibitUserName' || reqKey == 'prohibitEmail') {
      let reqCheckbox = document.getElementById(reqKey + "-req-checkbox")
      appData.settings.requirements[reqKey] = reqCheckbox.checked
    } else if (reqKey == 'strength') {
      appData.settings.requirements[reqKey] = document.getElementById("min-strength-group-select").value == 'none' ? null : document.getElementById("min-strength-group-select").value
    } else {
      let reqInput = document.getElementById(reqKey + "-req-input")

      //validate requirements input
      if (reqInput.min && Number(reqInput.value) < Number(reqInput.min)) {
        reqInput.value = reqInput.min
      } else if (reqInput.max && Number(reqInput.value) > Number(reqInput.max)) {
        reqInput.value = reqInput.max
      }
      if (reqInput.value == "") {
        reqInput.value = appData.settings.requirements[reqKey]
      }

      appData.settings.requirements[reqKey] = Number(reqInput.value)
    }
  }

  for (let weightKey of Object.keys(appData.settings.scoreWeights)) {
    weightInput = document.getElementById(weightKey + "-score-input")

    //validate requirements input
    if (weightInput.min && Number(weightInput.value) < Number(weightInput.min)) {
      weightInput.value = weightInput.min
    }
    if (weightInput.value == "") {
      weightInput.value = appData.settings.scoreWeights[weightKey]
    }

    appData.settings.scoreWeights[weightKey] = Number(weightInput.value)
  }

  for (let i = 0; i < appData.settings.strengths.length; i++) {
    let strengthThresholdInput = document.getElementById(appData.settings.strengths[i].id + "-strength-threshold-input")
    
    if (strengthThresholdInput.min && Number(strengthThresholdInput.value) < Number(strengthThresholdInput.min)) {
      strengthThresholdInput.value = strengthThresholdInput.min
    } else if (strengthThresholdInput.max && Number(strengthThresholdInput.value) > Number(strengthThresholdInput.max)) {
      strengthThresholdInput.value = strengthThresholdInput.max
    }
    if (strengthThresholdInput.value == "") {
      strengthThresholdInput.value = appData.settings.strengths.length[i]
    }
    
    appData.settings.strengths[i].threshold = Number(strengthThresholdInput.value)
  }

  for (let i = 0; i < appData.settings.strengths.length; i++) {
    let strengthThresholdInput = document.getElementById(appData.settings.strengths[i].id + "-strength-threshold-input")
    
    if (i < appData.settings.strengths.length - 1) {
      strengthThresholdInput.min = appData.settings.strengths[i+1].threshold + 1
    }
    if (i > 0) {
      strengthThresholdInput.max = appData.settings.strengths[i-1].threshold - 1
    }
  }

  setMinStrengthSelectColor()
  saveData()
}

function setMinStrengthSelectColor() {
  let minStrengthSelect = document.getElementById("min-strength-group-select")

  for (let strength of appData.settings.strengths) {
    minStrengthSelect.classList.remove(strength.bgColorClass)
    if (strength.id == appData.settings.requirements.strength) {
      minStrengthSelect.classList.add(strength.bgColorClass)
    }
  }
  
}

function resetPasswordSettings() {
  appData.settings = JSON.parse(JSON.stringify(defaultData.settings))
  saveData()
  initAdmin()
}

function initHome() {
  let noteList = document.getElementById("note-list")
  noteList.replaceChildren()
  for (let i = 0; i < appData.loggedInUser.notes.length; i++) {
    let note = appData.loggedInUser.notes[i]
    let listItem = document.getElementById("note-list-item-template").content.firstElementChild.cloneNode(true)
    listItem.querySelector(".note-name").innerHTML = `${note.name != '' ? note.name : '(Untitled Note)'}`
    listItem.querySelector(".note-name").onclick = () => {loadNote(i)}
    noteList.append(listItem)
  }
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

function createNewNote() {
  let newNote = {
    name: '',
    content: ''
  }
  
  appData.currentNoteIndex = appData.loggedInUser.notes.length
  
  document.getElementById("note-edit-container").style.display = 'block'

  document.getElementById("note-name-input").value = ''
  document.getElementById("note-content-input").value = ''

  appData.loggedInUser.notes.push(newNote)

  saveData()
}

function deleteCurrentNote() {
  appData.loggedInUser.notes.splice(appData.currentNoteIndex, 1)
  saveData()
  initHome()

  document.getElementById("note-edit-container").style.display = 'none'

  document.getElementById("note-name-input").value = ''
  document.getElementById("note-content-input").value = ''
}
