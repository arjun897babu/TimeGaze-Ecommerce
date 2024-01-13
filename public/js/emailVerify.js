const forms = document.querySelectorAll('.requires-validation');

Array.from(forms).forEach(form => {

  Array.from(form.elements).forEach((elements) => {
    elements.addEventListener('input', () => {
      checkInputValidity(form, elements);
    })
  })
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValidate = Array.from(form.elements).every(element => {
      return checkInputValidity(form, element)
    })

    if (isValidate) {
      form.submit()
    }
  })
});


function checkInputValidity(form, element) {
  let otpInput = form.elements['validateOTP'];
  let otpInputValue = otpInput.value;

  console.log(otpInputValue);
  let errorMessage = {
    required: 'OTP required',
  }
  let isValid = true
  if (!otpInputValue) {
    console.log('undefined variable');
    displayErrorMessage(otpInput, errorMessage.required);
    isValid = false
    otpInput.classList.add('is-invalid');
    otpInput.classList.remove('is-valid')
  } else {
    console.log('case is true');
    clearMessage(otpInput);
    otpInput.classList.remove('is-invalid');
    otpInput.classList.add('is-valid');
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

let timeLeft = 120;
let text = document.querySelector('p');
let coutDownDiv = document.getElementById('otpCountDown');
let otpVerify = document.getElementById('otpVerify');
let resendButton = document.getElementById('otpResend')
let timerId;
let email = document.querySelector('input[name="email"]').value;

if (email) { timerId = setInterval(countDown, 1000) };


function countDown() {

  if (timeLeft === -1) {
    clearInterval(timerId);
    coutDownDiv.innerHTML = ``;
    text.style.display = 'none'
    otpVerify.classList.add('disabled')
    resendButton.classList.remove('disabled');
    timeLeft = 120

  } else {
    coutDownDiv.innerHTML = ` Time remaing : ${timeLeft}s  `;
    --timeLeft;
  }
}

resendButton.addEventListener('click', () => {
  otpVerify.classList.remove('disabled');
  resendOtp()
});

function resendOtp() {
  $.ajax({
    url: `/api/sendOTP?otpPurpose=resendOtp`,
    method: 'post',
    contentType: 'application/json',
    data: JSON.stringify({ email: email }),
    success: function () {
      resendButton.classList.add('disabled');
      if (email) { timerId = setInterval(countDown, 1000) };
      text.style.display = 'block';
    },
    error: function () {
      Swal.fire({
        
        icon: "error"
      });
    }
  })
}

