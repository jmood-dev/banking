function checkPasswordInput() {
  let passwordInput1 = document.getElementById("password-input-1")
  let pwd = passwordInput1.value

  let scoreComponents = {
    lower: 0,
    upper: 0,
    number: 0,
    special: 0,
    extended: 0,
    unique: 0
  }
  let reqComponents = {
    lower: 0,
    upper: 0,
    number: 0,
    special: 0,
    extended: 0,
    unique: 0
  }

  let passwordForScoring = getPasswordForScoring()

  let hasControlChar = false
  let uniqueChars = ""
  for (let i = 0; i < pwd.length; i++) {
    let char = pwd[i]
    if (char >= 'A' && char <= 'Z') {
      reqComponents.upper++
    } else if (char >= '0' && char <= '9') {
      reqComponents.number++
    } else if (char >= 'a' && char <= 'z') {
      reqComponents.lower++
    } else if (char >= ' ' && char <= '~') {
      reqComponents.special++
    } else if (char <= String.fromCharCode(31) || char == String.fromCharCode(127)) {
      hasControlChar = true
    } else if (char >= String.fromCharCode(128)) {
      reqComponents.extended++
    }
    if (!uniqueChars.includes(char)) {
      uniqueChars += char
    }
  }
  reqComponents.unique = uniqueChars.length

  uniqueChars = ""
  for (let i = 0; i < passwordForScoring.length; i++) {
    let char = passwordForScoring[i]
    if (char >= 'A' && char <= 'Z') {
      scoreComponents.upper++
    } else if (char >= '0' && char <= '9') {
      scoreComponents.number++
    } else if (char >= 'a' && char <= 'z') {
      scoreComponents.lower++
    } else if (char >= ' ' && char <= '~') {
      scoreComponents.special++
    } else if (char >= String.fromCharCode(128)) {
      scoreComponents.extended++
    }
    if (!uniqueChars.includes(char)) {
      uniqueChars += char
    }
  }
  scoreComponents.unique = uniqueChars.length

  let requirementsMet = pwd.length >= appData.settings.requirements.length
  for (let reqKey of Object.keys(reqComponents)) {
    if (reqComponents[reqKey] < appData.settings.requirements[reqKey]) {
      requirementsMet = false
    }
  }

  let isEasyPassword = commonPasswords.includes(pwd.toLowerCase())

  let firstName = appData.loggedInUser ? appData.loggedInUser.details.firstName : document.getElementById("first-name-input").value
  let hasFirstName = firstName.length == 0 ? false : pwd.toLowerCase().includes(firstName.toLowerCase())
  
  let lastName = appData.loggedInUser ? appData.loggedInUser.details.lastName : document.getElementById("last-name-input").value
  let hasLastName = lastName.length == 0 ? false : pwd.toLowerCase().includes(lastName.toLowerCase())

  let userName = appData.loggedInUser ? appData.loggedInUser.details.userName : document.getElementById("username-input").value
  let hasUserName = userName.length == 0 ? false : pwd.toLowerCase().includes(userName.toLowerCase())

  let userEamil = appData.loggedInUser ? appData.loggedInUser.details.email : document.getElementById("email-input").value
  let hasUserEamil = userEamil.length == 0 ? false : pwd.toLowerCase().includes(userEamil.toLowerCase())

  let isSimilarToPreviousPassword = false
  if (appData.loggedInUser != null) {
    let similarityThreshold = appData.settings.requirements.similarity / 100
    for (let savedPassword of appData.loggedInUser.previousPasswords) {
      let similarSubstringLength = Math.max(Math.floor(savedPassword.length * similarityThreshold), 2)
      for (let i = 0; i < savedPassword.length - similarSubstringLength + 1; i++) {
        let substring = savedPassword.slice(i, similarSubstringLength + i)
        if (pwd.indexOf(substring) >= 0) {
          isSimilarToPreviousPassword = true
        }
      }
    }
  }

  let score = 0
  for (let key of Object.keys(scoreComponents)) {
    score += scoreComponents[key] * appData.settings.scoreWeights[key]
  }
  score *= passwordForScoring.length

  let strengthMin = null
  for (let strength of appData.settings.strengths) {
    if (strength.id == appData.settings.requirements.strength) {
      strengthMin = strength
      break
    }
  }
  let minScoreReached = strengthMin ? score >= strengthMin.threshold : true

  let passwordsMatch = checkPasswordsMatch()
  requirementsMet = requirementsMet && passwordsMatch && !hasControlChar && !isSimilarToPreviousPassword &&
                    (!appData.settings.requirements.prohibitCommon || !isEasyPassword) && 
                    (!appData.settings.requirements.prohibitFirstName || !hasFirstName) && 
                    (!appData.settings.requirements.prohibitLastName || !hasLastName) && 
                    (!appData.settings.requirements.prohibitUserName || !hasUserName) && 
                    (!appData.settings.requirements.prohibitEmail || !hasUserEamil) && minScoreReached

  let saveButton = document.getElementById("sign-up-button")
  if (saveButton == null) {
    saveButton = document.getElementById("change-password-button")
  }
  saveButton.disabled = !requirementsMet
  checkSignUpInputNotNull()

  reqComponents.length = pwd.length
  createChecksDisplay(pwd ? pwd.length : 0, reqComponents, isSimilarToPreviousPassword, isEasyPassword, hasFirstName, hasLastName, hasUserName, hasUserEamil, hasControlChar, minScoreReached, score)

  return {
    requirementsMet: requirementsMet,
    score: score
  }

}

