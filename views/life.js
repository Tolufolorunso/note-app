const form = document.getElementById('form');
const addBtn = document.getElementById('add-button');
const content = document.getElementById('note');
const topic = document.getElementById('topic');
const alertBox = document.getElementById('alert-box');
const spinner = document.getElementById('spinner');
const cancelBtn = document.getElementById('cancel');
const editId = document.getElementById('id');
const timeCreated = document.getElementById('time-created');


function eventListener() {
  displayNotes();
  form.addEventListener("submit", addNote);
  topic.addEventListener('change', addNoteInput);
  content.addEventListener('input', addNoteInput);
  cancelBtn.addEventListener('click', cancelUpdate);
  document.getElementById('output').addEventListener('click', deleteNote);
  document.getElementById('output').addEventListener('click', editAndUpdate);
}

// @desc show alert
const showAlertMessage = (message, className) => {
  alertBox.classList.add('block');
  alertBox.style.background = '#0eadf4';
  alertBox.innerHTML = `<p>${message}</p>`;
  setTimeout(() => {
    alertBox.classList.remove('block');
    alertBox.innerHTML = '';
  }, 1500);
};


// @desc        This is for adding new note or updating existing one
// @route       POST and PATCH /api/notes
const addNote = evt => {
  if (addBtn.classList.contains('update')) {
    addBtn.classList.remove('update');
    addBtn.classList.add('add');
    changeState('add');
    addBtn.style.cursor = '';
  }
  evt.preventDefault();
  const body = {
    note: note.value,
    topic: topic.value
  };

  if (editId.value === '') {
    //    spinner.removeAttribute('hidden');
    const data = sendRequestToServer('/', body, 'POST');
    data
      .then(response => {
        //        spinner.setAttribute('hidden', '');
        displayNotes();
        showAlertMessage('Note added successfully', 'success');
      })
      .catch(error => {
        return false;
      });
  } else {

    //    update existing note
    body.id = editId.value;
    body.timeCreated = timeCreated.value;
    sendRequestToServer('/api/notes', body, 'PATCH')
      .then(response => {
        console.log('update', response)
      })
      .catch(error => {
        return false;
      });
    showAlertMessage('Note updated successfully', 'success');
  }

  note.value = '';
  addBtn.disabled = true;
  addBtn.style.background = 'gray';
}

const addNoteInput = evt => {
  if (
    content.value !== '' &&
    content.value.length > 20 &&
    topic.value !== 'select'
  ) {
    addBtn.disabled = false;
    addBtn.style.background = '#0eadf4';
    addBtn.style.cursor = 'pointer';
  } else {
    evt.preventDefault();
    addBtn.disabled = true;
    addBtn.style.background = 'gray';
    addBtn.style.cursor = '';
  }
};


const fetchAllNotes = async () => {
  const response = await fetch('/api/home');
  if (response.ok) {
    const data = response.json();
    return data;
  } else {
    // console.log('HTTP-ERROR: ', response.status);
    return false;
  }
};

//const fetchData = async url => {
//  const response = await fetch(url);
//  const data = await response.json();
//  return data;
//};

const sendRequestToServer = async (url, body, reqMethod) => {
  const response = await fetch(url, {
    method: reqMethod,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (response.ok) {
    const data = response.json();
    console.log(data)
    return data;
  } else {
     console.log('HTTP-ERROR: ', +response.status);
  }
};

const displayNoteToEdit = data => {
  let topicUI = document.getElementById('topic');
  const {
    note,
    id,
    topic,
    timeCreated
  } = data;

  content.value = note;
  topicUI.value = topic;
  editId.value = id;
  document.getElementById('time-created').value = timeCreated;
};

function changeState(state) {
  if (state === 'edit') {
    addBtn.style.background = 'orange';
    addBtn.style.color = '#fff';
    addBtn.textContent = 'Update';
    cancelBtn.setAttribute('type', 'button');
    cancelBtn.style.cursor = 'pointer';
    addBtn.style.cursor = 'pointer';
    addBtn.disabled = false;
  } else if (state === 'add') {
    document.getElementById('add-button').textContent = 'Add';
    cancelBtn.setAttribute('type', 'hidden');
    document.getElementById('add-button').style.background = 'gray';
  }
}


function cancelUpdate(evt) {
  if (evt.target.classList.contains('cancel')) {
    addBtn.classList.remove('update');
    addBtn.classList.add('add');
    changeState('add');
    clearFields();
  }
}

function clearFields() {
  content.value = '';
  topic.value = 'select';
  editId.value = '';
  timeCreated.value = '';
}

//EDIT AND UPDATE
// @desc        Update note
// @route       Patch /api/notes
const editAndUpdate = evt => {
  if (addBtn.classList.contains('add')) {
    addBtn.classList.add('update');
    addBtn.classList.remove('add');
  }
  evt.preventDefault();
  if (evt.target.classList.contains('edit')) {
    content.focus();
    changeState('edit');
    const id = evt.target.getAttribute('data-id');
    fetchAllNotes()
      .then(data => {
        let note = data.find(i => i.id === id);
        displayNoteToEdit(note);
      })
      .catch(error => console.log(error));
  }
}

//DELETE NOTE
// @desc        Deleting note
// @route       DELETE /api/notes
const deleteNote = evt => {
  evt.preventDefault()
  if (evt.target.classList.contains('remove')) {
    evt.target.parentElement.parentElement.remove();
    let body = {
      id: evt.target.dataset.id,
      topic: evt.target.previousElementSibling.value
    };

    sendRequestToServer(`/api/notes`, body, 'POST').then(response => {
      console.log('response on line 191: ', response)
    }).catch(error => {
      console.log('error on line 191: ', error)
    })

  }
}



const htmlTemplate = notes => {
  let htmlTemplate = '';
  notes.forEach(function (note) {
    htmlTemplate += `
			<div class="card" id="note-item">
				<div class="card-body">
					<h4>${note.topic}</h4>
					<p class="card-text">${note.note.substring(0, 80)}...</p>
				</div>
                <div class="card-footer">
				    <input type="hidden" value="${note.topic}" class="" id="topic-value">
				    <a href="#" class="remove" data-id="${note.id}" id="remove">Remove</a>
				    <a href="#form-container" id="edit" class="edit" data-id="${note.id}">Edit</a>
				</div>
            </div>
        `;
  });
  document.getElementById('output').innerHTML = htmlTemplate;
};

function displayNotes(data) {
  if (data) {
    console.log('line 262', data);
  } else {
    spinner.removeAttribute('hidden');
    fetchAllNotes()
      .then(data => {
        data = data.sort((b, a) => a.timeCreated - b.timeCreated);
        const notes = data;
        htmlTemplate(notes);
        spinner.setAttribute('hidden', '');
      })
      .catch(error => {
        return [];
      });
  }
}
eventListener()
