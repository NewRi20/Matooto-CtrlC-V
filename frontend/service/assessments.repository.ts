import {
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
  DocumentReference,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface AssessmentQuestion {
  question: string;
  choices: string[];
  correctChoiceIndex: number;
}

export interface AssessmentVersion {
  story: string;
  questions: AssessmentQuestion[];
}

export interface GenerationMetaData {
  length: string;
  level: number;
}

export interface AssessmentData {
  id?: string;
  title: string;
  timeLimitMinutes: number;
  classId: DocumentReference;
  teacherId: DocumentReference;
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
  dueDate: Timestamp;
  scheduledFor: Timestamp;
  generationMetaData: GenerationMetaData;
  english_version: AssessmentVersion;
  motherTongueVersion: AssessmentVersion;
}

/**
 * Creates a new assessment in the database.
 * @param assessmentInput - The input data for the assessment, excluding fields that are auto-generated or derived.
 * @param classUid - The UID of the class this assessment belongs to.
 * @param teacherUid - The UID of the teacher creating the assessment.
 * @param dueDateJS - The due date for the assessment as a standard JavaScript Date object.
 * @param scheduledForJS - The scheduled date for the assessment as a standard JavaScript Date object.
 */
export const createAssessment = async (
  assessmentInput: Omit<AssessmentData, 'id' | 'createdAt' | 'classId' | 'teacherId' | 'dueDate' | 'scheduledFor'>,
  classUid: string,
  teacherUid: string,
  dueDateJS: Date,
  scheduledForJS: Date
) => {
  try {
    const classRef = doc(db, 'classes', classUid);
    const teacherRef = doc(db, 'users', teacherUid);

    const dueTimestamp = Timestamp.fromDate(dueDateJS);
    const scheduledTimestamp = Timestamp.fromDate(scheduledForJS);

    const newAssessment = {
      ...assessmentInput,
      classId: classRef,
      teacherId: teacherRef,
      dueDate: dueTimestamp,
      scheduledFor: scheduledTimestamp,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'assessments'), newAssessment);
    console.log("Assessment created with ID: ", docRef.id);
    return docRef.id;

  } catch (error) {
    console.error("Error creating assessment: ", error);
    throw error;
  }
};

/**
 * Fetches all assessments assigned to a specific class.
 * @param classUid - The plain string ID of the class
 */
export const getAssessmentsByClass = async (classUid: string) => {
  try {
    const classRef = doc(db, 'classes', classUid);

    const q = query(
      collection(db, 'assessments'), 
      where('classId', '==', classRef)
    );

    const querySnapshot = await getDocs(q);
    const assessments: AssessmentData[] = [];

    querySnapshot.forEach((docSnap) => {
      assessments.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<AssessmentData, 'id'>)
      });
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching class assessments: ", error);
    throw error;
  }
};

/**
 * Deletes an assessment from the database.
 * @param assessmentId - The ID of the assessment document to delete
 */
export const deleteAssessment = async (assessmentId: string) => {
  try {
    const assessmentRef = doc(db, 'assessments', assessmentId);
    
    await deleteDoc(assessmentRef);
    
    console.log(`Successfully deleted assessment: ${assessmentId}`);
  } catch (error) {
    console.error("Error deleting assessment: ", error);
    throw error;
  }
};