const { formatInTimeZone } = require('date-fns-tz');
const isoDate = '2024-12-18T16:23:45Z'; // ISO 8601 timestamp
const timeZone = 'Asia/Ho_Chi_Minh'; // Your local timezone

const formattedDate = formatInTimeZone(new Date(isoDate), timeZone, 'yyyy-MM-dd HH:mm:ss zzz');
console.log('Formatted Date:', formattedDate);
