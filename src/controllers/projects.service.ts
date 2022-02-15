import fs from 'fs';
import fsPromise from 'fs/promises';
import path from 'path';

const pathTmp = path.resolve(process.cwd(), 'public/images/tmp');
const pathImage = path.resolve(process.cwd(), 'public/images/');

class ProjectService {
  async deleteTempFiles() {
    const listOfFiles = await fsPromise.readdir(pathTmp);

    // Hapus semua
    for (const fileName of listOfFiles) {
      const pathFile = path.resolve(pathTmp, fileName);
      await fsPromise.unlink(pathFile);
    }
  }

  async moveImages<T extends { src: string }[]>(images: T): Promise<void> {
    // Pindahkan gambar dari tmp ke luar
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

  async deleteImages<T extends { src: string }[]>(images: T): Promise<void> {
    for (const image of images) {
      const imageUrl = `${pathImage}/${image.src}`;
      if (fs.existsSync(imageUrl)) await fsPromise.unlink(imageUrl);
    }
  }
}

export default new ProjectService();
