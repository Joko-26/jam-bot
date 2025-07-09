

export function timeSplitter(timeString: string) {
    const split_timeString = timeString.split(" ")
    const time = split_timeString[1].split(":")
    const date = split_timeString[0].split(".")
    const stringTime = `${date[0]}.${date[1]}.${date[2]} ${time[0]}:${time[1]}` 
    return stringTime
}

export function getFormattedDate(): string {
  const now = new Date();

  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString().slice(-2);
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export function getTimeasDate(timeString:string) {
    const match = timeString.match(/^(\d{2})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})$/);
    if (!match) return null;
    const [_, day, month, year, hour, minute] = match;
    const fullYear = parseInt(year) + 2000;

    return new Date(fullYear, parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
}

export function getTimeUntil(targetStr: string): string {
    const targetDate = getTimeasDate(targetStr);
    if (!targetDate) return "invalid time format";
    
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();

    if (diffMs <= 0) return "past"; 

    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    return `${days}d ${hours}h ${minutes}m`
}