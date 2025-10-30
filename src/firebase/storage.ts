'use client';

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  Storage,
} from 'firebase/storage';
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
  if (!files || files.length === 0) {
    onProgress(100);
    return [];
  }
  
  const uploadPromises: Promise<string>[] = [];
  const progressByFile: { [key: string]: number } = {};
  const totalFiles = files.length;

  const updateOverallProgress = () => {
    const totalProgress = Object.values(progressByFile).reduce((acc, curr) => acc + curr, 0);
    const overallPercentage = totalProgress / totalFiles;
    onProgress(overallPercentage);
  };
  
  files.forEach(file => {
    const fileId = uuidv4();
    progressByFile[fileId] = 0; // Initialize progress for this file
    
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const storageRef = ref(storage, `listings/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    const promise = new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const singleFileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressByFile[fileId] = singleFileProgress;
          updateOverallProgress();
        },
        (error) => {
          console.error(`Upload failed for file ${file.name}:`, error);
          // In case of error, we can decide how to handle progress.
          // For simplicity, we'll just stop tracking this file.
          // A more robust solution might require aborting all uploads.
          delete progressByFile[fileId];
          updateOverallProgress();
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            progressByFile[fileId] = 100;
            updateOverallProgress();
            resolve(downloadURL);
          } catch (error) {
            console.error(`Failed to get download URL for ${file.name}:`, error);
            reject(error);
          }
        }
      );
    });
    uploadPromises.push(promise);
  });

  // Initially set progress to 0
  updateOverallProgress();

  const urls = await Promise.all(uploadPromises);
  onProgress(100); // Ensure it completes at 100%
  return urls;
}
