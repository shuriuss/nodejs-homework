const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json({
    data: contacts,
  });
});

router.get("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const el = await getContactById(contactId);
  if (!el) {
    res.status(404).json({ message: "Not found" });
  } else {
    res.status(200).json({
      data: el,
    });
  }
});

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.string().min(12).max(20).required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    res.status(400).json(validation.error.details);
  } else {
    const { name, email, phone } = req.body;
    const contact = {
      id: uuidv4(),
      name,
      email,
      phone,
    };
    addContact(contact);
    res.status(201).json({
      data: { contact },
    });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const status = await removeContact(contactId);
  if (status) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const body = req.body;
  const { name, email, phone } = body;

  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.string().min(12).max(20).required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    res.status(400).json({ message: "missing fields" });
  } else {
    const status = await updateContact(contactId, body);
    if (!status) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(200).json({
        data: {
          id: contactId,
          name,
          email,
          phone,
        },
      });
    }
  }
});

module.exports = router;
