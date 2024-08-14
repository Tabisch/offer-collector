export function getWeek(date) {
    const weekDate = new Date(date.valueOf())

    weekDate.setHours(0, 0, 0, 0);
    weekDate.setDate(weekDate.getDate() + 3 - (weekDate.getDay() + 6) % 7);
    var week1 = new Date(weekDate.getFullYear(), 0, 4);
    return 1 + Math.round(((weekDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

export function pennyDate(date, dayIndex) {
    let internalDate = new Date(date.valueOf())

    internalDate.setHours(0, 0, 0, 0);
    internalDate = internalDate - internalDate.getDay() * 86400000 + (dayIndex + 1) * 86400000

    return new Date(internalDate)
}