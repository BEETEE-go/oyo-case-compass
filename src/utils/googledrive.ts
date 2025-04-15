
import { gapi } from 'gapi-script';

// Google Drive API configuration
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// Store authentication state
let isInitialized = false;
let isAuthenticated = false;

/**
 * Initialize the Google Drive API client
 */
export const initGoogleDriveApi = async (): Promise<boolean> => {
  if (isInitialized) return true;
  
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', () => {
      // Use environment variables for these values
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      
      if (!apiKey || !clientId) {
        console.error('Google API Key or Client ID is missing. Please check your environment variables.');
        reject(new Error('Google API configuration is missing'));
        return;
      }
      
      gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(() => {
        isInitialized = true;
        isAuthenticated = gapi.auth2.getAuthInstance().isSignedIn.get();
        resolve(true);
      }).catch(error => {
        console.error('Error initializing Google API', error);
        reject(error);
      });
    });
  });
};

/**
 * Check if user is authenticated with Google Drive
 */
export const isAuthenticatedWithGoogleDrive = (): boolean => {
  return isAuthenticated;
};

/**
 * Authenticate with Google Drive
 */
export const authenticateGoogleDrive = async (): Promise<boolean> => {
  try {
    if (!isInitialized) {
      await initGoogleDriveApi();
    }
    
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      await gapi.auth2.getAuthInstance().signIn();
    }
    
    isAuthenticated = gapi.auth2.getAuthInstance().isSignedIn.get();
    return isAuthenticated;
  } catch (error) {
    console.error('Google Drive authentication failed', error);
    isAuthenticated = false;
    throw error;
  }
};

/**
 * Sign out from Google Drive
 */
export const signOutGoogleDrive = async (): Promise<void> => {
  if (isInitialized && gapi.auth2) {
    await gapi.auth2.getAuthInstance().signOut();
    isAuthenticated = false;
  }
};

/**
 * Upload a file to Google Drive
 */
export const uploadToGoogleDrive = async (file: File, folderId?: string): Promise<any> => {
  try {
    if (!isAuthenticated) {
      await authenticateGoogleDrive();
    }
    
    const metadata = {
      name: file.name,
      mimeType: file.type,
      parents: folderId ? [folderId] : []
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    
    const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: form
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Google Drive upload failed', error);
    throw error;
  }
};

/**
 * List files from Google Drive
 */
export const listGoogleDriveFiles = async (folderId?: string): Promise<any[]> => {
  try {
    if (!isAuthenticated) {
      await authenticateGoogleDrive();
    }
    
    let query = '';
    if (folderId) {
      query = `'${folderId}' in parents`;
    }
    
    const response = await gapi.client.drive.files.list({
      q: query,
      fields: 'files(id, name, mimeType, webViewLink, iconLink, thumbnailLink, description, modifiedTime, createdTime)',
      orderBy: 'modifiedTime desc'
    });
    
    return response.result.files || [];
  } catch (error) {
    console.error('Failed to list Google Drive files', error);
    throw error;
  }
};

/**
 * Create a folder in Google Drive
 */
export const createGoogleDriveFolder = async (folderName: string, parentFolderId?: string): Promise<any> => {
  try {
    if (!isAuthenticated) {
      await authenticateGoogleDrive();
    }
    
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentFolderId ? [parentFolderId] : []
    };
    
    const response = await gapi.client.drive.files.create({
      resource: folderMetadata,
      fields: 'id, name, webViewLink, createdTime'
    });
    
    return response.result;
  } catch (error) {
    console.error('Failed to create Google Drive folder', error);
    throw error;
  }
};

/**
 * Get a file by ID from Google Drive
 */
export const getGoogleDriveFile = async (fileId: string): Promise<any> => {
  try {
    if (!isAuthenticated) {
      await authenticateGoogleDrive();
    }
    
    const response = await gapi.client.drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, webViewLink, iconLink, thumbnailLink, description, modifiedTime, createdTime'
    });
    
    return response.result;
  } catch (error) {
    console.error('Failed to get Google Drive file', error);
    throw error;
  }
};

/**
 * Download a file from Google Drive
 */
export const downloadGoogleDriveFile = async (fileId: string): Promise<Blob> => {
  try {
    if (!isAuthenticated) {
      await authenticateGoogleDrive();
    }
    
    const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Failed to download Google Drive file', error);
    throw error;
  }
};
