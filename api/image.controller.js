import ImageDAO from "../dao/imagedao.js";
import PostsDAO from "../dao/postsdao.js";
import ElementsController from "./elements.controller.js";

export default class ImageController {
  static async apiUploadCover(req, res) {
    try {
      const image_upload = await ImageDAO.uploadImage(req);
      const cover_image_update = await PostsDAO.uploadCover({
        post_id: req.body.post_id,
        image_key: image_upload.Location,
      });
      res.status(200).json(cover_image_update);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
  static async apiUploadElement(req, res) {
    console.log( req.body)
    try {
      const image_upload = await ImageDAO.uploadImage(req);
      const cover_image_update = await ElementsController.apiPostElement({
        "body": {
          post_id: req.body.post_id,
          body: image_upload.Location,
          element_type: req.body.element_type,
          element_index: req.body.element_index,
        }
      });
      res.status(200).json(cover_image_update);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
}
