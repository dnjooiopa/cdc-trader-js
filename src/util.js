function getLocaleString() {
  return new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
}

function log(msg) {
  console.log(getLocaleString(), ':', msg);
}

module.exports = {
  getLocaleString,
  log
};