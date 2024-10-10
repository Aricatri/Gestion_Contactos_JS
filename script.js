//referencias a los elementos del DOM
const contactInput = document.getElementById("contactInput"); // Campo de entrada para el nombre del contacto
const addContactButton = document.getElementById("addContactButton"); // Botón para agregar contacto
const contactCount = document.getElementById("contactCount"); // Elemento para mostrar el total de contactos
const contactList = document.getElementById("contactList"); // Lista de contactos
const sortContactsButton = document.getElementById("sortContactsButton"); // Botón para ordenar contactos

addContactButton.addEventListener("click", updateContactList);
sortContactsButton.addEventListener("click", sortContacts);
document.addEventListener("DOMContentLoaded", loadContacts);

function createContactElement(name) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = name;

  // Crear botón de editar
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => editName(span));

  // Crear botón de eliminar
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    li.remove();
    saveContacts();
    updateContactCount();
  });


  function editName(spanElement) {
    const newName = prompt("Edit the name:", spanElement.textContent);
    if (newName !== null && newName.trim() !== "") {
      spanElement.textContent = newName.trim(); // Actualizar el nombre en el span
      saveContacts();
    }
  }

  // Agregar el span y los botones al elemento de lista
  li.appendChild(span);
  li.appendChild(editButton);
  li.appendChild(deleteButton);
  return li;
}

// Función para actualizar la lista de contactos
function updateContactList() {
  const newContact = contactInput.value.trim(); // Obtener el nombre del nuevo contacto

  // Verificar si el contacto ya existe en la lista
  const exists = Array.from(contactList.children).some((item) => {
    return item.querySelector("span").textContent.toLowerCase() === newContact.toLowerCase(); // Comparar nombres sin distinción de mayúsculas
  });

  // Si el contacto es nuevo y no está vacío
  if (newContact && !exists) {
    const newElement = createContactElement(newContact); // Crear el nuevo elemento de contacto
    contactList.appendChild(newElement); // Agregar el nuevo elemento a la lista
    contactInput.value = ""; // Limpiar el campo de entrada
    saveContacts(); // Guardar la lista actualizada en localStorage
    updateContactCount(); // Actualizar el contador
  } else if (exists) { // Si el contacto ya existe
    alert("This contact already exists in the list."); // Mostrar alerta al usuario
  }
}

// Función para actualizar el contador de contactos
function updateContactCount() {
  const totalContacts = contactList.children.length; // Contar la cantidad de elementos en la lista
  contactCount.textContent = `Total Contacts: ${totalContacts}`; // Actualizar el texto del contador
}

// Función para ordenar los contactos alfabéticamente
function sortContacts() {
  const items = Array.from(contactList.children); // Convertir los elementos de la lista a un array
  items.sort((a, b) => {
    const nameA = a.querySelector("span").textContent.toLowerCase(); // Obtener el nombre del contacto A
    const nameB = b.querySelector("span").textContent.toLowerCase(); // Obtener el nombre del contacto B
    return nameA.localeCompare(nameB); // Comparar los nombres
  });

  // Re-agregar los elementos ordenados a la lista
  items.forEach(item => contactList.appendChild(item));
  saveContacts(); // Guardar la lista ordenada en localStorage
}

// Función para guardar los contactos en el localStorage
function saveContacts() {
  const contacts = Array.from(contactList.children).map(item =>
    item.querySelector("span").textContent // Obtener los nombres de los contactos
  );
  localStorage.setItem("contacts", JSON.stringify(contacts)); // Guardar en localStorage como JSON
}

// Función para cargar los contactos desde el localStorage
function loadContacts() {
  const savedContacts = JSON.parse(localStorage.getItem("contacts")) || []; // Obtener los contactos guardados o un array vacío
  savedContacts.forEach(name => {
    const element = createContactElement(name); // Crear el elemento para cada contacto
    contactList.appendChild(element); // Agregar el elemento a la lista
  });
  updateContactCount(); // Actualizar el contador de contactos
}
