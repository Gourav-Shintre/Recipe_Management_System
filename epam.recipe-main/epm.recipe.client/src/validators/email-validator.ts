import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  // Updated pattern to include period, underscore, hyphen, and ensuring no consecutive special characters
  const emailPattern = /^([a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@([a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*\.[a-zA-Z]{3,}))$/;
  const minLength = 6;

  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value as string;

    if (!email) {
      return null; // No error if the field is empty
    }

    if (email.length < minLength) {
      return { invalidEmail: `Email must have atleast 6 characters before @` };
    }

    // Match the email pattern
    const match = emailPattern.exec(email);

    if (match) {
      const localPart = match[1]; // Capturing group corresponding to the local part before the @
      const domainAndTLD = match[3];    // Capturing group from @ to the end

      // Check that neither the local part nor the domain part consists solely of numbers
      if (/^\d+$/.test(localPart) || /^\d+$/.test(domainAndTLD.split('.')[0])) {
        return { invalidEmail: 'Neither the local part nor the domain part of the email may consist solely of numbers.' };
      }

      return null; // Valid email
    }

    return { invalidEmail: 'The email format is invalid.' };
  };
}