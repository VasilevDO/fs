export function randomInt(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

export function iso8601ToDateStr (isoStr) {
  const [date,time]=isoStr.split('T');
  const [year,month,day]=date.split('-');
  const [hour,minute,second]=time.split('.')[0].split(':');
  const tzo=new Date().getTimezoneOffset()/60;//timezone offset
  const dateWithTzo=new Date(year,month-1,day,+hour-tzo,minute,second);

  const yearStr=dateWithTzo.getFullYear();
  const monthStr=('0'+(dateWithTzo.getMonth()+1)).slice(-2);
  const dayStr=('0'+dateWithTzo.getDate()).slice(-2);

  const hourStr=('0'+dateWithTzo.getHours()).slice(-2);
  const minuteStr=('0'+dateWithTzo.getMinutes()).slice(-2);
  const secondsStr=('0'+dateWithTzo.getSeconds()).slice(-2);

  return hourStr+':'+minuteStr+':'+secondsStr+' '+dayStr+'.'+monthStr+'.'+yearStr;
}




/**
 Button with toggle menu
  <div className='pwnz-bwtm'>
            <div className='pwnz-bwtm-bd'>
              <span className='pwnz-button pwnz-bwtm-b'>Button text 1</span>  
              <span style={{display:'none'}} className='pwnz-button pwnz-bwtm-b'>Button text 2</span>  
            </div>
          <div className='pwnz-bwtm-c' style={{display:'none'}}>
            Toggle menu content
          </div>
    </div>
 */