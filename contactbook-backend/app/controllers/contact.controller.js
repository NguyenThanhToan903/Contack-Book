const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.create(req.body);
    return res.send(document);
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while creating the contact")
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await contactService.findByName(name);
    } else {
      documents = await contactService.find({});
    }
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while retrieving the contact")
    );
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.findById(req.params.id);
    if (!documents) return next(new ApiError(404, "Contact not found"));
    return res.send(documents);
  } catch (err) {
    return next(
      new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.update(req.params.id, req.body);
    if (!documents) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, `Error updating contact with id${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.delete(req.params.id);
    if (!documents) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({ message: "Contact was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete contact with id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCound = await contactService.deleteAll();
    return res.send({
      message: `${deletedCound} contacts were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all contacts")
    );
  }
};

exports.findAllFavorite = async (_req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.findFavorite();
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite contact")
    );
  }
};
