import fsPromise from 'fs/promises';
import fs from 'fs';
import path from 'path';

const pathTmp = path.resolve(process.cwd(), 'public/images/tmp');

export async function deleteTempFiles() {
  const listOfFiles = await fsPromise.readdir(pathTmp);

  // Hapus semua
  for (const fileName of listOfFiles) {
    const pathFile = path.resolve(pathTmp, fileName);
    await fsPromise.unlink(pathFile);
  }
}

export async function moveImages(images: { src: string }[]) {
  // Pindahkan gambar dari tmp ke luar
  const pathImage = path.resolve(process.cwd(), 'public/images/');

  for (const image of images) {
    if (fs.existsSync(`${pathTmp}/${image.src}`)) {
      // Check If found
      await fsPromise.rename(
        `${pathTmp}/${image.src}`,
        `${pathImage}/${image.src}`,
      );
    }
  }
}
