let contacts = [];

const contactTable = document.querySelector('#contact-table');
const contactForm = document.querySelector('#contact-form');
const addButton = document.querySelector('#contact-form button[type="submit"]');

// function to format phoneNumber ###-###-####
function formatPhoneNumber(phoneNumber) {
	return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}
function saveContacts() {
	// Save data to local storage
	localStorage.setItem('contacts', JSON.stringify(contacts));
}

function loadContacts() {
	// Load data from local storage, if available
	if (localStorage.getItem('contacts')) {
		contacts = JSON.parse(localStorage.getItem('contacts'));
	}
	displayContacts();
	document.querySelector('#total-contacts').textContent = contacts.length; //Display the number of total contacts
}

function displayContacts() {
	let tableBody = contactTable.querySelector('tbody');
	tableBody.innerHTML = '';

	for (let i = 0; i < contacts.length; i++) {
		let row = document.createElement('tr');
		row.innerHTML = `
      <td>${contacts[i].firstName}</td>
      <td>${contacts[i].lastName}</td>
      <td>${contacts[i].address}</td>
      <td>${contacts[i].phone}</td>
      <td>
        <button class="edit-btn" data-id="${i}">Edit</button>
        <button class="delete-btn" data-id="${i}">Delete</button>
      </td>
    `;
		tableBody.appendChild(row);
	}

	saveContacts();
	document.querySelector('#total-contacts').textContent = contacts.length; // Display the number of total contacts
}

function addContact(firstName, lastName, address, phone) {
	let contact = {
		firstName: firstName,
		lastName: lastName,
		address: address,
		phone: formatPhoneNumber(phone),
	};

	contacts.push(contact);
	saveContacts();
	sortContactsByLastNameAsc();
}

function editContact(id, firstName, lastName, address, phone) {
	contacts[id].firstName = firstName;
	contacts[id].lastName = lastName;
	contacts[id].address = address;
	contacts[id].phone = formatPhoneNumber(phone);
	saveContacts();
}

function sortContactsByLastNameAsc() {
	contacts.sort((a, b) => a.lastName.localeCompare(b.lastName));
	displayContacts();
}

function sortContactsByLastNameDesc() {
	contacts.sort((a, b) => b.lastName.localeCompare(a.lastName));
	displayContacts();
}

loadContacts();
displayContacts();
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search');

searchForm.addEventListener('submit', function (event) {
	event.preventDefault();
	const searchText = searchInput.value.toLowerCase();

	Array.from(contactTable.querySelectorAll('tbody tr')).forEach(function (row) {
		const firstName = row
			.querySelector('td:first-child')
			.textContent.toLowerCase();
		const lastName = row
			.querySelector('td:nth-child(2)')
			.textContent.toLowerCase();
		const fullName = `${firstName} ${lastName}`;

		if (fullName.indexOf(searchText) !== -1) {
			row.style.display = '';
		} else {
			row.style.display = 'none';
		}
	});
});

document
	.querySelector('#sort-asc')
	.addEventListener('click', sortContactsByLastNameAsc);
document
	.querySelector('#sort-desc')
	.addEventListener('click', sortContactsByLastNameDesc);

contactTable.addEventListener('click', (event) => {
	if (event.target.classList.contains('edit-btn')) {
		let id = event.target.getAttribute('data-id');
		let contact = contacts[id];
		let firstNameInput = document.querySelector('#first-name');
		let lastNameInput = document.querySelector('#last-name');
		let addressInput = document.querySelector('#address');
		let phoneInput = document.querySelector('#phone');

		firstNameInput.value = contact.firstName;
		lastNameInput.value = contact.lastName;
		addressInput.value = contact.address;
		phoneInput.value = contact.phone;

		addButton.innerText = 'Save Changes';
		addButton.setAttribute('data-id', id);
	} else if (event.target.classList.contains('delete-btn')) {
		if (confirm('Are you sure you want to delete this contact?')) {
			let id = event.target.getAttribute('data-id');
			contacts.splice(id, 1);
			displayContacts();
		}
	}
});

contactForm.addEventListener('submit', (event) => {
	event.preventDefault();
	let firstNameInput = document.querySelector('#first-name');
	let lastNameInput = document.querySelector('#last-name');
	let addressInput = document.querySelector('#address');
	let phoneInput = document.querySelector('#phone');
	let addButton = document.querySelector('#contact-form button[type="submit"]');
	if (addButton.innerText === 'Add Contact') {
		addContact(
			firstNameInput.value,
			lastNameInput.value,
			addressInput.value,
			phoneInput.value
		);
	} else {
		let id = addButton.getAttribute('data-id');
		editContact(
			id,
			firstNameInput.value,
			lastNameInput.value,
			addressInput.value,
			phoneInput.value
		);
		addButton.innerText = 'Add Contact';
		addButton.removeAttribute('data-id');
		addButton.setAttribute('id', 'add-contact-btn');
	}
	firstNameInput.value = '';
	lastNameInput.value = '';
	addressInput.value = '';
	phoneInput.value = '';
	displayContacts();
	document.querySelector('#add-contact-btn').removeAttribute('id');
});

// Load contacts from local storage on page load
document.addEventListener('DOMContentLoaded', displayContacts);
