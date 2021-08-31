'use strict';

// write code here
const table = document.querySelector('tbody');
const headers = document.querySelectorAll('th');
const head = document.querySelector('thead');
let selectedColumn; // current selected column for sort

head.addEventListener('click', (e) => {
  sortColumn(e.target.textContent);
});

// sort rows function
function sortColumn(column) {
  const rowsNew = document.querySelectorAll('tbody tr');
  let sortedRows;
  const index = [...headers].findIndex(item => item.textContent === column);

  // re-sort check
  if (column === selectedColumn) {
    table.classList.toggle('sort');

    switch (column) {
      case 'Name':
      case 'Position':
      case 'Office':
      case 'Age':
        if (table.classList.contains('sort')) {
          sortedRows = [...rowsNew]
            .sort((rowA, rowB) =>
              rowB.cells[index].innerHTML.toLowerCase()
              > rowA.cells[index].innerHTML.toLowerCase() ? 1 : -1);
        } else {
          sortedRows = [...rowsNew]
            .sort((rowA, rowB) =>
              rowA.cells[index].innerHTML.toLowerCase()
              > rowB.cells[index].innerHTML.toLowerCase() ? 1 : -1);
        }

        table.append(...sortedRows);
        break;

      case 'Salary':
        if (table.classList.contains('sort')) {
          sortedRows = [...rowsNew]
            .sort((rowA, rowB) =>
              +rowB.cells[index].innerHTML.replace(/\D/gi, '')
              - +rowA.cells[index].innerHTML.replace(/\D/gi, ''));
        } else {
          sortedRows = [...rowsNew]
            .sort((rowA, rowB) =>
              +rowA.cells[index].innerHTML.replace(/\D/gi, '')
              - +rowB.cells[index].innerHTML.replace(/\D/gi, ''));
        }

        table.append(...sortedRows);
        break;
    }
  } else {
    // new column sort
    switch (column) {
      case 'Name':
      case 'Position':
      case 'Office':
      case 'Age':
        sortedRows = [...rowsNew]
          .sort((rowA, rowB) =>
            rowA.cells[index].innerHTML.toLowerCase()
            > rowB.cells[index].innerHTML.toLowerCase() ? 1 : -1);

        table.append(...sortedRows);

        // remebmer column was sort
        selectedColumn = column;
        break;

      case 'Salary':
        sortedRows = [...rowsNew]
          .sort((rowA, rowB) =>
            +rowA.cells[index].innerHTML.replace(/\D/gi, '')
            - +rowB.cells[index].innerHTML.replace(/\D/gi, ''));

        table.append(...sortedRows);
        selectedColumn = column;
        break;
    }
  }
}

// create focus on row
table.addEventListener('click', (e) => {
  const rows = document.querySelectorAll('tbody tr');

  for (const element of rows) {
    if (element.classList.contains('active')) {
      element.classList.remove('active');
    }
  }
  e.target.parentElement.classList.add('active');
});

// create form
const form = document.createElement('form');

form.classList.add('new-employee-form');

document.body.append(form);

// create all input for form
function createInput(typeInput, nameInput, textContentInput) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  input.type = typeInput;
  input.name = nameInput;
  input.setAttribute('data-qa', nameInput);
  input.required = true;
  label.textContent = textContentInput;
  label.append(input);
  form.append(label);

  if (nameInput === 'name') {
    input.minLength = 4;
  }

  if (nameInput === 'age') {
    input.pattern = '[0-9]+';
    input.min = 18;
    input.max = 90;
  }
}

createInput('text', 'name', 'Name:');
createInput('text', 'position', 'Position:');

// create select input
const selectInput = document.createElement('select');
const labelSelect = document.createElement('label');

selectInput.name = 'office';
labelSelect.textContent = 'Office:';
selectInput.setAttribute('data-qa', 'office');
selectInput.required = true;
labelSelect.append(selectInput);
form.append(labelSelect);

// create option for select input
function createOption(value, contentText) {
  const option = document.createElement('option');

  option.value = value;
  option.textContent = contentText;

  return option;
}

selectInput.append(createOption('Tokyo', 'Tokyo'));
selectInput.append(createOption('Singapore', 'Singapore'));
selectInput.append(createOption('London', 'London'));
selectInput.append(createOption('New York', 'New York'));
selectInput.append(createOption('Edinburgh', 'Edinburgh'));
selectInput.append(createOption('San Francisco', 'San Francisco'));

createInput('number', 'age', 'Age:');
createInput('number', 'salary', 'Salary:');

// create button submit
const buttonSub = document.createElement('button');

buttonSub.type = 'submit';
buttonSub.textContent = 'Save to table';
form.append(buttonSub);

// create function notification
const pushNotification = (title, description, type) => {
  const element = document.createElement('div');

  element.className = `notification ${type}`;

  element.setAttribute('data-qa', 'notification');

  document.body.append(element);

  const tit = document.createElement('h2');

  tit.textContent = `${title}`;
  tit.className = 'title';

  const des = document.createElement('p');

  des.textContent = `${description}`;
  element.append(tit, des);

  setTimeout(() => {
    element.style.cssText = 'display:none';
  }, 2000);
};

// submit notification
buttonSub.addEventListener('click', () => {
  if (!form.checkValidity()) {
    pushNotification('Error message',
      'Data error', 'error');
  } else {
    addRow();

    pushNotification('Success message',
      'New employee is successfully added to the table', 'success');
  }
});

// create function add new row in table
function addRow() {
  const data = new FormData(form);
  const newRow = document.createElement('tr');

  newRow.innerHTML = `<td>${data.get('name')}</td>
  <td>${data.get('position')}</td>
  <td>${data.get('office')}</td>
  <td>${data.get('age')}</td>
  <td>$${new Intl.NumberFormat().format(data.get('salary'))}</td>`;
  table.append(newRow);
}

// stop page reload
form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.reset();
});

// new input cell
const cells = document.querySelector('tbody');

cells.addEventListener('dblclick', (e) => {
  let target;
  const textContent = e.target.innerHTML;

  if (target === undefined) {
    target = e.target;

    target.innerHTML = `<input class='cell-input'>`;

    const input = document.querySelector('.cell-input');

    input.value = textContent;
    input.focus();

    const targetCell = [...e.target.closest('tr').children];

    if (e.target === targetCell[0]
      || e.target === targetCell[1] || e.target === targetCell[2]) {
      input.type = 'text';
      input.minLength = 4;
    }

    if (e.target === targetCell[3]) {
      input.type = 'number';
      input.pattern = '[0-9]+';
      input.min = 18;
      input.max = 90;
    }

    if (e.target === targetCell[4]) {
      input.pattern = '[0-9]+';
    }

    input.addEventListener('keydown', (ev) => {
      if (ev.keyCode === 13) {
        if (input.value !== textContent
          && input.value !== '' && input.checkValidity()) {
          if (target === targetCell[4]) {
            target.innerHTML = '$'
            + `${new Intl.NumberFormat().format(input.value)}`;
          } else {
            target.innerHTML = `${input.value}`;
          }
          input.remove();
        } else {
          target.innerHTML = textContent;
          input.remove();
        }
      }
    });

    input.addEventListener('blur', () => {
      if (input.value !== textContent && input.value !== ''
      && input.checkValidity()) {
        target.innerHTML = `${input.value}`;
        input.remove();
      } else {
        target.innerHTML = textContent;
        input.remove();
      }
    });
  }
});
