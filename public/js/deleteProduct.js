$(document).ready(function () {
  $('.delete_product').click(function () {
    const productId = $(this).attr('data-id');
    const container = $(this).closest('tr');
    console.log(container)
    softDelete(productId, container);
  });

  function softDelete(productId, container) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `http://localhost:3000/api/deleteProduct/${productId}`,
          type: 'PUT',
          contentType: 'application/json',
          success: function (data) {
            const newData = data.product;
            console.log(newData)

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
              title: "Product delted"
            });
            setTimeout(function () {
              location.reload();
            }, 1000);
          },
          error: function (error) {
            console.error(error.message)
          }
        })
      }
    });

  }

})

