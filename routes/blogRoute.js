const router = require("express").Router();
const blogController = require("../controllers/blogController");

router.post("/create", blogController.createBlog);
router.post("/list", blogController.listBlogs);
router.post("/individual", blogController.individualBlog);
router.post("/edit", blogController.editBlogs);
router.post("/delete", blogController.deleteBlogs);

module.exports = router;