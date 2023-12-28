
  $('.remove-item').click(function (event) {
    event.preventDefault();
    const cartItemId = $(this).attr('data-id');
    console.log(cartItemId);
    if (cartItemId) {
      deleteCartItem(cartItemId);
    }
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
            updateCartDetails(data.cartItem)
           
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

function updateCartDetails(cartData) {
  console.log(cartData)

  const cartContainer = $('.col-md-9');

  cartContainer.empty();

  for (let i = 0; i < cartData.length; i++) {
    let itemHtml = createCartItemHtml(cartData[i]);
    console.log(itemHtml)
    cartContainer.append(itemHtml);
  }
}

function createCartItemHtml(cartItem) {
  const quantityOptions = [];
  for (let i = 1; i <= 4; i++) {
    quantityOptions.push(`<option value="${i}" ${cartItem.quantity === i ? 'selected' : ''}>${i}</option>`);
  }
  return `
  <div class="card border mb-1 shadow-0">
    <div class="m-1">
      <div class="row gy-1 mb-2">
        <div class="col-md-6">
          <div>
            <div class="row">
              <div class="col-4">
                <img src="uploads/${cartItem.product.image[0]}" class="border rounded"
                  style="object-fit: cover; height: 5rem;" />
              </div>
              <div class="col-8">
                <a href="#" class="nav-link">
                  ${cartItem.product.productName}
                </a>
                <p class="text-muted">
                  ${cartItem.product.brand}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-sm-6 col-6 d-flex flex-row flex-lg-column flex-xl-row text-nowrap">
          <div>
            <select style="width: 100px;" class="form-select me-4" name="quantity">
            ${quantityOptions.join('')};
            </select>
          </div>
          <div>
            <text class="h6">₹ ${cartItem.product.discountPrice}</text>
            <small class="text-success">
              ${cartItem.product.offer}% off
            </small>
            <br />
            <small class="text-muted text-nowrap">
              ₹ ${cartItem.product.discountPrice} / per item
            </small>
          </div>
        </div>
        <div class="col-lg col-sm-6 d-flex justify-content-sm-center justify-content-md-start justify-content-lg-center justify-content-xl-end mb-2">
          <div class="float-md-end">
            <button data-id="${cartItem._id}" class="btn btn-light border text-danger icon-hover-danger remove-item">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
}