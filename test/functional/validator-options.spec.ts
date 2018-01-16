import "es6-shim";
import {IsNotEmpty, Min} from "../../src/decorator/decorators";
import {Validator} from "../../src/validation/Validator";
import {expect} from "chai";

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

let validator: Validator;

// -------------------------------------------------------------------------
// Specifications: common decorators
// -------------------------------------------------------------------------

describe("validator options", function () {
    beforeEach(() => validator = new Validator());

    it("should not return target in validation error if validationError: { target: false } is set", function () {
        class MyClass {
            @IsNotEmpty()
            title: string = "";
            isActive: boolean;
        }

        const model = new MyClass();
        model.title = "";
        return validator.validate(model, {
            skipMissingProperties: true,
            validationError: {target: false}
        }).then(errors => {
            errors.length.should.be.equal(1);
            expect(errors[0].target).to.be.undefined;
            errors[0].property.should.be.equal("title");
            errors[0].constraints.should.be.eql({isNotEmpty: "title should not be empty"});
            errors[0].value.should.be.equal("");
        });
    });

    describe("validator options: skipOnFail", () => {
        class MyTestClass {
            @IsNotEmpty()
            @Min(10)
            prop: string;

        }

        it("should stop validating on first error when skipOnFail is set to true", () => {

            const instance = new MyTestClass();

            return validator.validate(instance, {
                skipOnFail: true
            }).then((errors) => {

                expect(Object.keys(errors[0].constraints)).to.have.length(1);
                console.log("errors", errors);
            });

        });

        it("should continue validating on first error when skipOnFail is set to false", () => {

            const instance = new MyTestClass();

            return validator
                .validate(instance, {
                    skipOnFail: false
                })
                .then((errors) => expect(Object.keys(errors[0].constraints)).to.have.length(2));

        });
    });


});
