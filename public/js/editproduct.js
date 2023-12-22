
//updateproduct page form validation
(function () {
  'use strict';

  const forms = document.querySelectorAll('.requires-validation');

  Array.from(forms).forEach(function (form) {
    console.log(form.elements)
    Array.from(form.elements).forEach(function (element) {

      element.addEventListener('input', function () {

        checkInputValidity(form, element);
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

})();



function checkInputValidity(form, element) {
  let productName = /^[a-zA-Z][a-zA-Z ']{2,20}(?:\d{1,})?[a-zA-Z]$/;
  let brandName = /^[a-zA-Z][a-zA-Z ']{2,20}[a-zA-Z]$/;
  let price = /^[0-9]+$/
  let discount = /^(?:[1-9]|[1-9][0-9]|100)$/

  console.log('called')
  //input field
  let productNameInput = form.elements['validateProductName'];
  let brandNameInput = form.elements['validatebrand'];
  let caseDiameterInput = form.elements['validateCaseDiameter'];
  let caseShapeInput = form.elements['validateCaseShape'];
  let validatePrice = form.elements['validatePrice'];
  let offerInput = form.elements['validateOffer'];
  let discountPriceInput = form.elements['validateDiscount'];
  let categoryInput = form.elements['validateCategory'];
  let quantityInput = form.elements['validateQuantity'];
  let fileInput = form.elements['formFileMultiple'];

  //input field values
  let productNameInputValue = productNameInput.value;
  let brandNameInputValue = brandNameInput.value;
  let caseDiameterInputValue = caseDiameterInput.value;
  let caseShapeInputValue = caseShapeInput.value;
  let PriceInputValue = validatePrice.value;
  let offerInputValue = offerInput.value;
  let discountPriceInputValue = discountPriceInput.value;
  let categoryInputValue = categoryInput.value;
  let quantityInputValue = quantityInput.value;


  console.log(productNameInputValue, brandNameInputValue, caseDiameterInputValue, caseShapeInputValue, PriceInputValue, offerInputValue, discountPriceInputValue, 'categ:'+categoryInputValue, quantityInputValue,fileInput.value);

  let erroMessage = {
    common: {
      required: 'this field is required'
    },
    productNameInput: {
      invalid: 'enter valid product name(3-20 characters)'
    },
    brandNameInput: {

      invalid: 'enter valid brand name(3-20 characters)'
    },
    caseDiameterInput: {
      invalid: 'enter a valid case diameter(upto 50mm)'
    },
    caseShapeInput: {

      invalid: 'enter valid product shape (3-20 characters)'
    },
    validatePrice: {

      invalid: 'enter a valid price',

    },
    offerInput: {
      invalid: 'enter a valid offer (upto 100)',
      invalid2: 'enter price first'
    },
    quantityInput: {
      invalid: 'enter vaid quanity'
    },
    categoryInput: {
      invalid: 'please choose a category'
    }

  }

  let isValid = true;

  //for checking the name
  if (productName.test(productNameInputValue)) {
    clearMessage(productNameInput);
    productNameInput.classList.remove('is-invalid');
    productNameInput.classList.add('is-valid')
  } else if (productNameInputValue === '') {
    displayErrorMessage(productNameInput, erroMessage.common.required);
    isValid = false;
    productNameInput.classList.add('is-invalid');
    productNameInput.classList.remove('is-valid');
  } else {
    displayErrorMessage(productNameInput, erroMessage.productNameInput.invalid)
    isValid = false;
    productNameInput.classList.add('is-invalid');
  }


  //for checking brand name

  if (brandName.test(brandNameInputValue)) {
    clearMessage(brandNameInput)
    brandNameInput.classList.add('is-valid');
    brandNameInput.classList.remove('is-invalid');
  } else if (brandNameInputValue === '') {
    isValid = false;
    displayErrorMessage(brandNameInput, erroMessage.common.required);
    brandNameInput.classList.add('is-invalid');
    brandNameInput.classList.remove('is-valid');
  } else {
    displayErrorMessage(brandNameInput, erroMessage.brandNameInput.invalid);
    isValid = false;
    brandNameInput.classList.add('is-invalid');
    brandNameInput.classList.remove('is-valid')
  }

  //for checking case diameter
  if (caseDiameterInputValue === '') {
    displayErrorMessage(caseDiameterInput, erroMessage.common.required)
    isValid = false
    caseDiameterInput.classList.remove('is-valid');
    caseDiameterInput.classList.add('is-invalid');
  }
  else if (caseDiameterInputValue <= 50 && Number(caseDiameterInputValue) % 1 === 0) {
    clearMessage(caseDiameterInput);
    caseDiameterInput.classList.add('is-valid');
    caseDiameterInput.classList.remove('is-invalid')

  } else {
    displayErrorMessage(caseDiameterInput, erroMessage.caseDiameterInput.invalid)
    isValid = false
    caseDiameterInput.classList.remove('is-valid');
    caseDiameterInput.classList.add('is-invalid');
  }

  //for cheking the case shape

  if (brandName.test(caseShapeInputValue)) {
    clearMessage(caseShapeInput);
    caseShapeInput.classList.add('is-valid');
    caseShapeInput.classList.remove('is-invalid');

  } else if (caseShapeInputValue === '') {
    displayErrorMessage(caseShapeInput, erroMessage.common.required);
    isValid = false
    caseShapeInput.classList.remove('is-valid');
    caseShapeInput.classList.add('is-invalid');

  } else {
    displayErrorMessage(caseShapeInput, erroMessage.caseShapeInput.invalid);
    isValid = false
    caseShapeInput.classList.remove('is-valid');
    caseShapeInput.classList.add('is-invalid');
  }

  //for rechecking the price
  if (PriceInputValue === '') {
    isValid = true;
    displayErrorMessage(validatePrice, erroMessage.common.required);
    validatePrice.classList.add('is-invalid');
    validatePrice.classList.remove('is-valid')
  }
  else if (price.test(PriceInputValue)) {
    clearMessage(validatePrice);
    validatePrice.classList.add('is-valid');
    validatePrice.classList.remove('is-invalid');
  } else {
    isValid = false;
    displayErrorMessage(validatePrice, erroMessage.validatePrice.invalid);
    validatePrice.classList.add('is-invalid');
    validatePrice.classList.remove('is-valid')
  }
  //for checking the discount percentage

  if (offerInputValue === '') {
    isValid = false;
    displayErrorMessage(offerInput, erroMessage.common.required);
    offerInput.classList.add('is-invalid');
    offerInput.classList.remove('is-valid')
  } else if (discount.test(offerInputValue)) {
    clearMessage(offerInput);
    offerInput.classList.add('is-valid');
    offerInput.classList.remove('is-invalid')

  }
  else {
    displayErrorMessage(offerInput, erroMessage.offerInput.invalid);
    isValid = false;
    offerInput.classList.add('is-invalid');
    offerInput.classList.remove('is-valid');
  }



  let discountPrice = Math.round(PriceInputValue - (PriceInputValue * offerInputValue / 100));

  if (Number(discountPrice) % 1 === 0 && discountPrice >= 0 && discount.test(offerInputValue)) {
    discountPriceInput.value = discountPrice;
  } else {
    discountPriceInput.value = '';
  }
  
  //to check category

  if (categoryInputValue !=='Choose...') {
    console.log("entering"+categoryInputValue);
    console.log(categoryInput)
    clearMessage(categoryInput);
    categoryInput.classList.remove('is-invalid');
    categoryInput.classList.add('is-valid')
  } else {
    isValid=false
    displayErrorMessage(categoryInput, erroMessage.categoryInput.invalid);
    categoryInput.classList.add('is-invalid');
    categoryInput.classList.remove('is-valid')
  }

  //to check quantity
  if(quantityInputValue===''){
    displayErrorMessage(quantityInput,erroMessage.common.required);
    isValid=false;
    quantityInput.classList.add('is-invalid');
    quantityInput.classList.remove('is-valid')
  }
  else if (discount.test(quantityInputValue)) { 
    clearMessage(quantityInput);
    quantityInput.classList.add('is-valid');
    quantityInput.classList.remove('is-invalid')

  }else{
    isValid = false
    displayErrorMessage(quantityInput,erroMessage.quantityInput.invalid);
    quantityInput.classList.add('is-invalid');
    quantityInput.classList.remove('is-valid')
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
  errorMessageElement.innerHTML = ''
}




 