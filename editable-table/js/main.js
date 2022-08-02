const handleExport = () => {
  var header = [];
  var data = [];

  var rows = $('#editableTable tr:not(:hidden)');
  rows.each((i, row) => {
    if (i == 0) {
      $(row).find('th:not(:empty)').each((j, col) => {
        header.push($(col).text().toLowerCase());
      });
    } else {
      const td = $(row).find('td');
      var hdata = {};

      header.forEach((head, i) => {
        if (i == 0) {
          hdata[head] = td.eq(i).find('select').val();
        } else {
          hdata[head] = td.eq(i).text();
        }
      });

      data.push(hdata);
    }
  });

  $('#exportData').text((JSON.stringify(data)));
};

const handleAddRow = () => {
  const newRow = $('#editableTable')
    .find('tr.hidden')
    .clone()
    .removeClass('hidden')
    .removeAttr('id');

  $('#editableTable').append(newRow);

  $(newRow).find('.removeRow').click(function(event) {
    $(this).closest('tr').remove();
  });
};

$('.removeRow').click(function(event) {
  $(this).closest('tr').remove();
});

$('#exportButton').click(handleExport);
$('#addRowButton').click(handleAddRow);
