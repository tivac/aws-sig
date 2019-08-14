beforeAll(() => {
    const spy = jest.spyOn(global.Date, "now");

    const base = new Date(Date.parse("1983-11-16 00:00:00.000-08:00"));

    spy.mockImplementation(() => base.getTime());
});
