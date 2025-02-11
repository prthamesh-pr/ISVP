import { initializeApp } from "firebase/app";
import { getDatabase, set, ref,get } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAiJf1SDTPpfRHr4NwckDu_1ImNpju6y14",
  authDomain: "jarvis-systems-commons.firebaseapp.com",
  databaseURL: "https://jarvis-systems-commons-default-rtdb.firebaseio.com",
  projectId: "jarvis-systems-commons",
  storageBucket: "jarvis-systems-commons.appspot.com",
  messagingSenderId: "383480447879",
  appId: "1:383480447879:web:45baeaa9517cbb97088922",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const storage = getStorage(app);

export function register(registerData) {
  try {
    const dbb = getDatabase();
    const userRef = ref(dbb, "ScholarshipPortalDashboard/users/" + registerData.phoneNumber);

    // Prepare the data to be stored based on userType
    const userData = {
      name: registerData.name,
      phoneNumber: registerData.phoneNumber,
      email: registerData.email,
      password: registerData.password,
      confirmPassword: registerData.confirmPassword,
      userType: registerData.userType,
      collegeName : registerData.collegeName,
      collegeCenterCode : registerData.collegeCenterCode
    };


    // Set the user data in the database
    set(userRef, userData);
    return true;
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
}

export async function collegeListUpdate(collegeName, collegeCenterCode) {
  try {
    const dbb = getDatabase();
    await set(ref(dbb, "ScholarshipPortalDashboard/colleges/" + collegeCenterCode), {
      name: collegeName,
      collegeCenterCode: collegeCenterCode
    });
    console.log(`College Registered: ${collegeName}, Center Code: ${collegeCenterCode}`);
    return true;
  } catch (error) {
    console.error("Error updating college list:", error);
    return false;
  }
}

export async function getAllColleges() {
  try {
    const dbb = getDatabase();
    const collegeRef = ref(dbb, "ScholarshipPortalDashboard/colleges/");
    const snapshot = await get(collegeRef);
    
    if (snapshot.exists()) {
      const colleges = snapshot.val();
      return Object.fromEntries(Object.values(colleges).map(college => [college.collegeCenterCode, college.name]));
    } else {
      console.log("No colleges found.");
      return {};
    }
  } catch (error) {
    console.error("Error retrieving colleges:", error);
    return {};
  }
}
