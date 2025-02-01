export const academicYearCalc = (gradYear) => {
    const yearsInString = ["First", "Second", "Third", "Final"];

    const currDate = new Date();
    const currentYear = currDate.getFullYear();
    const currentMonth = currDate.getMonth();

    const yearDifference = gradYear - currentYear;
    let academicYear = 4 - yearDifference;

    if (currentMonth >= 7) academicYear++;
    // console.log(yearsInString[academicYear - 1]);

    return yearsInString[academicYear - 1];
};
