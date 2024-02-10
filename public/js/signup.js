
    //loign page form validation
    (function () {
      'use strict';

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

          } else {
            formsubmitted = true;
          }
        });
      });

    })();



    function checkInputValidity(form, element) {
      let emailRegex = /^[A-Za-z0-9_\-\.]+@gmail+\.[A-Za-z]{3}$/;
      let nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
      let passwordRegex = /^.{4,20}$/;
      let numberRegex = /^[0-9]\d{9}$/;

      //input field
      let nameInput = form.elements['validateCustomerName']
      let emailInput = form.elements['validateCustomerEmail'];
      let phoneNumberInput = form.elements['validateCustomerPhoneNumber'];
      let passwordInput = form.elements['validatePassword'];
      let passwordInput2 = form.elements['validatePassword2'];
      //input field values
      let nameInputValue = nameInput.value;
      let emailInputValue = emailInput.value;
      let phoneNumberInputValue = phoneNumberInput.value;
      let passwordInputValue = passwordInput.value;
      let passwordInputValue2 = passwordInput2.value;

     
      let erroMessage = {
        validationCustomerName: {
          required: 'name is required',
          invalid: 'Please enter your full name (first & last name).',
          invalid2: 'Name should contain 3 to 20 letter'
        },
        validationCustomerEmail: {
          required: 'Email is required',
          invalid: 'Invalid email format'
        },
        validationCustomerPhonenumber: {
          required: 'Phone number is required',
          invalid: 'Please enter a 10 digit phonenumber'
        },
        validationPassword: {
          required: 'Passoword is required',
          invalid: 'Password must be 4-20 characters long'
        },
        validationPassword2: {
          required: '',
          invalid: ' Please enter the same password',
          invalid2:'first enter the passowrd'
          
        }
      }
      
      let isValid = true;
      
      //for checking the name
      if (nameInputValue.length > 20) {
        displayErrorMessage(nameInput, erroMessage.validationCustomerName.invalid2);
        isValid = false;
        nameInput.classList.add('is-invalid');
        nameInput.classList.remove('is-valid');
      }
      else if (nameRegex.test(nameInputValue)) {
        clearMessage(nameInput);
        nameInput.classList.remove('is-invalid');
        nameInput.classList.add('is-valid')
      } else if (nameInputValue === '') {
        displayErrorMessage(nameInput, erroMessage.validationCustomerName.required);
        isValid = false;
        nameInput.classList.add('is-invalid');
        nameInput.classList.remove('is-valid');
      } else {
        displayErrorMessage(nameInput, erroMessage.validationCustomerName.invalid)
        isValid = false;
        nameInput.classList.add('is-invalid');
      }


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

      //for checking passowrd
      
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

      //for cheking the phone number
      if(numberRegex.test(phoneNumberInputValue)){
        clearMessage(phoneNumberInput);
        phoneNumberInput.classList.add('is-valid');
        phoneNumberInput.classList.remove('is-invalid');

      }else if(phoneNumberInputValue===''){
        displayErrorMessage(phoneNumberInput,erroMessage.validationCustomerPhonenumber.required);
        isValid = false
        phoneNumberInput.classList.remove('is-valid');
        phoneNumberInput.classList.add('is-invalid');
       
      }else{
        displayErrorMessage(phoneNumberInput,erroMessage.validationCustomerPhonenumber.invalid);
        isValid = false
        phoneNumberInput.classList.remove('is-valid');
        phoneNumberInput.classList.add('is-invalid');
      }

      //for rechecking the passowrd
       if(passwordInputValue2==''){
        displayErrorMessage(passwordInput2,erroMessage.validationPassword2.required);
        isValid = false
        passwordInput2.classList.remove('is-valid');
        passwordInput2.classList.add('is-invalid');
       }
      else if(passwordInputValue2===passwordInputValue){
        clearMessage(passwordInput2);
        
        passwordInput2.classList.add('is-valid');
        passwordInput2.classList.remove('is-invalid');
      }else{
        displayErrorMessage(passwordInput2,erroMessage.validationPassword2.invalid);
        isValid = false
        passwordInput2.classList.add('is-invalid');
        passwordInput2.classList.remove('is-valid');
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

    let isActive = false;
    function toggle() {
      if (isActive) {
        document.querySelector('.toggle-bar').className = 'toggle-bar'
        document.querySelector('.navigation-mobile-list').className = 'navigation-mobile-list';
        isActive = false;
      } else {
        document.querySelector('.toggle-bar').className = 'toggle-bar active'
        document.querySelector('.navigation-mobile-list').className = 'navigation-mobile-list active';
        isActive = true;
      }
    }

    //for hiding the toggle list 
    window.addEventListener('scroll', function hideNavigation() {
      if (isActive) {
        document.querySelector('.toggle-bar').classList.remove('active')
        document.querySelector('.navigation-mobile-list').classList.remove('active');
      }
    })





