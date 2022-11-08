const { Contact } = require("../db/contactModel");

async function contacts() {
  const contacts = await Contact.find({});
  return contacts;
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
      await Contact.findByIdAndDelete(contactId);
      return true;
    }
  } catch (error) {
    console.error(error.message);
  }
};

const addContact = async (body) => {
  try {
    const contact = new Contact(body);
    await contact.save();
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
      await Contact.findByIdAndUpdate(contactId, {
        $set: { name, email, phone },
      });
      return true;
    }
  } catch (error) {
    console.error(error.message);
  }
};

const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;
  try {
    const arr = await contacts();
    const index = arr.findIndex((el) => el.id === contactId);
    if (index < 0) {
      return false;
    } else {
      await Contact.findByIdAndUpdate(contactId, {
        $set: { favorite },
      });
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
  updateStatusContact,
};
