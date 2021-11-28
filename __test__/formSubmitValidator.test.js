// Import the js file to test
import { formSubmitValidator } from "../src/client/js/formValidator";

describe("Testing the URL validation functionality", () => {
    test("Testing the formSubmitValidator() function", () => {
        expect(formSubmitValidator).toBeDefined();
    });
});