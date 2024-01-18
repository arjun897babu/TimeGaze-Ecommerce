
$('.remove-item').click(function (event) {
  event.preventDefault();
  const cartItemId = $(this).attr('data-id');
  console.log(cartItemId);
  if (cartItemId) {
    deleteCartItem(cartItemId);
  }
});


function updateQuantity(currentElement, value, availableQuantity) {
  let maxLimit = 5
  let inputField = currentElement.closest('.d-flex').querySelector('.cart-quantity')
  let currentValue = parseInt(inputField.value);
  console.log(currentValue, value)
  let newQuantity = currentValue + value;
  console.log(newQuantity)

  if (newQuantity > availableQuantity) {
    toastMessage("Maximum quantity exceeded")
  }
  else if (newQuantity > maxLimit) {
    toastMessage("We're sorry! Only 5 unit(s) allowed in each order")
  }
  else if (newQuantity >= inputField.min && newQuantity <= availableQuantity) {

    const cartItem = inputField.getAttribute('data-id');
    quantityManageMent(cartItem, newQuantity);
  }

}


function quantityManageMent(cartItem, newQuantity) {

  $.ajax({
    url: `/api/cartQuantiy/${cartItem}`,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({
      newQuantity: newQuantity
    }),
    success: function (data, textStatus, xhr) {
      if (xhr.status === 200) {
       
        location.reload();
      }


    }, error: function (xhr, textStatus) {
      if (xhr.status === 400) {
        console.log('updation failed:', xhr.responseText)
      }
      if (xhr.status === 404) {
        window.location.href = '/login'
      }
    }
  })
};

function deleteCartItem(cartItemId) {
  console.log('function is called');
  Swal.fire({
    title: "Remove Item?",
    text: "Are you sure you want to remove this item?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `/api/removeCartItem/${cartItemId}`,
        type: 'PUT',
        contentType: 'application/json',
        success: function (data, textStatus, xhr) {
          if (xhr.status === 200) {
            location.reload()

          }

        },
        error: function (xhr, textStatus, errorThrown) {

          if (xhr.status === 404) {
            window.location.href = '/login'
          }
        }

      })
    }
  });

}

function toastMessage(message) {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon: "error",
    title: message,
  });
}
