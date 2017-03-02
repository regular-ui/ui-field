import Validation from '../';

describe('Validation', () => {
    describe('#~validate', () => {
        it('should result success when no rules.', (done) => {
            Validation.validate('test', [], (result) => {
                expect(result.success).to.be(true);
                done();
            });
        });

        it('should result success passed by all rules.', (done) => {
            Validation.validate('test', [
                { type: 'isRequired' },
                { type: 'isFilled' },
            ], (result) => {
                expect(result.success).to.be(true);
                done();
            });
        });

        it('should result failure and first failed message stopped by some rules.', (done) => {
            Validation.validate('  ', [
                { type: 'isRequired', message: 'Value is required.' },
                { type: 'isFilled', message: 'Value should be filled.' },
                { type: 'isEmail' },
            ], (result) => {
                expect(result.success).to.be(false);
                expect(result.message).to.be('Value should be filled.');
                done();
            });
        });

        it('should result failure with empty value and `isRequired` rule type.', (done) => {
            Validation.validate('', [{ type: 'isRequired' }], (result) => {
                expect(result.success).to.be(false);
                done();
            });
        });


        it('should result success with empty value and specific rule types.', (done) => {
            Validation.validate('', [
                { type: 'isFilled' },
                { type: 'is' },
                { type: 'isEmail' },
                { type: 'method' },
            ], (result) => {
                expect(result.success).to.be(true);
                done();
            });
        });

        it('should result success not-empty value and specific rule types.', (done) => {
            Validation.validate('test@126.com', [
                { type: 'isRequired' },
                { type: 'isFilled' },
                { type: 'is', options: /^\S+$/ },
                { type: 'isNot', options: /\s/ },
                { type: 'isEmail' },
                { type: 'method', options: (value) => value !== 'test@163.com' },
                { type: 'async', options: (value, done2) =>
                    setTimeout(() => done2(value !== 'result@163.com'), 200) },
            ], (result) => {
                expect(result.success).to.be(true);
                done();
            });
        });
    });
});
