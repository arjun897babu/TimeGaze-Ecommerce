$('.changeOrder').click(async function (event) {
  event.preventDefault();
  event.stopPropagation();
  let btn = $(this);
  let statusDiv =btn.closest('.row').find('.status');
  let orderStatus = btn.val();
  let orderId = btn.attr('data-id');
  console.log(orderId, orderStatus,statusDiv);
  const { value: text } = await Swal.fire({
    input: "textarea",
    inputLabel: "Message",
    inputPlaceholder: "Type your message here...",
    inputAttributes: {
      "aria-label": "Type your message here"
    },
    showCancelButton: true
  });
  if (text) {
    changeOrderStatus(orderId, btn, statusDiv, orderStatus,text)

  }
 
})

function changeOrderStatus(orderId, btn, statusDiv, orderStatus,text) {
  Swal.fire({
    title: "Are you sure?",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Cancel Order!"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.showLoading();
      $.ajax({
        url: `/api/changeOrderStatus/${orderId}`,
        type: 'PUT',
        data: JSON.stringify({ orderStatus: orderStatus,cancelReason:text }),
        contentType: 'application/json',
        success: function (data, textStatus, xhr) {
          if (xhr.status === 200) {
            let newStatus = data.response.orderStatus;
            statusDiv.empty();
            statusDiv.html(`<span class="me-3">Status:</span>${newStatus}`);
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
              title: "Order canceled"
            });
           btn.hide()
          }

        },
        error: function (xhr, textStatus, errorThrown) {
          if (xhr.status === 400){ console.log(xhr.responseText)

          }if(xhr.status===404){
            window.location.href='/loign'
          }
        
        }


      })
    } else {
   
    }
  });

}