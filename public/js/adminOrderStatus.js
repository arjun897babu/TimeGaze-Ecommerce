
$(document).on('click', 'select[name="orderStatus"]', function () {
  let changedValue = $(this).val();
  $(this).closest('.justify-content-between').find('.changeOrder').val(changedValue);
});

$(document).on('click', '.changeOrder', function (event) {
  event.preventDefault();
  event.stopPropagation();
  let btn = $(this);
  let orderStatus = btn.val();
  let statusDiv = btn.closest('tr')
  let orderId = btn.attr('data-id');
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

          }if(xhr.status===404){
            window.location.href = '/adminHome'
          }
        }


      })
    }
  });
}


