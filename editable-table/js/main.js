const handleExport = () => {
  var header = [];
  var data = [];

  var rows = $('#editableTable tr:not(:hidden)');
  rows.each((i, row) => {
    if (i == 0) {
      $(row).find('th').each((j, col) => {
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
  const $newRow = $('#editableTable')
    .find('tr.hidden')
    .clone()
    .removeClass('hidden')
    .removeAttr('id');

  $('#editableTable').append($newRow);
};

const handleRemoveRow = () => {
  const editableTable = $('#editableTable')[0];
  if (2 < editableTable.rows.length) {
    editableTable.rows[editableTable.rows.length - 1].remove();
  }
};

const exportButton = document.getElementById('exportButton');
const addRowButton = document.getElementById('addRowButton');
const removeRowButton = document.getElementById('removeRowButton');

exportButton.addEventListener('click', handleExport);
addRowButton.addEventListener('click', handleAddRow);
removeRowButton.addEventListener('click', handleRemoveRow);
