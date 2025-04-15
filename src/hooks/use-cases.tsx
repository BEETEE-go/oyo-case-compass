
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Case, Document, ChronologicalUpdate } from '@/types/case';
import { uploadToGoogleDrive, createGoogleDriveFolder, listGoogleDriveFiles } from '@/utils/googledrive';
import { toast } from '@/components/ui/use-toast';

// In-memory storage until we save to Google Drive
const casesCache: Record<string, Case> = {};

export const useCases = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCase = async (caseData: Omit<Case, 'id' | 'documents' | 'updates'>): Promise<Case | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate a unique ID for the case
      const caseId = uuidv4();
      
      // Create a folder in Google Drive for this case
      const folderName = `Case_${caseId}_${caseData.title.replace(/[^a-z0-9]/gi, '_')}`;
      const folder = await createGoogleDriveFolder(folderName);
      
      if (!folder || !folder.id) {
        throw new Error('Failed to create folder in Google Drive');
      }
      
      // Create the case object
      const newCase: Case = {
        id: caseId,
        ...caseData,
        documents: [],
        updates: []
      };
      
      // Save case metadata to Google Drive
      const caseMetadataFile = new File(
        [JSON.stringify(newCase, null, 2)],
        `case_${caseId}_metadata.json`,
        { type: 'application/json' }
      );
      
      await uploadToGoogleDrive(caseMetadataFile, folder.id);
      
      // Store in our local cache
      casesCache[caseId] = newCase;
      
      toast({
        title: "Case Created",
        description: `Case "${newCase.title}" has been created successfully.`
      });
      
      return newCase;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Error Creating Case",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addDocumentToCase = async (caseId: string, file: File): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Retrieve the case
      const caseData = casesCache[caseId];
      if (!caseData) {
        throw new Error('Case not found');
      }
      
      // Get case folder ID - we'll need to implement this in a real app by listing files and finding the folder
      const files = await listGoogleDriveFiles();
      const caseFolder = files.find(f => 
        f.mimeType === 'application/vnd.google-apps.folder' && 
        f.name.includes(`Case_${caseId}`));
      
      if (!caseFolder) {
        throw new Error('Case folder not found in Google Drive');
      }
      
      // Upload document to Google Drive
      const uploadedFile = await uploadToGoogleDrive(file, caseFolder.id);
      
      if (!uploadedFile || !uploadedFile.id) {
        throw new Error('Failed to upload document to Google Drive');
      }
      
      // Create document record
      const document: Document = {
        id: uploadedFile.id,
        name: file.name,
        uploadDate: new Date(),
        fileUrl: uploadedFile.webViewLink || '',
        fileType: file.type
      };
      
      // Update case with new document
      caseData.documents.push(document);
      
      // Update case metadata in Google Drive
      const updatedMetadataFile = new File(
        [JSON.stringify(caseData, null, 2)],
        `case_${caseId}_metadata.json`,
        { type: 'application/json' }
      );
      
      await uploadToGoogleDrive(updatedMetadataFile, caseFolder.id);
      
      // Update local cache
      casesCache[caseId] = caseData;
      
      return document;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCase,
    addDocumentToCase,
    loading,
    error
  };
};
