// src/middlewares/validate.js
export const validate = (schema, property) => (req, res, next) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
        return res.status(400).json({
            errors: result.error.flatten().fieldErrors
        });
    }

    // overwrite with parsed (coerced / cleaned) data
    req[property] = result.data;

    next();
};