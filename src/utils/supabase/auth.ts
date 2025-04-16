"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * This function handles user login using email and password authentication with Supabase.
 * It takes a FormData object as input, extracts the email and password fields,
 * and uses the Supabase client to sign in the user.
 * If the sign-in is successful, it returns an object with a success property set to true.
 * If there is an error during the sign-in process, it throws an error with the error message.
 *
 * @param formData - FormData object containing the email and password fields
 * @param formData.get("email") - The email address of the user
 * @param formData.get("password") - The password of the user
 *
 * @throws {Error} - Throws an error if the sign-in process fails
 *
 * @returns { success: boolean } - An object indicating the success of the login operation
 */
export async function LoginWithEmailAndPassword(formData: FormData) {
	const supabase = await createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		throw new Error(error.message);
	}

	return { success: true };
}
