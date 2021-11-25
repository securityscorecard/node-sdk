import fs from 'fs';
import path from 'path';

const getAbsoluteFilePath = (jsonFilePath: string) =>
  path.isAbsolute(jsonFilePath) ? jsonFilePath : path.join(process.cwd(), jsonFilePath);

// eslint-disable-next-line import/prefer-default-export
export const load = (jsonFilePath: string) => {
  const absolutePath = getAbsoluteFilePath(jsonFilePath);
  const fileContent = fs.readFileSync(absolutePath);
  return JSON.parse(fileContent.toString());
};
