const path = require("path");
const fs = require("fs").promises;

const contactsPath = path.join(process.cwd(), "src","models", "contacts.json");
async function contacts() {
  const response = await fs.readFile(contactsPath, "utf-8")
  const result = JSON.parse(response);
  return result;
}

const listContacts = async () => {
  try {
    const response = await contacts();
    return response;
  } catch (error) {
    console.error(error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const arr = await contacts();
    const contact = arr.find((el) => el.id === contactId);
    if (contact) {
      return contact;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contact = await contacts();
    const newContact = contact.filter((el) => el.id !== contactId);
    if (newContact.length === contact.length) {
      return false;
    } else {
      await fs.writeFile(contactsPath, JSON.stringify(newContact));
      return true;
    }
  } catch (error) {
    console.error(error.message);
  }
};

const addContact = async (body) => {
  const { id, name, email, phone } = body;
  try {
    const arr = await contacts();
    arr.push({
      id,
      name,
      email,
      phone,
    });
    fs.writeFile(contactsPath, JSON.stringify(arr));
  } catch (error) {
    console.error(error.message);
  }
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  try {
    const arr = await contacts();
    const index = arr.findIndex((el) => el.id === contactId);

    if (index < 0) {
      return false;
    } else {
      arr.splice(index, 1);
      const contact = {
        id: contactId,
        name,
        email,
        phone,
      };
      arr.push(contact);
      fs.writeFile(contactsPath, JSON.stringify(arr));
      return true;
    }
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  contacts,
};
