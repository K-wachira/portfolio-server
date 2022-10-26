import { Schema, model } from "mongoose";
const postModel = new Schema(
  {
    title: {
      type: String,
      reqired: true,
    }, // String is shorthand for {type: String}
    description: {
      type: String,
      reqired: true,
    },
    cover_image: {
      type: String,
    },
    tags: [String],
    category: {
      type: String,
      reqired: true,
    },
    published_at: Date,
    published: {
      type: Boolean,
      default: false,
    },
    elements: [
      {
        element_index: Number,
        element_type: { type: String, reqired: true, default: "Body" },
        body: String,
        created_at: {
          type: Date,
          default: () => Date.now(),
          immutable: true,
        },
        updated_at: {
          type: Date,
          default: () => Date.now(),
        },
        hidden: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default model("Post", postModel);
