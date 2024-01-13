const currentList = [];


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
    invalid: 'enter a valid case diameter(upto 50mm)',
    invalid2:'enter a valid number'
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
  },
   fileInput: {
    invalid: 'please choose at least one image',
    invalid2: 'please choose min four images',
    inavlid3: 'invalid file format'
  }

};

//updateproduct page form validation
(function () {
  'use strict';

  const forms = document.querySelectorAll('.requires-validation');

  Array.from(forms).forEach(function (form) {
    Array.from(form.elements).forEach(function (element) {

      element.addEventListener('input', function (event) {

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
  let productName =/^[A-Za-z0-9\-]{3,20}( [0-9]+)?$/;
  let brandName = /^[a-zA-Z][a-zA-Z ']{2,20}[a-zA-Z]$/;
  let price = /^[1-9]\d*$/
  let discount = /^(?:[1-9]|[1-9][0-9]|100)$/;

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
  else if (!price.test(caseDiameterInputValue)) {
    displayErrorMessage(caseDiameterInput, erroMessage.caseDiameterInput.invalid2)
    caseDiameterInput.classList.remove('is-valid');
    caseDiameterInput.classList.add('is-invalid')

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

  if (categoryInputValue !== 'Choose') {
    clearMessage(categoryInput);
    categoryInput.classList.remove('is-invalid');
    categoryInput.classList.add('is-valid')
  } else {
    isValid = false
    displayErrorMessage(categoryInput, erroMessage.categoryInput.invalid);
    categoryInput.classList.add('is-invalid');
    categoryInput.classList.remove('is-valid')
  }

  //to check quantity
  if (quantityInputValue === '') {
    displayErrorMessage(quantityInput, erroMessage.common.required);
    isValid = false;
    quantityInput.classList.add('is-invalid');
    quantityInput.classList.remove('is-valid')
  }
  else if (quantityInputValue > 0) {
    clearMessage(quantityInput);
    quantityInput.classList.add('is-valid');
    quantityInput.classList.remove('is-invalid');

  } else {
    isValid = false
    displayErrorMessage(quantityInput, erroMessage.quantityInput.invalid);
    quantityInput.classList.add('is-invalid');
    quantityInput.classList.remove('is-valid')
  }

  //to check files

  if (fileInput.files.length < 1) {
    isValid = false;
    displayErrorMessage(fileInput, erroMessage.fileInput.invalid);
    fileInput.classList.add('is-invalid');
    fileInput.classList.remove('is-valid')
  } else {
    clearMessage(fileInput)
    fileInput.classList.remove('is-invalid');
    fileInput.classList.add('is-valid')
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





let fileInput = document.getElementById('formFileMultiple')
let previewDiv = document.querySelector('.image-preview-div');

function createFileList(currentList) {
  const dataTransfer = new DataTransfer();
  currentList.forEach((file) => {
    dataTransfer.items.add(file);
  });
  return dataTransfer.files;
}

function setupImagePreview() {

  let files = Array.from(fileInput.files);

  if (files.length + currentList.length <= 4) {
    currentList.push(...files);

  } else {

    previewDiv.innerHTML = '';
    currentList.splice(0, currentList.length);
    // Usage
    const newFileList = createFileList(currentList);
    fileInput.files = newFileList;

    displayErrorMessage(fileInput, erroMessage.fileInput.invalid2);
    fileInput.classList.add('is-invalid');
    fileInput.classList.remove('is-valid');
    return false;
  }

  let imageValidation = imageValidationCheck(previewDiv);

  if (imageValidation) {
    clearMessage(fileInput);
    previewImage(previewDiv);
    fileInput.classList.remove('is-invalid');
    fileInput.classList.add('is-valid')
  }
}
//event listener for uploading files
fileInput.addEventListener('change', setupImagePreview);

/*validating the uploaded file */
function imageValidationCheck() {
  let imageRegex = /^.*\.(jpg|jpeg|png|gif)$/;

  let validate = true;
  if (currentList.length < 1) {
    validate = false
    displayErrorMessage(fileInput, erroMessage.fileInput.invalid);
    fileInput.classList.add('is-invalid');
    fileInput.classList.remove('is-valid');
  }
  else {
    for (let file of currentList) {
      if ((!imageRegex.test(file.name))) {
        previewDiv.innerHTML = ''
        currentList.splice(0, currentList.length)
        validate = false
        displayErrorMessage(fileInput, erroMessage.fileInput.inavlid3);
        fileInput.classList.add('is-invalid');
        fileInput.classList.remove('is-valid');
        break;
      }
    }
  }
  return validate
}


//preview image function
function previewImage(previewDiv) {


  // Clear previous previews
  previewDiv.innerHTML = ''

  // Usage
  const newFileList = createFileList(currentList);
  fileInput.files = newFileList;

  for (let i = 0; i < currentList.length; i++) {
    const file = currentList[i];

    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement('img');
      const div = document.createElement('div');
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('bi', 'bi-x-circle');

      iconSpan.addEventListener('click', () => {
        let index = currentList.indexOf(file)
        console.log(index, 'index');

        currentList.splice(index, 1);
        previewDiv.removeChild(div);

        // Usage
        const newFileList = createFileList(currentList);
        fileInput.files = newFileList;
        imageValidationCheck();
        console.log(currentList, 'final current list');
      });

      // Icon style
      iconSpan.style.position = 'absolute';
      iconSpan.style.top = '0.35rem';
      iconSpan.style.right = '1.35rem';
      iconSpan.style.cursor = 'pointer';
      iconSpan.style.fontSize = 'inherit'

      // Div style
      div.classList.add('col-sm-3');
      div.classList.add('col-4');
      div.style.position = 'relative';

      // Img style
      img.src = e.target.result;
      img.alt = 'Preview';
      img.style.objectFit = 'cover';
      img.style.height = '100%';
      img.style.width = '100%';

      div.appendChild(iconSpan);
      div.appendChild(img);
      previewDiv.appendChild(div);
      
    };
    
    reader.readAsDataURL(file);
  }

}




