const config  = {
    region          : "us-east-1",
    service         : "service",
    accessKeyId     : "AKIDEXAMPLE",
    secretAccessKey : "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY",
};

export default (args = {}) => {
    return Object.assign(Object.create(null), config, args);
};
