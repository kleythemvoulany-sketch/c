'use client';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { initializeFirebase } from '.';

// Initialize Firebase and get storage instance
const { firebaseApp } = initializeFirebase();
const storage = getStorage(firebaseApp);

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
  const totalFiles = files.length;
  let filesUploaded = 0;
  let aggregatedProgress = 0;

  const uploadPromises = files.map(file => {
    return new Promise<string>((resolve, reject) => {
      // Create a unique file name using UUID to avoid overwrites
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const storageRef = ref(storage, `listings/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // This snapshot progress is for a single file.
          // We can use it if we want more granular progress, but for simplicity
          // we will update the aggregated progress only on file completion.
        },
        (error) => {
          console.error("Upload failed for a file:", error);
          reject(error); // Reject the promise for this file
        },
        async () => {
          // Handle successful upload for one file
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            filesUploaded++;
            // Calculate overall progress
            aggregatedProgress = (filesUploaded / totalFiles) * 100;
            onProgress(aggregatedProgress); // Report overall progress
            resolve(downloadURL);
          } catch (error) {
            console.error("Failed to get download URL:", error);
            reject(error);
          }
        }
      );
    });
  });

  // Promise.all will wait for all individual upload promises to resolve.
  // If any of the file uploads fail, Promise.all will reject.
  const urls = await Promise.all(uploadPromises);
  return urls;
}
