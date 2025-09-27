import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
} from "firebase/firestore";

// Create a new document
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

// Read all documents from a collection
export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: documents };
  } catch (error) {
    console.error(`Error fetching documents from ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

// // Update a document - can add/update fields
// export const updateDocument = async (collectionName, documentId, updates) => {
//   try {
//     const docRef = doc(db, collectionName, documentId);
//     await updateDoc(docRef, {
//       ...updates,
//       updatedAt: Date.now(),
//     });
//     return { success: true };
//   } catch (error) {
//     console.error(`Error updating document in ${collectionName}:`, error);
//     return { success: false, error: error.message };
//   }
// };

// Update a document - can add/update fields
export const updateDocument = async (collectionName, documentId, updates) => {
  try {
    console.log(
      `Updating document ${documentId} in ${collectionName}:`,
      updates
    );
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now(),
    });
    console.log("Document updated successfully");
    return { success: true };
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

// Add a single field to a document
export const addFieldToDocument = async (
  collectionName,
  documentId,
  fieldName,
  fieldValue
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      [fieldName]: fieldValue,
      updatedAt: Date.now(),
    });
    return { success: true };
  } catch (error) {
    console.error(
      `Error adding field to document in ${collectionName}:`,
      error
    );
    return { success: false, error: error.message };
  }
};

// Delete a field from a document
export const deleteFieldFromDocument = async (
  collectionName,
  documentId,
  fieldName
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      [fieldName]: deleteField(),
      updatedAt: Date.now(),
    });
    return { success: true };
  } catch (error) {
    console.error(
      `Error deleting field from document in ${collectionName}:`,
      error
    );
    return { success: false, error: error.message };
  }
};

// Delete an entire document
export const deleteDocument = async (collectionName, documentId) => {
  try {
    console.log(`Deleting document ${documentId} from ${collectionName}`);
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    console.log("Document deleted successfully");
    return { success: true };
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};
