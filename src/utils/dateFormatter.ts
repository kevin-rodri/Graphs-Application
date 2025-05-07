// Handles formatting of dates and times for the application
export class DateFormatter {
  // https://stackoverflow.com/questions/11591854/format-date-to-mm-dd-yyyy-in-javascript
  formatDate(date: string): string {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    let month = (1 + newDate.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    let day = newDate.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return `${month}/${day}/${year}`;
  }

  formatDateWithTime(date: string): string {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    let month = (1 + newDate.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    let day = newDate.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    let hours = newDate.getHours().toString();
    hours = hours.length > 1 ? hours : "0" + hours;
    let minutes = newDate.getMinutes().toString();
    minutes = minutes.length > 1 ? minutes : "0" + minutes;
    return `${month}/${day}/${year}-${hours}:${minutes}`;
  }
}
