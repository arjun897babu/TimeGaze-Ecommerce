$('.change-address').click(function (event) {
  event.preventDefault();
  const selectedId = $(this).attr('data-id');
  console.log(selectedId);
  makeAddressDefualt(selectedId);
})

function makeAddressDefualt(selectedId) {
  $.ajax({
    url: `/api/makeDefault/${selectedId}`,
    type: 'PUT',
    contentType: 'application/json',
    success: function (response) {
      location.reload()
    },
    error: function (error) {
      if(xhr.status===404){
        window.location.href = '/login'
      }

      console.error(error);
    }

  })
}

const addAddressForm = document.querySelector("#addAddressModal form");
const editAddressForm = document.querySelector("#addressModal form");
setEventListeners(addAddressForm);
setEventListeners(editAddressForm);

function setEventListeners(form) {

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    let isValidate = Array.from(form.elements).every(function (element) {
      return checkInputValidity(form, element);
    });

    if (isValidate) {
      if (form.classList.contains('requires-validation1')) {
        form.submit()
      } else if (form.classList.contains('requires-validation')) {
        const selected = form.getAttribute('data-id');
        const formData = $(form).serializeArray();
        const newData = {}
        formData.forEach((element)=>{
          newData[element.name]=element.value
        })
        updateAddress(newData, selected);
      }
    }
  });
}

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

function updateAddress(newData, selected) {
  console.log('thi funcrion is called');
  $.ajax({
    url: `/api/updateAddress/${selected}?source=checkout`,
    type: 'PUT',
    data:JSON.stringify(newData),
    contentType:'application/json',
    success: function (data, textStatus, xhr) {
      if (xhr.status === 200) {

        window.location.href = data.redirectUrl
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      if (xhr.status === 400) {
        console.log('Document not found:', xhr.responseText);
      }
      if(xhr.status===404){
        window.location.href = '/login'
      }
    }
  });
}

$('.payment').submit(function (event) {
  event.preventDefault();
  event.stopPropagation();
  const element = $(this).find('.ms-2')
  let selectedAddressId = $(this).attr('data-id');
  let formValue = $(this).serializeArray();
  console.log(formValue, element)
  if (formValue.length > 0) {
    clearMessage(element);
    let data = {};
    formValue.forEach((value) => {
      data[value.name] = value.value;
    })
    console.log(data, selectedAddressId);
    makePurchase(selectedAddressId, data);
  } else {
    displayErrorMessage(element
      , 'choose a payment option');
  }



})

function makePurchase(selectedAddressId, PaymentOption) {
  console.log(PaymentOption)
  $.ajax({
    url: `/api/createOrder/${selectedAddressId}`,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(PaymentOption),
    success: function (data, textStatus, xhr) {
      if (xhr.status === 200) {
        window.location.href = data.redirectUrl
      }

    },
    error: function () {
      if(xhr.status===404){
        window.location.href = '/login'
      }
    }

  })
}

//for displaying the erro message
function displayErrorMessage(element, message) {

  let errorMessageElement = element.parent().find('small');
  errorMessageElement.text(message);

}
// for clearing the error message
function clearMessage(element) {

  errorMessageElement = element.parent().find('small');
  errorMessageElement.text('');
}

$('#addAddressModal').on('hidden.bs.modal',function(){
  $('#addAddressModal input ').val('');
  $('#addAddressModal input ').removeClass('is-valid is-invalid');
  $('#addAddressModal textarea ').val('');
  $('#addAddressModal textarea ').removeClass('is-valid is-invalid');
  $('#addAddressModal small').text('');
  
})