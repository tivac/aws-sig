const requestRequired = [
    "url",
];

const configRequired = [
    "accessKeyId",
    "region",
    "secretAccessKey",
    "service",
];

// Check for required params
const validate = (source, config) => {
    if(!source) {
        throw new Error(`Missing request object`);
    }

    if(!config) {
        throw new Error(`Missing config object`);
    }

    let missing = requestRequired.filter((field) => !source[field]);

    if(missing.length) {
        throw new Error(`Missing required request fields: ${missing.join(", ")}`);
    }
    
    missing = configRequired.filter((field) => !config[field]);

    if(missing.length) {
        throw new Error(`Missing required config fields: ${missing.join(", ")}`);
    }
};

export default validate;
