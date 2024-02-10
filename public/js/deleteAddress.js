$(document).ready(function () {
  $('.delete-address').click(function () {
    const selectedId = $(this).val()
    const addressDocumentId = $(this).attr('data-id');
    deleteAddress(selectedId, addressDocumentId);
  });

  function deleteAddress(selectedId, addressDocumentId) {
    $.ajax({
      url: `/api/deleteAddress/${addressDocumentId}`,
      type: 'PATCH',
      data: JSON.stringify({
        selectedId: selectedId
      }),
      contentType: 'application/json',
      success: function (data) {
        location.reload();
      },
      error: function (xhr, textStatus, errorThrown) {
        if(xhr.status===404){
          window.location.href = '/login'
        }
      }
    })
  }
})