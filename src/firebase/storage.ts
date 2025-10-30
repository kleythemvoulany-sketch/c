'use client';

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  Storage,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '@/firebase'; // Directly import the initialized storage instance

/**
 * Uploads multiple images to Firebase Storage and reports aggregated progress.
 * @param files - An array of File objects to upload.
 * @param onProgress - A callback function to track the overall upload progress (0-100).
 * @returns A promise that resolves with an array of image download URLs.
 */
export async function uploadImages(
  files: File[],
  onProgress: (progress: number) => void
): Promise<string[]> {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized.');
  }

  const uploadPromises: Promise<string>[] = [];
  const progressByFile: { [key: string]: number } = {};
  const totalFiles = files.length;

  if (totalFiles === 0) {
    onProgress(100);
    return [];
  }

  const updateOverallProgress = () => {
    const totalProgress = Object.values(progressByFile).reduce(
      (acc, curr) => acc + curr,
      0
    );
    const overallPercentage = totalProgress / totalFiles;
    onProgress(overallPercentage);
  };

  // Initialize progress for all files to 0 and report initial progress
  files.forEach(file => {
    progressByFile[file.name] = 0;
  });
  updateOverallProgress(); // Reports 0% at the start

  files.forEach(file => {
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop() || 'tmp';
    const fileName = `listings/${fileId}.${fileExtension}`;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    const promise = new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculate progress for this single file
          const singleFileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressByFile[file.name] = singleFileProgress;
          updateOverallProgress();
        },
        (error) => {
          console.error(`Upload failed for file ${file.name}:`, error);
          // Mark this file's progress as 100 to not block the overall progress, but the promise will still reject.
          // Or better, handle the failure gracefully. For now, we let it fail.
          reject(error);
        },
        async () => {
          try {
            // On successful upload, get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            progressByFile[file.name] = 100; // Mark as complete
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

  try {
    const urls = await Promise.all(uploadPromises);
    onProgress(100);
    return urls;
  } catch (error) {
    console.error('One or more image uploads failed.', error);
    // Re-throw the error to be caught by the calling function (e.g., in the form).
    throw new Error('Image upload failed.');
  }
}
