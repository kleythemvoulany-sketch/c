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

  const calculateAndReportProgress = () => {
    const totalProgress = Object.values(progressByFile).reduce(
      (acc, curr) => acc + curr,
      0
    );
    const overallPercentage = totalProgress / totalFiles;
    onProgress(overallPercentage);
  };

  onProgress(0); // Report 0% progress at the very beginning

  files.forEach(file => {
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const fileName = `listings/${fileId}.${fileExtension}`;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    const promise = new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const singleFileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressByFile[file.name] = singleFileProgress;
          calculateAndReportProgress();
        },
        (error) => {
          console.error(`Upload failed for file ${file.name}:`, error);
          // In case of error, we can decide how to handle progress.
          // For simplicity, we'll mark its progress as 0 and let others continue.
          progressByFile[file.name] = 0;
          calculateAndReportProgress();
          reject(error); // Reject the promise for this file
        },
        async () => {
          try {
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
    const urls = await Promise.all(uploadPromises);
    onProgress(100); // Ensure it completes at 100%
    return urls;
  } catch (error) {
    console.error('One or more image uploads failed.', error);
    // Even if some fail, we can return the URLs of the ones that succeeded, or re-throw.
    // For now, re-throwing seems appropriate to signal a failure in the form.
    throw new Error('Image upload failed.');
  }
}
