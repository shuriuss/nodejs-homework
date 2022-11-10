const { Contact } = require("../db/contactModel");
const Joi = require("joi");

const listContacts = (req, res) => {
  Contact.find().exec((error, contact) => {
    if (error) {
      res.status(500).send({
        message: error.message,
      });
    } else {
      res.status(200).send(contact);
    }
  });
};

const getContactById = (req, res) => {
  const { contactId } = req.params;
  Contact.findById(contactId).exec((_, contact) => {
    if (!contact) {
      res.status(404).send({ message: "Not found" });
    } else {
      res.status(200).send({ data: contact });
    }
  });
};

const removeContact = (req, res) => {
  const { contactId } = req.params;
  Contact.findByIdAndDelete(contactId).exec((error, contactId) => {
    if (error || !contactId) {
      res.status(404).send({ message: `Not found contact` });
    } else {
      res.status(200).json({ message: "Contact deleted" });
    }
  });
};

const addContact = (req, res) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.string().min(12).max(20).required(),
    favorite: Joi.boolean(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    res.status(400).json(validation.error.details);
  } else {
    const contact = new Contact(req.body);
    contact.save((error, contact) => {
      if (error) {
        res.status(400).send({ message: error.message });
      }
      res.status(201).json({
        data: contact,
      });
    });
  }
};

const updateContact = (req, res) => {
  const { name, email, phone } = req.body;
  const contactId = req.params.contactId;

  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.string().min(12).max(20).required(),
    favorite: Joi.boolean(),
  });
  const validation = schema.validate(req.body);

  if (validation.error) {
    res.status(400).send({ message: "missing fields" });
  } else {
    Contact.findByIdAndUpdate(
      contactId,
      { $set: { name, email, phone } },
      { new: true },
      (error, contact) => {
        if (error) {
          res.status(400).send({ message: "Not found" });
        } else {
          res.status(200).send({
            data: {
              contact,
            },
          });
        }
      }
    );
  }
};

const updateStatusContact = (req, res) => {
  const contactId = req.params.contactId;
  const body = req.body;
  const {favorite} = body

  const schema = Joi.object({
    favorite: Joi.boolean(),
  });
  const validation = schema.validate(body);
  if (validation.error) {
    res.status(400).send(
      { message: "missing field favorite" });
  } else {
    Contact.findByIdAndUpdate(
      contactId,
      {
        $set: { favorite },
      },
      { new: true },
      (error, contact) => {
        if (error) {
          res.status(400).send({ message: "Not found" });
        } else {
          res.status(200).send({
            data: {
              contact,
            },
          });
        }
      }
    );
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
