$(document).ready(function () {
  $('.delete-address').click(function () {
    const selectedId = $(this).val()
    const addressDocumentId = $(this).attr('data-id');
    console.log(addressDocumentId, selectedId);
    deleteAddress(selectedId, addressDocumentId);
  });

  function deleteAddress(selectedId, addressDocumentId) {
    $.ajax({
      url: `http://localhost:3000/api/deleteAddress/${addressDocumentId}`,
      type: 'PATCH',
      data: JSON.stringify({
        selectedId: selectedId
      }),
      contentType: 'application/json',
      success: function (data) {
        console.log(data)
        location.reload();
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error('Error updating the category');
        console.log('Response:', xhr.responseText);
        if(xhr.status===404){
          window.location.href = '/login'
        }
      }
    })
  }
})