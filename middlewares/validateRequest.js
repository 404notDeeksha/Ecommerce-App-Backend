const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    next();
  } catch (error) {
    const issues = error.issues || error.errors || [];
    const formattedErrors = issues.map((err) => ({
      field: (err.path || []).join("."),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
};

module.exports = validateRequest;
