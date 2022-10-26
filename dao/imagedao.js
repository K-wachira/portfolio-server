import dotenv from "dotenv";
dotenv.config();
import util from "util";
import fs from "fs"
import S3 from "aws-sdk/clients/s3.js";

// require("dotenv").config();
// const util = require("util")
// const fs = require("fs")
// const S3 = require("aws-sdk/clients/s3" )


const unlinkFile = util.promisify(fs.unlink);
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads a file to s3
export default class ImageDao {
  static async uploadFile(file) {
    try {
      const fileStream = fs.createReadStream(file.path);
      const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename+Date.now(),
      };
      try{
        const s3_upload = await s3.upload(uploadParams).promise();
        return s3_upload;
      }catch(e){
        console.log("Fail when uploading to s3", e.message)
        return e
      }
    } catch (error) {
      console.log(error.message);
      return { error: error.message };
    }
  }

  // downloads a file from s3
  static getFileStream(fileKey) {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName,
    };
    return s3.getObject(downloadParams).createReadStream();
  }

  // Returns AWS Image key
  static async uploadImage(req) {
    const result = await this.uploadFile(req.file);
    await unlinkFile(req.file.path);
    return result
  }
}
