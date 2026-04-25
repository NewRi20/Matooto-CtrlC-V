import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  DocumentReference,
  getDocs,
  query,
  where,
  deleteDoc,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface ClassData {
  id?: string;
  className: string;
  gradeLevel: number;
  subject: string;
  teacherId: DocumentReference;
  studentIds: DocumentReference[];
  classCode: string;
}

export interface CreateClassInput {
  className: string;
  gradeLevel: number;
  subject: string;
  teacherUid: string;
  studentUids?: string[];
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string | null;
  role?: string;
  onboarding?: boolean;
}

// Generates a unique class code (6 alphanumeric characters)
const generateClassCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// creates a new class document in Firestore
export const createClass = async (classData: CreateClassInput) => {
  try {
    const teacherRef = doc(db, "users", classData.teacherUid);
    const studentRefs = (classData.studentUids ?? []).map((uid) =>
      doc(db, "users", uid),
    );

    const newClassData = {
      className: classData.className,
      gradeLevel: classData.gradeLevel,
      subject: classData.subject,
      teacherId: teacherRef,
      studentIds: studentRefs,
      classCode: generateClassCode(),
    };

    const docRef = await addDoc(collection(db, "classes"), newClassData);
    console.log("Class created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating class: ", error);
    throw error;
  }
};

/**
 * Enrolls multiple students into an existing class at the same time.
 * @param classId - The ID of the class document
 * @param studentUids - An array of plain string IDs of the students joining
 */
export const enrollStudentsBatch = async (
  classId: string,
  studentUids: string[],
) => {
  try {
    if (studentUids.length === 0) {
      console.log("No students selected to enroll.");
      return;
    }

    const classRef = doc(db, "classes", classId);

    const studentRefs = studentUids.map((uid) => doc(db, "users", uid));

    await updateDoc(classRef, {
      studentIds: arrayUnion(...studentRefs),
    });

    console.log(
      `Successfully enrolled ${studentUids.length} students into class ${classId}`,
    );
  } catch (error) {
    console.error("Error in batch enrolling students: ", error);
    throw error;
  }
};

/**
 * Removes a student from a class.
 * @param classId - The ID of the class document
 * @param studentUid - The plain string ID of the student to remove
 */
export const removeStudentFromClass = async (
  classId: string,
  studentUid: string,
) => {
  try {
    const classRef = doc(db, "classes", classId);

    const studentRef = doc(db, "users", studentUid);

    await updateDoc(classRef, {
      studentIds: arrayRemove(studentRef),
    });

    console.log(
      `Student ${studentUid} successfully removed from class ${classId}`,
    );
  } catch (error) {
    console.error("Error removing student: ", error);
    throw error;
  }
};

/**
 * Fetches all classes taught by a specific teacher.
 * @param teacherUid - The plain string ID of the teacher
 */
export const getClassesByTeacher = async (teacherUid: string) => {
  try {
    const teacherRef = doc(db, "users", teacherUid);

    const q = query(
      collection(db, "classes"),
      where("teacherId", "==", teacherRef),
    );

    const querySnapshot = await getDocs(q);
    const classes: ClassData[] = [];

    querySnapshot.forEach((docSnap) => {
      classes.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ClassData, "id">),
      });
    });

    return classes;
  } catch (error) {
    console.error("Error fetching teacher classes: ", error);
    throw error;
  }
};

/**
 * Fetches all classes that a specific student is enrolled in.
 * @param studentUid - The plain string ID of the student
 */
export const getClassesByStudent = async (studentUid: string) => {
  try {
    const studentRef = doc(db, "users", studentUid);

    const q = query(
      collection(db, "classes"),
      where("studentIds", "array-contains", studentRef),
    );

    const querySnapshot = await getDocs(q);

    const classes: ClassData[] = [];
    querySnapshot.forEach((docSnap) => {
      classes.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ClassData, "id">),
      });
    });

    return classes;
  } catch (error) {
    console.error("Error fetching student classes: ", error);
    throw error;
  }
};

/**
 * Fetches a class by its class code.
 * @param classCode - The unique class code
 */
export const getClassByCode = async (classCode: string) => {
  try {
    const q = query(
      collection(db, "classes"),
      where("classCode", "==", classCode.toUpperCase()),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    return {
      id: docSnap.id,
      ...(docSnap.data() as Omit<ClassData, "id">),
    };
  } catch (error) {
    console.error("Error fetching class by code: ", error);
    throw error;
  }
};

/**
 * Deletes a class from the database.
 * @param classId - The ID of the class document to delete
 */
export const deleteClass = async (classId: string) => {
  try {
    const classRef = doc(db, "classes", classId);

    await deleteDoc(classRef);

    console.log(`Successfully deleted class: ${classId}`);
  } catch (error) {
    console.error("Error deleting class: ", error);
    throw error;
  }
};

/**
 * Fetches a single class by ID.
 * @param classId - The ID of the class document to fetch
 */
export const getClassById = async (classId: string) => {
  try {
    const classRef = doc(db, "classes", classId);
    const classSnap = await getDoc(classRef);

    if (!classSnap.exists()) {
      return null;
    }

    return {
      id: classSnap.id,
      ...(classSnap.data() as Omit<ClassData, "id">),
    };
  } catch (error) {
    console.error("Error fetching class by ID: ", error);
    throw error;
  }
};

/**
 * Allows a student to join a class using a class code.
 * @param classCode - The class code entered by the student
 * @param studentUid - The plain string ID of the student
 */
export const joinClassByCode = async (
  classCode: string,
  studentUid: string,
) => {
  try {
    const classData = await getClassByCode(classCode);

    if (!classData) {
      throw new Error("Class not found. Please check the code and try again.");
    }

    // Check if student is already enrolled
    const studentRef = doc(db, "users", studentUid);
    const isAlreadyEnrolled = classData.studentIds.some(
      (ref) => ref.id === studentUid,
    );

    if (isAlreadyEnrolled) {
      throw new Error("You are already enrolled in this class.");
    }

    // Enroll the student
    await enrollStudentsBatch(classData.id!, [studentUid]);

    return {
      success: true,
      classId: classData.id,
      className: classData.className,
    };
  } catch (error) {
    console.error("Error joining class by code: ", error);
    throw error;
  }
};
