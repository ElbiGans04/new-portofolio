import fsPromise from "fs/promises";
import path from "path";
const pathTmp = path.resolve(process.cwd(), "public/images/tmp");

export async function deleteTempFiles() {
  const listOfFiles = await fsPromise.readdir(pathTmp);

  // Hapus semua
  for (let fileName of listOfFiles) {
    const pathFile = path.resolve(pathTmp, fileName);
    await fsPromise.unlink(pathFile);
  }
}

export async function moveImages(images) {
  // Pindahkan gambar dari tmp ke luar
  const pathImage = path.resolve(process.cwd(), "public/images/");
  for (let image of images) {
    await fsPromise.rename(
      `${pathTmp}/${image.src}`,
      `${pathImage}/${image.src}`
    );
  }
}
