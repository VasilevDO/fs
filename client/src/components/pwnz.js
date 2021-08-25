export function randomInt(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

export function iso8601ToDateStr(isoStr) {
  const [date, time] = isoStr.split('T');
  const [year, month, day] = date.split('-');
  const [hour, minute, second] = time.split('.')[0].split(':');
  const tzo = new Date().getTimezoneOffset() / 60;//timezone offset
  const dateWithTzo = new Date(year, month - 1, day, +hour - tzo, minute, second);

  const yearStr = dateWithTzo.getFullYear();
  const monthStr = ('0' + (dateWithTzo.getMonth() + 1)).slice(-2);
  const dayStr = ('0' + dateWithTzo.getDate()).slice(-2);

  const hourStr = ('0' + dateWithTzo.getHours()).slice(-2);
  const minuteStr = ('0' + dateWithTzo.getMinutes()).slice(-2);
  const secondsStr = ('0' + dateWithTzo.getSeconds()).slice(-2);

  return hourStr + ':' + minuteStr + ':' + secondsStr + ' ' + dayStr + '.' + monthStr + '.' + yearStr;
}

export function getAge (birthDate) {
  const fullYears=new Date().getFullYear()-birthDate.getFullYear();
  return fullYears;
}

export function dateToString(date) {
  //date in ms
  let dateStr = `${("0" + date.getHours()).slice(-2)}:${(
    "0" + date.getMinutes()
  ).slice(-2)} ${("0" + date.getDate()).slice(-2)}.${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}.${date.getFullYear()}`;
  return dateStr;
}

export function getBeautifulDate(dateStr) {
  let [day, month, year] = dateStr.split(" ")[1].split(".");
  month--;
  let date = new Date(year, month, day);
  return `${getWeekdayName(date.getDay())}, ${day} ${getMonthName(
    month
  )} ${year}`;
}

export function unixToBeautifulDateWithTime (unixTimestamp) {
  const date=new Date(unixTimestamp*1000);
  const year=date.getFullYear();
  const month=date.getMonth();
  const day=('0'+date.getDate()).slice(-2);
  const hour=('0'+date.getHours()).slice(-2);
  const minute=('0'+date.getMinutes()).slice(-2);
  const weekday=getWeekdayName(date.getDay());
  return `${hour}:${minute} ${weekday}, ${day} ${getMonthName(month)} ${year}`
}

export function unixToDate(unixTimestamp) {
  return new Date(unixTimestamp*1000);
}

export function getWeekdayName(weekdayNumber) {
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
}

export function getMonthName(monthNumber) {
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
}

/**
 Button with toggle menu
  <div className='pwnz-bwtm'>
            <div className='pwnz-button pwnz-bwtm-bd'>
                <div className='pwnz-bwtm-b'>Button text 1</div>
                <div style={{display:'none'}}  className='pwnz-bwtm-b'>Button text 2</div>
            </div>
          <div className='pwnz-bwtm-c' style={{display:'none'}}>
            Toggle menu content
          </div>
    </div>




Button

            <div className='pwnz-button' >
              <div onClick={}>Button text</div>
            </div>

Button with drop menu

  <div className='pwnz-bwdm'>
              <div className='pwnz-button pwnz-bwdm-bd'>
                <div className='pwnz-bwdm-b'>Button text</div>
              </div>
              <div className='pwnz-bwdm-c pwnz-bwdm-downLeft pwnz-p10' style={{ display: 'none' }}>
                <div className='pwnz-bwdm-c-inner'>
                  <div className='pwnz-button pwnz-f-c'>
                    <div className='pwnz-nowrap'>Report</div>
                  </div>
                </div>
              </div>
            </div>

 */