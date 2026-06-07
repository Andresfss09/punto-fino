const Service = require('../models/Service');
const { sendSuccess, sendError } = require('../utils/helpers');

exports.getAllServices = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const services = await Service.find(query).sort({ order: 1, category: 1 });
    return sendSuccess(res, 200, 'Servicios obtenidos.', { services });
  } catch (error) {
    return sendError(res, 500, 'Error al obtener servicios.');
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return sendError(res, 404, 'Servicio no encontrado.');
    return sendSuccess(res, 200, 'Servicio obtenido.', { service });
  } catch (error) {
    return sendError(res, 500, 'Error al obtener servicio.');
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    return sendSuccess(res, 201, 'Servicio creado.', { service });
  } catch (error) {
    if (error.code === 11000) return sendError(res, 400, 'Ya existe un servicio con ese nombre.');
    return sendError(res, 500, 'Error al crear servicio.');
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return sendError(res, 404, 'Servicio no encontrado.');
    return sendSuccess(res, 200, 'Servicio actualizado.', { service });
  } catch (error) {
    return sendError(res, 500, 'Error al actualizar servicio.');
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!service) return sendError(res, 404, 'Servicio no encontrado.');
    return sendSuccess(res, 200, 'Servicio desactivado.');
  } catch (error) {
    return sendError(res, 500, 'Error al eliminar servicio.');
  }
};