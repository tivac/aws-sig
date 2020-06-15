const dateCleanRegex = /[:\-]|\.\d{3}/g;

// Doesn't use a default for the date param because false is a nonsense input
// but wouldn't trigger to default value to be used instead
const xamzdate = (date) => (new Date(date || Date.now()))
    .toISOString()
    .replace(dateCleanRegex, "");

export default xamzdate;
