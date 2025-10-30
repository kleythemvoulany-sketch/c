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
  const uploadPromises: Promise<string>[] = [];
  const progressByFile: { [key: string]: number } = {};
  const totalFiles = files.length;

  if (totalFiles === 0) {
    onProgress(100);
    return [];
  }

  // Helper to calculate and report the overall progress
  const calculateAndReportProgress = () => {
    if (totalFiles === 0) {
      onProgress(100);
      return;
    }
    const totalProgress = Object.values(progressByFile).reduce(
      (acc, curr) => acc + curr,
      0
    );
    const overallPercentage = totalProgress / totalFiles;
    onProgress(overallPercentage);
  };

  // Initialize progress for all files to 0
  files.forEach(file => {
    progressByFile[file.name] = 0;
  });
  onProgress(0); // Report 0% at the start

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
          calculateAndReportProgress();
        },
        (error) => {
          console.error(`Upload failed for file ${file.name}:`, error);
          // Mark this file's progress as 0 and report, but don't stop others
          progressByFile[file.name] = 0;
          calculateAndReportProgress();
          reject(error); // Reject the individual promise
        },
        async () => {
          try {
            // On successful upload, get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            progressByFile[file.name] = 100; // Mark as complete
            calculateAndReportProgress();
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
    // Promise.all will reject if any of the uploadPromises reject.
    const urls = await Promise.all(uploadPromises);
    onProgress(100); // Ensure it completes at 100% on full success
    return urls;
  } catch (error) {
    console.error('One or more image uploads failed.', error);
    // Re-throw the error to be caught by the calling function (e.g., in the form).
    throw new Error('Image upload failed.');
  }
}
