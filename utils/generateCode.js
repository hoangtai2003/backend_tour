import { v4 as uuidv4 } from 'uuid';
export const generateTourCode = (startDate) => {
    const tourCodePrefix = "NDSGN";
    const uniqueId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const formattedDate = new Date(startDate).toISOString().slice(0, 10).split('-').reverse().join('').slice(0, 6);
    const tourCodeSuffix = uuidv4().slice(0, 2).toUpperCase();
    return `${tourCodePrefix}${uniqueId}-${formattedDate}${tourCodeSuffix}-H`;
};

export const generateProgramCode = () => {
    const randomNumbers = Array(3).fill().map(() => Math.floor(Math.random() * 10)).join('');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array(5).fill().map(() => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    const programCode =randomLetters + randomNumbers;

    return programCode;
};

export const generateBookingCode = () => {
    const randomNumbers = Array(8).fill().map(() => Math.floor(Math.random() * 10)).join('');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array(4).fill().map(() => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    const bookingCode = randomNumbers + randomLetters;

    return bookingCode;
};
