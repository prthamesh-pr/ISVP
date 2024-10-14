import { initializeApp } from "firebase/app";
import { getDatabase, set, ref } from "firebase/database";

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

export function register(registerData) {
  try {
    const dbb = getDatabase();
    set(ref(dbb, "ScholarshipPortalDashboard/users/" + registerData.phoneNumber), {
      name: registerData.name,
      phoneNumber: registerData.phoneNumber,
      email: registerData.email,
      password: registerData.password,
      confirmPassword: registerData.confirmPassword,
    });
    return true;
  } catch (error) {
    return false;
  }
}