let savedPasswords = []
function savePassword() {
  let checkResults = checkPasswordInput()
  if (!checkResults.requirementsMet) {
    return
  }
  let passwordInput1 = document.getElementById("password-input-1")
  let pwd = passwordInput1.value
  savedPasswords.push(pwd)

  let passwordInput2 = document.getElementById("password-input-2")
  let saveButton = document.getElementById("password-save-button")
  passwordInput1.value = ''
  passwordInput2.value = ''  
  saveButton.disabled = true

  document.getElementById("pwd-strength-output").style.display = "none"
  
}

let password1Visible = false
let password2Visible = false
function toggleVisiblePassword1() {
  let visibleSpan = document.getElementById("password-visible-span-1")
  let passwordInput = document.getElementById("password-input-1")

  toggleVisiblePassword(visibleSpan, passwordInput, password1Visible)
  
  password1Visible = !password1Visible
}

function toggleVisiblePassword2() {
  let visibleSpan = document.getElementById("password-visible-span-2")
  let passwordInput = document.getElementById("password-input-2")

  toggleVisiblePassword(visibleSpan, passwordInput, password2Visible)
  
  password2Visible = !password2Visible
}

function toggleVisiblePassword(visibleSpan, passwordInput, isVisible) {
  if (isVisible) {
    visibleSpan.textContent = 'Show'
    passwordInput.type = 'password'
  } else {
    visibleSpan.textContent = 'Hide'
    passwordInput.type = 'text'
  }
}

function checkPasswordsMatch() {
  let passwordInput1 = document.getElementById("password-input-1")
  let passwordInput2 = document.getElementById("password-input-2")
  let matchOutput = document.getElementById("passwords-dont-match-output")

  if (passwordInput1.value == passwordInput2.value) {
    matchOutput.style.visibility = 'hidden'
    return true
  } else {
    matchOutput.style.visibility = 'visible'
    return false
  }
}

function getPasswordForScoring() {
  let passwordInput1 = document.getElementById("password-input-1")
  let pwd = passwordInput1.value
  
  let indeciesToRemove = new Array(pwd.length).fill(false)
  
  for (let easyPassword of commonPasswords) {
    if (easyPassword.length > 3) {
      let index = pwd.toLowerCase().indexOf(easyPassword)
      if (index >= 0) {
        for (let i = index; i < easyPassword.length + index; i++) {
          indeciesToRemove[i] = true
        }
      }
    }
  }

  let pwdToReturn = ""
  for (let i = 0; i < pwd.length; i++) {
    if (!indeciesToRemove[i]) {
      pwdToReturn += pwd[i]
    }
  }

  return pwdToReturn
}

function createChecksDisplay(passwordLength, reqComponents, isSimilarToPreviousPassword, isEasyPassword, hasFirstName, hasLastName, hasUserName, hasUserEamil, hasControlChar, minScoreReached, score) {
  let passwordCheckResultsContainer = document.getElementById("password-check-results")
  passwordCheckResultsContainer.replaceChildren()
  for (let key of Object.keys(REQ_INFO)) {

    if (appData.settings.requirements[key] && !(window.location.href.includes("landing") && key == 'similarity')) {
      let text = REQ_INFO[key].text
      if (REQ_INFO[key].addNum) {
        text += appData.settings.requirements[key]
      } else if (key == 'strength') {
        let strengthMinId = appData.settings.requirements.strength
        let strengthMin = null
        for (let strength of appData.settings.strengths) {
          if (strength.id == strengthMinId) {
            strengthMin = strength
            break
          }
        }
        text += ` <span class='${strengthMin.textColorClass}'>${strengthMin.name}</span>`
      }
      if (key in reqComponents && reqComponents[key] >= appData.settings.requirements[key] ||
        key == 'similarity' && !isSimilarToPreviousPassword || key == 'prohibitCommon' && !isEasyPassword ||
        key == 'prohibitFirstName' && !hasFirstName || key == 'prohibitLastName' && !hasLastName ||
        key == 'prohibitUserName' && !hasUserName || key == 'prohibitEmail' && !hasUserEamil ||
        key == 'strength' && minScoreReached
      ) {
        text = '✅ ' + text
      } else {
        text = '❌ ' + text
      }
      let resultItem = document.getElementById("password-check-result-item-template").content.firstElementChild.cloneNode(true)
      resultItem.innerHTML = text
      passwordCheckResultsContainer.append(resultItem)
    }
    
  }

  if (hasControlChar) {
    let resultItem = document.getElementById("password-check-result-item-template").content.firstElementChild.cloneNode(true)
    resultItem.innerHTML = '❌ No control character'
    passwordCheckResultsContainer.append(resultItem)
  }

  let passwordStrengthOutput = document.getElementById("password-strength-output-template").content.firstElementChild.cloneNode(true)
  let passwordStrengthNameOutput = passwordStrengthOutput.querySelector(".strength-name-output")
  let numBoxesToColor = appData.settings.strengths.length
  for (let strengthKey of Object.keys(appData.settings.strengths)) {
    let strength = appData.settings.strengths[strengthKey]
    if (score >= strength.threshold) {
      passwordStrengthNameOutput.innerHTML = `${strength.name}`
      let boxesToColor = passwordStrengthOutput.querySelectorAll(".strength-box-output")
      for (let i = 0; i < boxesToColor.length; i++) {
        if (i < numBoxesToColor) {
          boxesToColor[i].classList.add(strength.bgColorClass)
        }
      }
      passwordStrengthNameOutput.classList.add(appData.settings.strengths[strengthKey].textColorClass)
      break
    } else {
      numBoxesToColor--
    }
  }

  passwordCheckResultsContainer.append(passwordStrengthOutput)

  let passwordCheckerFloatingOutput = document.getElementById("password-checker-floating-output")
  if (passwordLength > 0) {
    passwordCheckerFloatingOutput.style.display = 'block'
  } else {
    passwordCheckerFloatingOutput.style.display = 'none'
  }

}