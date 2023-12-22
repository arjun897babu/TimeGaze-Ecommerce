$(document).ready(function(){
  $('.delete_product').click(function(){
    const productId = $(this).attr('data-id');
    softDelete(productId);
  }); 

  function softDelete(productId){
    console.log(productId)
    $.ajax({
      url:`http://localhost:3000/api/deleteProduct/${productId}`,
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