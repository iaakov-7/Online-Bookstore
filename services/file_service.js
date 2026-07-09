import fs from "fs/promises";

export async function readJson(filePath) {
  const fileContent = await fs.readFile(filePath, "utf-8");
  if (!fileContent.trim()) {
    return [];
  }
  return JSON.parse(fileContent);
}

export async function writeJson(filePath, content) {
  const stringContent = JSON.stringify(content, null, 2);
  await fs.writeFile(filePath, stringContent);
}
