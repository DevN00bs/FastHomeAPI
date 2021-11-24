import multer from "multer";
import GCS from "multer-cloud-storage";
import crypto from "crypto";

const upload = multer({
  storage: new GCS({
    uniformBucketLevelAccess: false,
    acl: "publicRead",
    filename: (_req: Express.Request, file: Express.Multer.File, cb: any) => {
      const parsedFile = file.originalname.split(".");
      cb(null, `${crypto.randomUUID()}.${parsedFile[parsedFile.length - 1]}`);
    },
  }),
});

export default upload;
