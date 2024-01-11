
$('.remove-item').click(function (event) {
  event.preventDefault();
  const cartItemId = $(this).attr('data-id');
  console.log(cartItemId);
  if (cartItemId) {
    deleteCartItem(cartItemId);
  }
})

$('.cart-quantity').change(function(event){
  event.preventDefault();
  const cartItem = $(this).attr('data-id');
  const newQuantity = $(this).val();
  quantityManageMent(cartItem,newQuantity);
})



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
            console.log(xhr.responseText);
            console.log(data)
          }

        }

      })
    }
  });

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
        console.log('name update:', data);
        location.reload();
      }


    }, error: function (xhr, textStatus) {
      if (xhr.status === 400) {
        console.log('updation failed:', xhr.responseText)
      }
    }
  })
};

