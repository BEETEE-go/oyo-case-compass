
import { gapi } from 'gapi-script';

// Google Drive API configuration
const API_KEY = 'YOUR_GOOGLE_API_KEY'; // This still needs to be replaced with a valid API key
const CLIENT_ID = '222313442885-sqk6bfpecrssm9vnumla9tggulkmardf.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

/**
 * Initialize the Google Drive API client
 */
export const initGoogleDriveApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(() => {
        resolve();
      }).catch(error => {
        console.error('Error initializing Google API', error);
        reject(error);
      });
    });
  });
};

/**
 * Authenticate with Google Drive
 */
export const authenticateGoogleDrive = async (): Promise<boolean> => {
  try {
    await initGoogleDriveApi();
    
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      await gapi.auth2.getAuthInstance().signIn();
    }
    
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  } catch (error) {
    console.error('Google Drive authentication failed', error);
    throw error;
  }
};

/**
 * Upload a file to Google Drive
 */
export const uploadToGoogleDrive = async (file: File, folderId?: string): Promise<any> => {
  try {
    const authenticated = await authenticateGoogleDrive();
    
    if (!authenticated) {
      throw new Error('Not authenticated with Google Drive');
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
    const authenticated = await authenticateGoogleDrive();
    
    if (!authenticated) {
      throw new Error('Not authenticated with Google Drive');
    }
    
    let query = '';
    if (folderId) {
      query = `'${folderId}' in parents`;
    }
    
    const response = await gapi.client.drive.files.list({
      q: query,
      fields: 'files(id, name, mimeType, webViewLink, iconLink, thumbnailLink)',
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
    const authenticated = await authenticateGoogleDrive();
    
    if (!authenticated) {
      throw new Error('Not authenticated with Google Drive');
    }
    
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentFolderId ? [parentFolderId] : []
    };
    
    const response = await gapi.client.drive.files.create({
      resource: folderMetadata,
      fields: 'id, name, webViewLink'
    });
    
    return response.result;
  } catch (error) {
    console.error('Failed to create Google Drive folder', error);
    throw error;
  }
};
