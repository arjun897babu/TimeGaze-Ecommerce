$('.change-address').click(function(event){
  event.preventDefault();
  const selectedId = $(this).attr('data-id');
  console.log(selectedId);
  makeAddressDefualt(selectedId);
})

function makeAddressDefualt(selectedId){
  $.ajax({
    url:`/api/makeDefault/${selectedId}`,
    type:'PUT',
    contentType:'application/json',
    success: function(response) {
     location.reload()
    },
    error: function(error) {
     
      console.error(error);
    }

  })
}

$('#updateAddress').click(function (event) {
  event.preventDefault();
  event.stopPropagation()
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
    url: `/api/updateAddress/${selected}?source=checkout`,
    type: 'PUT',
    data: JSON.stringify(newData),
    contentType: 'application/json',
    success: function (data, textStatus, xhr) {
      if (xhr.status === 200) {
       
        window.location.href = data.redirectUrl
    }
    },
    error: function (xhr, textStatus, errorThrown) {
      if (xhr.status === 404) {
        console.log('Document not found:', xhr.responseText);
      } 
    }
  });
}