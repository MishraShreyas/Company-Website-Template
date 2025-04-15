"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import {
	doc,
	getDoc,
	setDoc,
	serverTimestamp,
	collection,
	addDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserProfile, UserRole, ActivityLog } from "@/lib/types";
import { LoadingSpinner } from "@/components/common/LoadingSpinner"; // Create this component

interface AuthContextProps {
	user: FirebaseUser | null;
	userProfile: UserProfile | null;
	loading: boolean;
	isAdmin: boolean;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Helper function to log activity
const logActivity = async (
	userId: string,
	action: "login" | "logout",
	userName?: string | null
) => {
	try {
		const logEntry: Omit<ActivityLog, "id"> = {
			userId,
			userName: userName || "Unknown",
			action,
			timestamp: serverTimestamp() as any, // Cast needed until Firestore types improve
			// ipAddress: // Fetch IP if needed (server-side recommended for accuracy/privacy)
		};
		await addDoc(collection(db, "activityLogs"), logEntry);
		console.log(`Activity logged: ${action} for user ${userId}`);
	} catch (error) {
		console.error("Error logging activity:", error);
	}
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<FirebaseUser | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			setLoading(true);
			if (firebaseUser) {
				setUser(firebaseUser);
				// Fetch or create user profile in Firestore
				const userRef = doc(db, "users", firebaseUser.uid);
				const docSnap = await getDoc(userRef);

				if (docSnap.exists()) {
					const profileData = docSnap.data() as UserProfile;
					setUserProfile(profileData);
					// Log login only if it's a new session, not just profile fetch
					// This basic check might log multiple times on refresh, needs refinement
					// A better approach might involve session tracking or checking last activity log
					if (!userProfile || userProfile.uid !== firebaseUser.uid) {
						await logActivity(
							firebaseUser.uid,
							"login",
							profileData.displayName
						);
					}
				} else {
					// Create a new user profile if it doesn't exist (e.g., first login)
					console.log(
						"Creating new user profile for:",
						firebaseUser.uid
					);
					const newUserProfile: UserProfile = {
						uid: firebaseUser.uid,
						email: firebaseUser.email,
						displayName:
							firebaseUser.displayName ||
							firebaseUser.email?.split("@")[0] ||
							"New User",
						role: "employee", // Default role
						createdAt: serverTimestamp() as any, // Cast needed
						// photoURL: firebaseUser.photoURL, // Optional
					};
					try {
						await setDoc(userRef, newUserProfile);
						setUserProfile(newUserProfile);
						await logActivity(
							firebaseUser.uid,
							"login",
							newUserProfile.displayName
						);
					} catch (error) {
						console.error("Error creating user profile:", error);
						// Handle error appropriately - maybe logout user?
						setUser(null);
						setUserProfile(null);
					}
				}
			} else {
				setUser(null);
				setUserProfile(null);
			}
			setLoading(false);
		});

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []); // Rerun only on mount/unmount

	const logout = async () => {
		if (user && userProfile) {
			await logActivity(user.uid, "logout", userProfile.displayName);
		}
		await auth.signOut();
		setUser(null);
		setUserProfile(null);
		// Optionally redirect to login page via router
	};

	const isAdmin = userProfile?.role === "admin";

	// Show loading spinner while auth state is being determined
	if (loading) {
		return <LoadingSpinner fullScreen />; // Create a loading spinner component
	}

	return (
		<AuthContext.Provider
			value={{ user, userProfile, loading, isAdmin, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextProps => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
