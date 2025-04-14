
import * as MicrosoftGraph from '@microsoft/microsoft-graph-client';
import * as msal from '@azure/msal-browser';
import { DriveItem, Site } from '@microsoft/microsoft-graph-types';

// Configure MSAL instance
const msalConfig = {
  auth: {
    clientId: 'YOUR_AZURE_AD_CLIENT_ID', // Replace with your actual client ID
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // Replace with your tenant ID
    redirectUri: window.location.origin
  }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

export const authenticateSharePoint = async (): Promise<string> => {
  const loginRequest = {
    scopes: ['Files.ReadWrite', 'Sites.ReadWrite.All']
  };

  try {
    const response = await msalInstance.loginPopup(loginRequest);
    return response.accessToken;
  } catch (error) {
    console.error('Authentication failed', error);
    throw error;
  }
};

export const uploadToSharePoint = async (file: File, folderPath: string): Promise<DriveItem> => {
  const accessToken = await authenticateSharePoint();
  
  const client = MicrosoftGraph.Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  try {
    const fileBuffer = await file.arrayBuffer();
    
    const uploadResponse = await client
      .api(`/sites/root/drives/root:/Documents/${folderPath}:/children`)
      .put(fileBuffer);

    return uploadResponse;
  } catch (error) {
    console.error('SharePoint upload failed', error);
    throw error;
  }
};

export const listSharePointFiles = async (folderPath: string): Promise<DriveItem[]> => {
  const accessToken = await authenticateSharePoint();
  
  const client = MicrosoftGraph.Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  try {
    const files = await client
      .api(`/sites/root/drives/root:/Documents/${folderPath}:/children`)
      .get();

    return files.value;
  } catch (error) {
    console.error('Failed to list SharePoint files', error);
    throw error;
  }
};
