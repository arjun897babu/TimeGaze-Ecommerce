const forms = document.querySelectorAll('.requires-validation');
    let formsubmitted = true;
    Array.from(forms).forEach(function (form) {
      Array.from(form.elements).forEach(function (element) {
        element.addEventListener('input', function () {
          if (formsubmitted) {
            checkInputValidity(form, element);
          }
        });
      });

      form.addEventListener('submit', function (event) {
        event.preventDefault();

        let isValidate = Array.from(form.elements).every(function (element) {
          return checkInputValidity(form, element);
        });
        if (isValidate) {
          form.submit();

        }
      });
    });

    function checkInputValidity(form, element) {
      let emailRegex = /^[A-Za-z0-9_\-\.]+@gmail+\.[A-Za-z]{3}$/;
           //input field
      let emailInput = form.elements['validateCustomerEmail'];
      //input field values

      let emailInputValue = emailInput.value;


      let erroMessage = {

        validationCustomerEmail: {
          required: 'Email is required',
          invalid: 'Invalid email format'
        }
      }

      let isValid = true;
      //for checking email

      if (emailRegex.test(emailInputValue)) {
        clearMessage(emailInput)
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
      } else if (emailInputValue.trim() === '') {
        displayErrorMessage(emailInput, erroMessage.validationCustomerEmail.required)
        isValid = false
        emailInput.classList.remove('is-valid');
        emailInput.classList.add('is-invalid');
      }
      else {
        displayErrorMessage(emailInput, erroMessage.validationCustomerEmail.invalid)
        isValid = false
        emailInput.classList.remove('is-valid');
        emailInput.classList.add('is-invalid');
      }


      return isValid
    }

    //for displaying the erro message
    function displayErrorMessage(element, message) {

      let errorMessageElement = element.parentElement.querySelector('small');
      errorMessageElement.innerHTML = message

    }
    // for clearing the error message
    function clearMessage(element) {

      errorMessageElement = element.parentElement.querySelector('small');
      errorMessageElement.innerHTML = ('')
    }
