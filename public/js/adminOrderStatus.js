$(document).ready(function () {
  if ($('select[name="orderStatus"]').val()) {
    let fistValue = $('select[name="orderStatus"]').val();
    $('.changeOrder').val(fistValue);
  }

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
            let { message } = JSON.parse(xhr.responseText)
            localStorage.setItem('message', message)
            location.reload();

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


