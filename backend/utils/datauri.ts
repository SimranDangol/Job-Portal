import DataUriParser from "datauri/parser";
import path from "path";

interface File {
  originalname: string;
  buffer: Buffer;
}

const getDataUri = (file: File) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname);
  return parser.format(extName, file.buffer);
};

export default getDataUri;
