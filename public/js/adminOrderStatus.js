$(document).ready(function () {
  let fistValue = $('select[name="orderStatus"]').val();
  $('.changeOrder').val(fistValue);
});

$(document).on('click', 'select[name="orderStatus"]', function () {
  let changedValue = $(this).val();
  console.log(changedValue)
  $(this).closest('.justify-content-between').find('.changeOrder').val(changedValue);
});

$(document).on('click', '.changeOrder', function (event) {
  event.preventDefault();
  event.stopPropagation();
  let btn = $(this);
  let orderStatus = btn.val();
  let statusDiv = btn.closest('tr')
  let orderId = btn.attr('data-id');
  console.log(orderId, orderStatus, statusDiv);
  changeOrderStatus(orderId, orderStatus, statusDiv, btn);
})

function changeOrderStatus(orderId, orderStatus, statusDiv, btn) {
  Swal.fire({
    title: "Are you sure?",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Change"
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `/api/changeOrderStatus/${orderId}`,
        type: 'PUT',
        data: JSON.stringify({ orderStatus: orderStatus }),
        contentType: 'application/json',
        success: function (data, textStatus, xhr) {
          if (xhr.status === 200) {
            let newStatus = data.response;
            console.log(newStatus)
            statusDiv.empty();
            if (newStatus.orderStatus !== 'delivered' && newStatus.orderStatus !== 'canceled') {
              statusDiv.html(`<th>
              <img src="uploads/${newStatus.image[0]} " style="width: 4rem;object-fit: cover;">
            </th>
            <td class="fixed-td">
            ${newStatus._id}
            </td>
            <td class="fixed-td">
              <h6>
              ${newStatus.productName}
              </h6>
              <p class="card-text">
              ${newStatus.discountPrice
                }<del class="text-black-50">
                ${newStatus.price}
                  </del>
              </p>
            </td>
            <td class="status"> ${newStatus.orderStatus}</td>
            <td class="">
            <div class="justify-content-between d-flex">
            <select name="orderStatus" id="" class="me-1">
              <option value="placed"  ${newStatus.orderStatus === 'placed' ? 'selected' : ''}>placed</option>
              <option value="pending"  ${newStatus.orderStatus === 'pending' ? 'selected' : ''}>pending</option>
              <option value="shipped"  ${newStatus.orderStatus === 'shipped' ? 'selected' : ''}>shipped</option>
              <option value="delivered"  ${newStatus.orderStatus === 'delivered' ? 'selected' : ''}>delivered</option>
              <option value="canceled"  ${newStatus.orderStatus === 'canceled' ? 'selected' : ''}>canceled</option>
            </select>
            <button data-id="${newStatus._id}" style="font-size: 0.6rem;" class="btn btn-dark me-1 changeOrder">submit</button>
          </div>
                </div>
            </td>`);
            } else if (newStatus.orderStatus === 'canceled') {
              statusDiv.html(
                `<th>
            <img src="uploads/${newStatus.image[0]} " style="width: 4rem;object-fit: cover;">
          </th>
          <td class="fixed-td">
          ${newStatus._id}
          </td>
          <td class="fixed-td">
            <h6>
            ${newStatus.productName}
            </h6>
            <p class="card-text">
            ${newStatus.discountPrice
              }<del class="text-black-50">
              ${newStatus.price}
                </del>
            </p>
          </td>
          <td class="status"> ${newStatus.orderStatus}</td>
          <td class="">
          <div class="justify-content-between d-flex">
          <span class="text-danger">Order ${newStatus.orderStatus}.</span>
        </div>
              </div>
          </td>`
              );
            } else {
              statusDiv.html(`<th>
              <img src="uploads/${newStatus.image[0]} " style="width: 4rem;object-fit: cover;">
            </th>
            <td class="fixed-td">
            ${newStatus._id}
            </td>
            <td class="fixed-td">
              <h6>
              ${newStatus.productName}
              </h6>
              <p class="card-text">
              ${newStatus.discountPrice
                }<del class="text-black-50">
                ${newStatus.price}
                  </del>
              </p>
            </td>
            <td class="status"> ${newStatus.orderStatus}</td>
            <td class="">
            <div class="justify-content-between d-flex">
            <span class="text-success">Order ${newStatus.orderStatus}.</span>
          </div>
                </div>
            </td>`);
            }

            ;
            const Toast = Swal.mixin({
              toast: true,
              position: "bottom",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: `Order ${data.response.orderStatus} `
            });

          }

        },
        error: function (xhr, textStatus, errorThrown) {
          if (xhr.status === 400) {
            console.log(xhr.responseText)

          }
        }


      })
    }
  });
}


