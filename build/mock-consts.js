"use strict";

// Mock the module provided by rollup-plugin-consts when running in jest
jest.mock("consts:testing", () => true, { virtual : true });
