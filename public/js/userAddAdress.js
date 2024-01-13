

const form = document.querySelector(".requires-validation");
form.addEventListener('submit', function (event) {
  event.preventDefault();
  let isValidate = Array.from(form.elements).every(function (element) {
    return checkInputValidity(form, element);
  });

  if (isValidate) {

    form.submit()

  }
});


function checkInputValidity(form, element) {

  let [nameInput, numberInput, districtInput, pincodeInput, localityInput, addressInput, stateInput, addressTypeInput] =
    ['name', 'mobileNumber', 'district', 'pincode', 'locality', 'address', 'state', 'addressType']
      .map(inputName => form.elements[inputName]);

  let checkedAddressType = Array.from(addressTypeInput)
    .find(input => input.checked)


  let errorMessage = {
    common: {
      required: 'This field is required',
    },
    name: {
      invalid: 'Enter full name (first & last name).',
      invalid2: 'Min 3-30 characters',
    },
    phonenumber: {
      invalid: 'Enter a 10 digit phonenumber',
    },
    district: {
      invalid: 'Enter a valid district',
    },
    pincode: {
      invalid: 'Invalid pincode',
    },
    locality: {
      invalid: 'Enter a valid locality',
    },
    address: {
      invalid: 'Enter a valid address',
    },
    state: {
      invalid: 'Invalid district name',
    },
    addressType: {
      invalid: 'Select one option',
    },
  };

  let nameRegex = /^(?=[a-zA-Z ]{3,30}$)[a-zA-Z]+ [a-zA-Z]+$/;
  let districtRegex = /^[A-Za-z\s\-]{3,20}$/

  let numberRegex = /^[0-9]\d{9}$/;
  let addressRegex = /^[^\s][a-zA-Z0-9\s,'-]*$/;

  let isValid = true;
  let inputValue = element.value;
  // Check for 'name' field
  if (nameInput.value.trim() === '') {
    displayError(nameInput, errorMessage.common.required);
    isValid = false;
  } else if (nameInput.value.length < 3 || nameInput.value.length > 30) {
    displayError(nameInput, errorMessage.name.invalid2);
    isValid = false;
  } else if (!nameRegex.test(nameInput.value)) {
    displayError(nameInput, errorMessage.name.invalid);
    isValid = false;
  } else {
    clearError(nameInput);
  }

  // Check for 'mobileNumber' field

  if (numberRegex.test(numberInput.value)) {
    clearError(numberInput);
  } else if (numberInput.value.trim() === '') {
    isValid = false;
    displayError(numberInput, errorMessage.common.required);
  } else {
    isValid = false;
    displayError(numberInput, errorMessage.phonenumber.invalid);
  }

  // Check for 'district' field

  if (districtInput.value.trim() === '') {
    displayError(districtInput, errorMessage.common.required);
    isValid = false;
  } else if (!districtRegex.test(districtInput.value)) {
    displayError(districtInput, errorMessage.district.invalid);
    isValid = false;
  } else {
    clearError(districtInput);
  }

  // Check for 'pincode' field
  if (pincodeInput.value.trim() === '') {
    displayError(pincodeInput, errorMessage.common.required);
    isValid = false;
  } else if (pincodeInput.value.length > 6) {
    displayError(pincodeInput, errorMessage.pincode.invalid);
    isValid = false;
  } else {
    clearError(pincodeInput);
  }

  // Check for 'locality' field
  if (localityInput.value.trim() === '') {
    displayError(localityInput, errorMessage.locality.invalid);
    isValid = false;
  } else if (!districtRegex.test(localityInput.value)) {
    displayError(localityInput, errorMessage.locality.invalid);
    isValid = false;
  } else {
    clearError(localityInput);
  }

  // Check for 'address' field

  if (addressInput.value === '') {
    displayError(addressInput, errorMessage.common.required);
    isValid = false;
  } else if (!addressRegex.test(addressInput.value)) {

    displayError(addressInput, errorMessage.address.invalid);
    isValid = false;
  } else {
    clearError(addressInput);
  }

  // Check for 'state' field

  if (stateInput.value.trim() === '') {
    displayError(stateInput, errorMessage.common.required);
    isValid = false;
  } else if (!districtRegex.test(stateInput.value)) {
    displayError(stateInput, errorMessage.state.invalid);
    isValid = false;
  } else {
    clearError(stateInput);
  }

  // Check for 'addressType' field

  if (!checkedAddressType) {

    isValid = false;
  }


  return isValid;
}

function displayError(input, message) {
  let errorMessageElement = input.parentElement.querySelector('small');

  errorMessageElement.innerHTML = message;

  input.classList.remove('is-valid');
  input.classList.add('is-invalid');
}
function clearError(input) {

  let errorMessageElement = input.parentElement.querySelector('small');
  errorMessageElement.innerHTML = '';

  input.classList.remove('is-invalid')
  input.classList.add('is-valid');
}