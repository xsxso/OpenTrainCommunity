import _ from 'lodash';

const daysNames = [
    'ראשון',
    'שני',
    'שלישי',
    'רביעי',
    'חמישי',
    'שישי',
    'שבת',
];

const monthNames = [
    '',
    'ינואר',
    'פברואר',
    'מרץ',
    'אפריל',
    'מאי',
    'יוני',
    'יולי',
    'אוגוסט',
    'ספטמבר',
    'אוקטובר',
    'נובמבר',
    'דצמבר',
];

function isFullWeek(days) {
    if (days && days.length >= 7) {
        for (let i = 0; i <= 6; i++) {
            if (!days.includes(i)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function computeStart(l, months) {
    let [ly, lm] = l;
    let m1 = ly * 12 + lm - 1;
    let m2 = m1 - (months - 1);
    let sm = 1 + m2 % 12;
    let sy = (m2 - m2 % 12) / 12;
    return [sy, sm]
}

function getRange(s, e) {
    // s: start (y,m)
    // e: end (y,m)
    // return range of pairs from end to start (desc)

    let result = [];
    let [sy, sm] = s;
    let [ey, em] = e;
    let [cy, cm] = [sy, sm];
    while (cy != ey || cm != em) {
        result.push([cy, cm]);
        cm++;
        if (cm == 13) {
            cm = 1;
            cy++;
        }
    }
    result.push([ey, em]);
    result.reverse();
    return result;
}

function formatHours(hours) {
    hours = _.sortBy(hours);
    let pairs = [];
    let curStart = null;
    let curEnd = null;
    for (let h of hours) {
        if (curEnd !== null && h == curEnd+1) {
            curEnd = h;
        } else {
            if (curStart !== null) {
                pairs.push([curStart, curEnd]);
            }
            curStart = h;
            curEnd = h;
        }
    }
    pairs.push([curStart, curEnd]);
    let pairsStrs = pairs.map(p => p[0] === p[1] ? p[0] : `${p[0]}-${p[1]}`);
    return pairsStrs.join(",");
}

const dtUtils = {
    monthNames,
    daysNames,
    getRange,
    computeStart,
    isFullWeek,
    formatHours,
};

export default dtUtils;


