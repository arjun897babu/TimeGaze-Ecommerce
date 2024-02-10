$(document).ready(function(){
  const updateCategoryMessage = localStorage.getItem('updateCategory');
  if(updateCategoryMessage){
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
      title: updateCategoryMessage
    });
    localStorage.removeItem('updateCategory')
  };

  $('.delete_button').click(function(){
    const categoryId = $(this).attr('data-id');
    softDelete(categoryId);
  }); 

  function softDelete(categoryId){
    console.log(categoryId)
    $.ajax({
      url:`/api/deleteCategory/${categoryId}`,
      type:'PUT',
      contentType:'application/json',
      success: function(data){
        location.reload()
      },
      error:function(error){
        console.error(error.message)
      }
    })
  }
})