import { Schema, model } from "mongoose";
const imageModel = new Schema(
  { image: { data: Buffer, contentType: String } },
  { timestamps: true }
);

export default model("Image", imageModel);
