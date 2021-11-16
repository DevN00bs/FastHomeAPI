import multer from "multer";
import GCS from "multer-cloud-storage";

const upload = multer({
  storage: new GCS({
    uniformBucketLevelAccess: false,
    acl: "publicRead",
  }),
});

export default upload;
