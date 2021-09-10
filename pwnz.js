module.exports=()=>{
    getDateFromUTC=(timeUTC)=>{
        //timeUTC in seconds
        let date = new Date(timeUTC * 1000); //convert secs into millisecs
        let dateStr = `${("0" + date.getHours()).slice(-2)}:${(
            "0" + date.getMinutes()
        ).slice(-2)} ${("0" + date.getDate()).slice(-2)}.${(
            "0" +
            (date.getMonth() + 1)
        ).slice(-2)}.${date.getFullYear()}`;
        return dateStr;
    },
    getDateToString=(date)=>{
        //date in ms
        let dateStr = `${("0" + date.getHours()).slice(-2)}:${(
            "0" + date.getMinutes()
        ).slice(-2)} ${("0" + date.getDate()).slice(-2)}.${(
            "0" +
            (date.getMonth() + 1)
        ).slice(-2)}.${date.getFullYear()}`;
        return dateStr;
    },
    strDateToDate=(strDate)=>{
        const time = strDate.split(" ")[0];
        const hour = time.split(":")[0];
        const minute = time.split(":")[1];
        const date = strDate.split(" ")[1];
        const day = date.split(".")[0];
        const month = date.split(".")[1] - 1;
        const year = date.split(".")[2];
        return new Date(year, month, day, hour, minute);
    },
    getWeekdayName=(weekdayNumber)=>{
        const weekdayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
        return weekdayNames[weekdayNumber];
    },
    getMonthName=(monthNumber)=>{
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        return monthNames[monthNumber];
    },
    getBeautifulDate=(dateStr)=>{
        let [day, month, year] = dateStr.split(" ")[1].split(".");
        month--;
        let date = new Date(year, month, day);
        return `${getWeekdayName(date.getDay())}, ${day} ${getMonthName(
            month
        )} ${year}`;
    }
}






