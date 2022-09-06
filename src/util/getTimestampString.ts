export function getTimestampString() {
    const now = new Date();
    let hours = now.getHours();
    const noon = ((hours / 12) == 0) ? '오전' : '오후';
    hours = (hours > 12) ? hours % 12 : hours;

    const minutes = now.getMinutes();
    const zero = minutes < 10 ? '0' : ''
    return `${noon} ${hours}:${zero}${minutes}`;
}
