import encode from "strict-uri-encode";

const sort = (a, b) => a.localeCompare(b);

// Sort query parameters by key
// Then also sort by value because AWS
export default ({ url }) => {
    const source = {};
    const params = [];
    
    url.searchParams.forEach((value, key) => {
        if(!source[key]) {
            source[key] = [];
        }

        source[key].push(value);
    });

    Object.keys(source)
        .sort(sort)
        .forEach((key) => {
            source[key]
                .sort(sort)
                .forEach((value) => {
                    params.push(`${encode(key)}=${encode(value)}`);
                });
        });

    return params.join("&");
};
