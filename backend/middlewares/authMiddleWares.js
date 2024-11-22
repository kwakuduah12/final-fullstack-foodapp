const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (allowedRoles = []) => {
    return (req, res, next) => {
        const header = req.headers['authorization'];
        console.log('Header:', header);
        const token = header && header.split(' ')[1]; 

        console.log('Token:', token);


        if (!token) {
            return res.status(403).json({ message: 'Authorization token required' });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(401).json({ message: 'Invalid or expired token' });
            }

            if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Attach user info to request object
            req.user = { id: decoded.id, role: decoded.role };

            console.log('Token set:', decoded);
            next();
        });
    };
};

module.exports = authenticate;