/**
 * Formats a datetime string in the format "YYYY-MM-DD" to "DD Month, YYYY".
 * 
 * Used for articles in the news section, which have a date field that is stored as a datetime string.
 * 
 * @param datetime The datetime string to format, in the format "YYYY-MM-DD"
 * @returns The formatted datetime string in the format "DD Month, YYYY"
 */
export function formatArticleDatetimeString(datetime: string) {
    const monthMap: Record<string, string> = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December",
    };

    const [year, month, day] = datetime.split("-");
    return `${day} ${monthMap[month]}, ${year}`
}