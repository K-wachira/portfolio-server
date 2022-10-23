import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;
import PostsDAO from "./postsdao.js";
import postModel from "../models/postModel.js";


export default class ElementsDAO {
  static async updateUpdatedTime(post_id) {
    try {
      const updateResponse = await postModel.findOneAndUpdate(
        { _id: ObjectId(post_id) },
        {
          $set: {
            updated_at: Date.now(),
          },
        }
      );
    } catch (e) {
      return { error: e };
    }
  }

  static async addElement(element, post_id) {
    try {
      this.updateUpdatedTime(post_id);
      return await postModel.findOneAndUpdate(
        { _id: ObjectId(post_id) },
        { $push: { elements: element } }
      );
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }

  static async updateElement(post_id, element) {
    try {
      const updateResponse = await postModel.findOneAndUpdate(
        { _id: ObjectId(post_id) },
        {
          $set: {
            "elements.$[elem].body": element.body,
            "elements.$[elem].updated_at": element.updated_at,
            updated_at: Date.now(),
          },
        },
        {
          arrayFilters: [
            {
              "elem.element_index": element.element_idx,
            },
          ],
        }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      return { error: e };
    }
  }

  static async deleteElement(post_id, element_idx) {
    try {
      this.updateUpdatedTime(post_id);
      const deleteResponse = await postModel.findOneAndUpdate(
        {
          _id: ObjectId(post_id),
        },
        {
          $pull: {
            elements: { element_index: element_idx },
          },
        }
      );

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
      return { error: e };
    }
  }

  static async elementIndexRealignment(post_id) {
    try {
      const postElements = await PostsDAO.getPostElements(post_id);
      const elements = postElements.elements;
      for (let index = 0; index < elements.length; index++) {
        elements[index].element_index = index;
      }
      const updatedElements = await PostsDAO.updateElementIndex(
        post_id,
        elements
      );
      return updatedElements;
    } catch (e) {
      console.error(`Unable to realign element indexes: ${e}`);
      return { error: e };
    }
  }
}
