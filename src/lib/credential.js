const credential = (req) => {
    const {
        accessKeyId,
        date,
        region,
        service,
    } = req;

    return `${accessKeyId}/${date.short}/${region}/${service}/aws4_request`;
};

export default credential;
