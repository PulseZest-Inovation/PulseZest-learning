
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../utils/Firebase/firebaseConfig";

const fetchCourseData = async (docId) => {
  try {
    const docRef = doc(db, "courses", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};

export default fetchCourseData;
