"use strict";

const { headerXAmzDate : date } = require("../src/aws-sig.js");

describe("aws-sig core API", () => {
    afterEach(() => jest.restoreAllMocks());

    it("should export X-Amz-Date creation", () => {
        expect(typeof date).toBe("function");
    });

    it("should convert JS Date objects into X-Amz-Date format", () => {
        const input = new Date("Tue, 15 Nov 1994 08:12:31 GMT");

        expect(date(input)).toMatchSnapshot();
    });

    it("should use Date.now() if a date isn't specified", () => {
        const mock = jest.spyOn(Date, "now")
            .mockImplementation(() => Date.parse("Tue, 15 Nov 1994 08:12:31 GMT"));
        
        expect(date()).toMatchSnapshot();

        expect(mock).toHaveBeenCalled();
        expect(mock).toHaveReturned();
    });
});
