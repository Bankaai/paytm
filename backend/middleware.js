const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message: "Authorization header is missing or invalid."
        });
    }

    // Extract the token from the authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using JWT_SECRET
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if the token contains the userId
        if (decoded && decoded.userId) {
            // Attach the userId to the request object for later use
            req.userId = decoded.userId;
            next(); // Proceed to the next middleware or route handler
        } else {
            return res.status(403).json({
                message: "Token is invalid or userId is missing."
            });
        }
    } catch (err) {
        // Handle token verification errors (e.g., expired token)
        return res.status(403).json({
            message: "Token validation issue.",
            error: err.message // You can send the error message for debugging
        });
    }
};

module.exports = {authMiddleware}


