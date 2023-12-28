const forms = document.querySelectorAll('.requires-validation');

Array.from(forms).forEach(form => {
  Array.from(form.elements).forEach((element) => {
    element.addEventListener('input', () => {
      checkInputValidity(form, element);
    })
  })
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValidate = Array.from(form.elements).every(element => {
      return checkInputValidity(form, element)
    })

    if (isValidate) {
      form.submit();
    }
  })
});


function checkInputValidity(form, element) {
  let passwordRegex = /^.{4,20}$/;
  let passwordInput = form.elements['validatePassword'];
  let passwordInput2 = form.elements['validatePassword2']
  let passwordInputValue = passwordInput.value;
  let passwordInputValue2 = passwordInput2.value;
  //for checking passowrd
  let erroMessage = {

    validationPassword: {
      required: 'Passoword is required',
      invalid: 'Password must be 4-20 characters long'
    },
    validationPassword2: {
      required: '',
      invalid: ' Please enter the same password',
      invalid2: 'first enter the passowrd'

    }
  }
  let isValid = true
  if (passwordRegex.test(passwordInputValue)) {
    clearMessage(passwordInput);
    passwordInput.classList.add('is-valid');
    passwordInput.classList.remove('is-invalid')

  } else if (passwordInputValue.trim() === '') {
    displayErrorMessage(passwordInput, erroMessage.validationPassword.required)
    isValid = false
    passwordInput.classList.remove('is-valid');
    passwordInput.classList.add('is-invalid');
  } else {
    displayErrorMessage(passwordInput, erroMessage.validationPassword.invalid)
    isValid = false
    passwordInput.classList.remove('is-valid');
    passwordInput.classList.add('is-invalid');
  }
  //for rechecking the passowrd
  if (passwordInputValue2 == '') {
    displayErrorMessage(passwordInput2, erroMessage.validationPassword2.required);
    isValid = false
    passwordInput2.classList.remove('is-valid');
    passwordInput2.classList.add('is-invalid');
  }
  else if (passwordInputValue2 === passwordInputValue) {
    clearMessage(passwordInput2);

    passwordInput2.classList.add('is-valid');
    passwordInput2.classList.remove('is-invalid');
  } else {
    displayErrorMessage(passwordInput2, erroMessage.validationPassword2.invalid);
    isValid = false
    passwordInput2.classList.add('is-invalid');
    passwordInput2.classList.remove('is-valid');
  }

  return isValid
}



//for displaying the error message
function displayErrorMessage(element, message) {

  let errorMessageElement = element.parentElement.querySelector('small');
  errorMessageElement.innerHTML = message

}
// for clearing the error message
function clearMessage(element) {

  errorMessageElement = element.parentElement.querySelector('small');
  errorMessageElement.innerHTML = ('')
}

function updatePassword(){
  
}