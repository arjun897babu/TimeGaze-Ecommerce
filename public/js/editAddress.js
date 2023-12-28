// Client-side AJAX
const baseURL = window.location.protocol + '//' + window.location.host;

$('#updateAddress').click(function (event) {
  event.preventDefault();
  const selected = $(this).attr('data-id');
  const form = $('.requires-validation');
  const data  = form.serializeArray();
 
  const dataObject = {};
  data.forEach(item => {
    dataObject[item.name] = item.value;
  });
  console.log(selected, dataObject);
  updateAddress(dataObject, selected);
});

function updateAddress(newData, selected) {
  $.ajax({
    url: `${baseURL}/api/updateAddress/${selected}`,
    type: 'PUT',
    data: JSON.stringify(newData),
    contentType: 'application/json',
    success: function (data, textStatus, xhr) {
      if (xhr.status === 200) {
        console.log('Name update:', data);
        window.location.href = '/address'
    }
    },
    error: function (xhr, textStatus, errorThrown) {
      if (xhr.status === 404) {
        console.log('Document not found:', xhr.responseText);
      } 
    }
  });
}
