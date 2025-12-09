const router = require("express").Router();
const authController = require("../controllers/authController");


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user and a default blog entry using MongoDB transaction.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: Akhil
 *               email:
 *                 type: string
 *                 example: akhil@example.com
 *               password:
 *                 type: string
 *                 example: mySecurePassword123
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Bad request or validation error
 *       500:
 *         description: Internal server error
 */
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;