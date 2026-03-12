const validateRequest = (schema) => (req, res, next) => {
  try {
    const result = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    req.validatedData = result;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors,
    });
  }
};

module.exports = validateRequest;
