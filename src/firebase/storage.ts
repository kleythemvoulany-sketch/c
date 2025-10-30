'use client';

import { ref, uploadBytesResumable, getDownloadURL, Storage } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads multiple images to Firebase Storage and reports aggregated progress.
 * @param storage - The Firebase Storage instance.
 * @param files - An array of File objects to upload.
 * @param onProgress - A callback function to track the overall upload progress (0-100).
 * @returns A promise that resolves with an array of image download URLs.
 */
export async function uploadImages(
  storage: Storage,
  files: File[],
  onProgress: (progress: number) => void
): Promise<string[]> {
  let progressByFile: { [key: string]: number } = {};

  const calculateOverallProgress = () => {
    const totalFiles = files.length;
    if (totalFiles === 0) return 0;
    const totalProgress = Object.values(progressByFile).reduce((acc, curr) => acc + curr, 0);
    return totalProgress / totalFiles;
  };

  const uploadPromises = files.map(file => {
    return new Promise<string>((resolve, reject) => {
      const fileId = uuidv4();
      progressByFile[fileId] = 0;
      
      const fileExtension = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExtension}`;
      const storageRef = ref(storage, `listings/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const singleFileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressByFile[fileId] = singleFileProgress;
          onProgress(calculateOverallProgress());
        },
        (error) => {
          console.error(`Upload failed for file ${file.name}:`, error);
          delete progressByFile[fileId]; // Remove from progress calculation
          onProgress(calculateOverallProgress());
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            progressByFile[fileId] = 100; // Ensure it's marked as complete
            onProgress(calculateOverallProgress());
            resolve(downloadURL);
          } catch (error) {
            console.error(`Failed to get download URL for ${file.name}:`, error);
            reject(error);
          }
        }
      );
    });
  });

  const urls = await Promise.all(uploadPromises);
  return urls;
}
