import ElementsDAO from "../dao/elementsdao.js";
import PostsDAO from "../dao/postsdao.js";

export default class ElementsController {
  // Add new element
  static async apiPostElement(req, res) {
    try {
      const date = new Date();
      const post_id = req.body.post_id;
      const post = await PostsDAO.getPostByID(post_id);
      delete req.body.post_id;
      req.body.element_index = post.elements.length;
      const element = {
        created_at: Date.now(),
        updated_at: Date.now(),
        body: "Add content ...",
        element_index: req.body.element_index
      };

      const ElementResponse = await ElementsDAO.addElement(
        element,
        post_id
      ).then((response) => {
        ElementsDAO.elementIndexRealignment(post_id);
      });
      res.status(200).json({
        status: "Element Added Successfully",
        data: ElementResponse,
        element: element,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // Edit existing element
  static async apiUpdateElement(req, res) {
    let element = {
      body: req.body.body,
      element_idx: req.body.element_index,
    };
    let post_id = req.body.post_id;
    try {
      req.body.updated_at = Date.now();
      const updateElementResponse = await ElementsDAO.updateElement(
        post_id,
        element
      );

      var { error } = updateElementResponse;
      if (error) {
        res.status(400).json({ error });
      }

      if (updateElementResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update Element - element index might not exist"
        );
      }

      res.status(200).json({
        status: "Element Updated Successfully",
        data: updateElementResponse,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteElement(req, res) {
    try {
      const deleteResponse = await ElementsDAO.deleteElement(
        req.body.post_id,
        req.body.element_index
      );
      const postElements = await ElementsDAO.elementIndexRealignment(
        req.body.post_id
      );

      res.status(200).json({
        status: "Element Deleted Successfully",
        data: deleteResponse,
        elements: postElements,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
